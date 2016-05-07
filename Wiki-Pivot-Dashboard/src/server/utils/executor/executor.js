var path = require('path');
var fs = require('fs-promise');
var Q = require('q');
var plywood_1 = require('plywood');
var index_1 = require('../../../common/models/index');
var parser_1 = require('../../../common/utils/parser/parser');
function getReferences(ex) {
    var references = [];
    ex.forEach(function (ex) {
        if (ex instanceof plywood_1.RefExpression) {
            references.push(ex.name);
        }
    });
    return references;
}
/**
 * Look for all instances of countDistinct($blah) and return the blahs
 * @param ex
 * @returns {string[]}
 */
function getCountDistinctReferences(ex) {
    var references = [];
    ex.forEach(function (ex) {
        if (ex instanceof plywood_1.ChainExpression) {
            var actions = ex.actions;
            for (var _i = 0; _i < actions.length; _i++) {
                var action = actions[_i];
                if (action.action === 'countDistinct') {
                    var refExpression = action.expression;
                    if (refExpression instanceof plywood_1.RefExpression)
                        references.push(refExpression.name);
                }
            }
        }
    });
    return references;
}
/**
 * This function tries to deduce the structure of the dataSource based on the dimensions and measures defined within.
 * It should only be used when, for some reason, introspection if not available.
 * @param dataSource
 * @returns {Attributes}
 */
function deduceAttributes(dataSource) {
    var attributeJSs = [];
    var timeAttribute = dataSource.timeAttribute;
    if (timeAttribute) {
        attributeJSs.push({ name: timeAttribute.name, type: 'TIME' });
    }
    dataSource.dimensions.forEach(function (dimension) {
        var expression = dimension.expression;
        if (expression.equals(timeAttribute))
            return;
        var references = getReferences(expression);
        for (var _i = 0; _i < references.length; _i++) {
            var reference = references[_i];
            if (reference === 'main')
                continue;
            attributeJSs.push({ name: reference, type: 'STRING' });
        }
    });
    dataSource.measures.forEach(function (measure) {
        var expression = measure.expression;
        var references = getReferences(expression);
        var countDistinctReferences = getCountDistinctReferences(expression);
        for (var _i = 0; _i < references.length; _i++) {
            var reference = references[_i];
            if (reference === 'main')
                continue;
            if (countDistinctReferences.indexOf(reference) !== -1) {
                attributeJSs.push({ name: reference, special: 'unique' });
            }
            else {
                attributeJSs.push({ name: reference, type: 'NUMBER' });
            }
        }
    });
    var attributes = plywood_1.AttributeInfo.fromJSs(attributeJSs);
    if (dataSource.attributeOverrides.length) {
        attributes = plywood_1.AttributeInfo.applyOverrides(attributes, dataSource.attributeOverrides);
    }
    return attributes;
}
function getFileData(filePath) {
    return fs.readFile(filePath, 'utf-8').then(function (fileData) {
        try {
            return parser_1.parseData(fileData, path.extname(filePath));
        }
        catch (e) {
            throw new Error("could not parse '" + filePath + "': " + e.message);
        }
    }).then(function (fileJSON) {
        fileJSON.forEach(function (d) {
            d['time'] = new Date(d['time']);
        });
        return fileJSON;
    });
}
exports.getFileData = getFileData;
function externalFactory(dataSource, druidRequester, timeout, introspectionStrategy) {
    var countDistinctReferences = [];
    if (dataSource.measures) {
        countDistinctReferences = [].concat.apply([], dataSource.measures.toArray().map(function (measure) {
            return getCountDistinctReferences(measure.expression);
        }));
    }
    var context = {
        timeout: timeout
    };
    if (dataSource.introspection === 'none') {
        return Q(new plywood_1.DruidExternal({
            suppress: true,
            dataSource: dataSource.source,
            timeAttribute: dataSource.timeAttribute.name,
            customAggregations: dataSource.options.customAggregations,
            attributes: plywood_1.AttributeInfo.applyOverrides(deduceAttributes(dataSource), dataSource.attributeOverrides),
            introspectionStrategy: introspectionStrategy,
            filter: dataSource.subsetFilter,
            context: context,
            requester: druidRequester
        }));
    }
    else {
        var introspectedExternalPromise = new plywood_1.DruidExternal({
            suppress: true,
            dataSource: dataSource.source,
            timeAttribute: dataSource.timeAttribute.name,
            attributeOverrides: dataSource.attributeOverrides,
            customAggregations: dataSource.options.customAggregations,
            introspectionStrategy: introspectionStrategy,
            filter: dataSource.subsetFilter,
            context: context,
            requester: druidRequester
        }).introspect();
        if (!countDistinctReferences) {
            return introspectedExternalPromise;
        }
        return introspectedExternalPromise.then(function (introspectedExternal) {
            var attributes = introspectedExternal.attributes;
            for (var _i = 0; _i < attributes.length; _i++) {
                var attribute = attributes[_i];
                // This is a metric that should really be a HLL
                if (attribute.type === 'NUMBER' && countDistinctReferences.indexOf(attribute.name) !== -1) {
                    introspectedExternal = introspectedExternal.updateAttribute(plywood_1.AttributeInfo.fromJS({
                        name: attribute.name,
                        special: 'unique'
                    }));
                }
            }
            return introspectedExternal;
        });
    }
}
exports.externalFactory = externalFactory;
function dataSourceFillerFactory(druidRequester, configDirectory, timeout, introspectionStrategy) {
    return function (dataSource) {
        switch (dataSource.engine) {
            case 'native':
                // Do not do anything if the file was already loaded
                if (dataSource.executor)
                    return Q(dataSource);
                if (!configDirectory) {
                    throw new Error('Must have a config directory');
                }
                var filePath = path.resolve(configDirectory, dataSource.source);
                return getFileData(filePath).then(function (rawData) {
                    var dataset = plywood_1.Dataset.fromJS(rawData).hide();
                    dataset.introspect();
                    if (dataSource.subsetFilter) {
                        dataset = dataset.filter(dataSource.subsetFilter.getFn(), {});
                    }
                    var executor = plywood_1.basicExecutorFactory({
                        datasets: { main: dataset }
                    });
                    return dataSource.setAttributes(dataset.attributes).attachExecutor(executor);
                });
            case 'druid':
                return externalFactory(dataSource, druidRequester, timeout, introspectionStrategy).then(function (external) {
                    var executor = plywood_1.basicExecutorFactory({
                        datasets: { main: external }
                    });
                    return dataSource.setAttributes(external.attributes).attachExecutor(executor);
                }).then(index_1.DataSource.updateMaxTime);
            default:
                throw new Error("Invalid engine: '" + dataSource.engine + "' in '" + dataSource.name + "'");
        }
    };
}
exports.dataSourceFillerFactory = dataSourceFillerFactory;
//# sourceMappingURL=executor.js.map