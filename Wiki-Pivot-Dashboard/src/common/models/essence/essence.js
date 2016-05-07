var immutable_1 = require('immutable');
var lz_string_1 = require('lz-string');
var immutable_class_1 = require('immutable-class');
var chronoshift_1 = require('chronoshift');
var plywood_1 = require('plywood');
var filter_1 = require('../filter/filter');
var filter_clause_1 = require('../filter-clause/filter-clause');
var highlight_1 = require('../highlight/highlight');
var splits_1 = require('../splits/splits');
var colors_1 = require('../colors/colors');
var manifest_1 = require('../manifest/manifest');
var HASH_VERSION = 1;
function constrainDimensions(dimensions, dataSource) {
    return dimensions.filter(function (dimensionName) { return Boolean(dataSource.getDimension(dimensionName)); });
}
function constrainMeasures(measures, dataSource) {
    return measures.filter(function (measureName) { return Boolean(dataSource.getMeasure(measureName)); });
}
/**
 * FairGame   - Run all visualizations pretending that there is no current
 * UnfairGame - Run all visualizations but mark current vis as current
 * KeepAlways - Just keep the current one
 */
(function (VisStrategy) {
    VisStrategy[VisStrategy["FairGame"] = 0] = "FairGame";
    VisStrategy[VisStrategy["UnfairGame"] = 1] = "UnfairGame";
    VisStrategy[VisStrategy["KeepAlways"] = 2] = "KeepAlways";
})(exports.VisStrategy || (exports.VisStrategy = {}));
var VisStrategy = exports.VisStrategy;
var check;
var Essence = (function () {
    function Essence(parameters) {
        this.visualizations = parameters.visualizations;
        var dataSource = parameters.dataSource;
        if (!dataSource)
            throw new Error('Essence must have a dataSource');
        this.dataSource = dataSource;
        this.timezone = parameters.timezone || chronoshift_1.Timezone.UTC;
        var filter = parameters.filter;
        if (!filter && dataSource.timeAttribute) {
            filter = dataSource.defaultFilter.setSelection(dataSource.timeAttribute, plywood_1.$(filter_clause_1.FilterClause.MAX_TIME_REF_NAME).timeRange(dataSource.defaultDuration, -1));
        }
        this.filter = filter;
        this.splits = parameters.splits;
        this.selectedMeasures = parameters.selectedMeasures;
        this.pinnedDimensions = parameters.pinnedDimensions;
        this.colors = parameters.colors;
        this.pinnedSort = parameters.pinnedSort;
        this.compare = parameters.compare;
        this.highlight = parameters.highlight;
        // Place vis here because it needs to know about splits and colors (and maybe later other things)
        var visualization = parameters.visualization;
        if (!visualization) {
            var visAndResolve = this.getBestVisualization(this.splits, this.colors, null);
            visualization = visAndResolve.visualization;
        }
        this.visualization = visualization;
        var visResolve = visualization.handleCircumstance(this.dataSource, this.splits, this.colors, true);
        if (visResolve.isAutomatic()) {
            var adjustment = visResolve.adjustment;
            this.splits = adjustment.splits;
            this.colors = adjustment.colors || null;
            visResolve = visualization.handleCircumstance(this.dataSource, this.splits, this.colors, true);
            if (!visResolve.isReady()) {
                console.log(visResolve);
                throw new Error('visualization must be ready after automatic adjustment');
            }
        }
        this.visResolve = visResolve;
    }
    Essence.isEssence = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, Essence);
    };
    Essence.fromHash = function (hash, context) {
        var parts = hash.split('/');
        if (parts.length < 3)
            return null;
        var visualization = parts.shift();
        var version = parseInt(parts.shift(), 10);
        if (version !== 1)
            return null;
        var jsArray = null;
        try {
            jsArray = JSON.parse('[' + lz_string_1.decompressFromBase64(parts.join('/')) + ']');
        }
        catch (e) {
            return null;
        }
        if (!Array.isArray(jsArray))
            return null;
        var jsArrayLength = jsArray.length;
        if (!(6 <= jsArrayLength && jsArrayLength <= 9))
            return null;
        var essence;
        try {
            essence = Essence.fromJS({
                visualization: visualization,
                timezone: jsArray[0],
                filter: jsArray[1],
                splits: jsArray[2],
                selectedMeasures: jsArray[3],
                pinnedDimensions: jsArray[4],
                pinnedSort: jsArray[5],
                colors: jsArray[6] || null,
                compare: jsArray[7] || null,
                highlight: jsArray[8] || null
            }, context);
        }
        catch (e) {
            return null;
        }
        return essence;
    };
    Essence.fromDataSource = function (dataSource, context) {
        var timezone = dataSource.defaultTimezone;
        var splits = splits_1.Splits.EMPTY;
        var defaultSplits = dataSource.options.defaultSplits;
        if (defaultSplits) {
            splits = splits_1.Splits.fromJS(defaultSplits, dataSource);
        }
        var essence = new Essence({
            dataSource: context.dataSource,
            visualizations: context.visualizations,
            visualization: null,
            timezone: timezone,
            filter: null,
            splits: splits,
            selectedMeasures: immutable_1.OrderedSet(dataSource.measures.toArray().slice(0, 4).map(function (m) { return m.name; })),
            pinnedDimensions: dataSource.defaultPinnedDimensions,
            colors: null,
            pinnedSort: dataSource.defaultSortMeasure,
            compare: null,
            highlight: null
        });
        if (defaultSplits) {
            essence = essence.updateWithTimeRange();
        }
        return essence;
    };
    Essence.fromJS = function (parameters, context) {
        if (!context)
            throw new Error('must have context');
        var dataSource = context.dataSource, visualizations = context.visualizations;
        var visualizationID = parameters.visualization;
        var visualization = visualizations.find(function (v) { return v.id === visualizationID; });
        var timezone = parameters.timezone ? chronoshift_1.Timezone.fromJS(parameters.timezone) : null;
        var filter = parameters.filter ? filter_1.Filter.fromJS(parameters.filter).constrainToDimensions(dataSource.dimensions, dataSource.timeAttribute) : null;
        var splits = splits_1.Splits.fromJS(parameters.splits || [], dataSource).constrainToDimensions(dataSource.dimensions);
        var selectedMeasures = constrainMeasures(immutable_1.OrderedSet(parameters.selectedMeasures || []), dataSource);
        var pinnedDimensions = constrainDimensions(immutable_1.OrderedSet(parameters.pinnedDimensions || []), dataSource);
        var defaultSortMeasureName = dataSource.defaultSortMeasure;
        var colors = parameters.colors ? colors_1.Colors.fromJS(parameters.colors) : null;
        var pinnedSort = parameters.pinnedSort || defaultSortMeasureName;
        if (!dataSource.getMeasure(pinnedSort))
            pinnedSort = defaultSortMeasureName;
        var compare = null;
        var compareJS = parameters.compare;
        if (compareJS) {
            compare = filter_1.Filter.fromJS(compareJS).constrainToDimensions(dataSource.dimensions, dataSource.timeAttribute);
        }
        var highlight = null;
        var highlightJS = parameters.highlight;
        if (highlightJS) {
            highlight = highlight_1.Highlight.fromJS(highlightJS).constrainToDimensions(dataSource.dimensions, dataSource.timeAttribute);
        }
        return new Essence({
            dataSource: dataSource,
            visualizations: visualizations,
            visualization: visualization,
            timezone: timezone,
            filter: filter,
            splits: splits,
            selectedMeasures: selectedMeasures,
            pinnedDimensions: pinnedDimensions,
            colors: colors,
            pinnedSort: pinnedSort,
            compare: compare,
            highlight: highlight
        });
    };
    Essence.prototype.valueOf = function () {
        return {
            dataSource: this.dataSource,
            visualizations: this.visualizations,
            visualization: this.visualization,
            timezone: this.timezone,
            filter: this.filter,
            splits: this.splits,
            selectedMeasures: this.selectedMeasures,
            pinnedDimensions: this.pinnedDimensions,
            colors: this.colors,
            pinnedSort: this.pinnedSort,
            compare: this.compare,
            highlight: this.highlight
        };
    };
    Essence.prototype.toJS = function () {
        var selectedMeasures = this.selectedMeasures.toArray();
        var pinnedDimensions = this.pinnedDimensions.toArray();
        var js = {
            visualization: this.visualization.id,
            timezone: this.timezone.toJS(),
            filter: this.filter.toJS(),
            splits: this.splits.toJS(),
            selectedMeasures: selectedMeasures,
            pinnedDimensions: pinnedDimensions
        };
        var defaultSortMeasure = this.dataSource.defaultSortMeasure;
        if (this.colors)
            js.colors = this.colors.toJS();
        if (this.pinnedSort !== defaultSortMeasure)
            js.pinnedSort = this.pinnedSort;
        if (this.compare)
            js.compare = this.compare.toJS();
        if (this.highlight)
            js.highlight = this.highlight.toJS();
        return js;
    };
    Essence.prototype.toJSON = function () {
        return this.toJS();
    };
    Essence.prototype.toString = function () {
        return "[Essence]";
    };
    Essence.prototype.equals = function (other) {
        return Essence.isEssence(other) &&
            this.dataSource.equals(other.dataSource) &&
            this.visualization.id === other.visualization.id &&
            this.timezone.equals(other.timezone) &&
            this.filter.equals(other.filter) &&
            this.splits.equals(other.splits) &&
            this.selectedMeasures.equals(other.selectedMeasures) &&
            this.pinnedDimensions.equals(other.pinnedDimensions) &&
            Boolean(this.colors) === Boolean(other.colors) &&
            (!this.colors || this.colors.equals(other.colors)) &&
            this.pinnedSort === other.pinnedSort &&
            Boolean(this.compare) === Boolean(other.compare) &&
            (!this.compare || this.compare.equals(other.compare)) &&
            Boolean(this.highlight) === Boolean(other.highlight) &&
            (!this.highlight || this.highlight.equals(other.highlight));
    };
    Essence.prototype.toHash = function () {
        var js = this.toJS();
        var compressed = [
            js.timezone,
            js.filter,
            js.splits,
            js.selectedMeasures,
            js.pinnedDimensions,
            js.pinnedSort // 5
        ];
        if (js.colors)
            compressed[6] = js.colors;
        if (js.compare)
            compressed[7] = js.compare;
        if (js.highlight)
            compressed[8] = js.highlight;
        var restJSON = [];
        for (var i = 0; i < compressed.length; i++) {
            restJSON.push(JSON.stringify(compressed[i] || null));
        }
        return [
            js.visualization,
            HASH_VERSION,
            lz_string_1.compressToBase64(restJSON.join(','))
        ].join('/');
    };
    Essence.prototype.getURL = function (urlPrefix) {
        return urlPrefix + this.toHash();
    };
    Essence.prototype.getBestVisualization = function (splits, colors, currentVisualization) {
        var _a = this, visualizations = _a.visualizations, dataSource = _a.dataSource;
        var visAndResolves = visualizations.toArray().map(function (visualization) {
            return {
                visualization: visualization,
                resolve: visualization.handleCircumstance(dataSource, splits, colors, visualization === currentVisualization)
            };
        });
        return visAndResolves.sort(function (vr1, vr2) { return manifest_1.Resolve.compare(vr1.resolve, vr2.resolve); })[0];
    };
    Essence.prototype.getTimeAttribute = function () {
        return this.dataSource.timeAttribute;
    };
    Essence.prototype.getTimeDimension = function () {
        return this.dataSource.getTimeDimension();
    };
    Essence.prototype.evaluateSelection = function (selection, now) {
        if (now === void 0) { now = new Date(); }
        var _a = this, dataSource = _a.dataSource, timezone = _a.timezone;
        var maxTime = dataSource.getMaxTimeDate();
        return filter_clause_1.FilterClause.evaluate(selection, now, maxTime, timezone);
    };
    Essence.prototype.getEffectiveFilter = function (highlightId, unfilterDimension) {
        if (highlightId === void 0) { highlightId = null; }
        if (unfilterDimension === void 0) { unfilterDimension = null; }
        var _a = this, dataSource = _a.dataSource, filter = _a.filter, highlight = _a.highlight, timezone = _a.timezone;
        if (highlight && (highlightId !== highlight.owner))
            filter = highlight.applyToFilter(filter);
        if (unfilterDimension)
            filter = filter.remove(unfilterDimension.expression);
        var maxTime = dataSource.getMaxTimeDate();
        return filter.getSpecificFilter(new Date(), maxTime, timezone);
    };
    Essence.prototype.getMeasures = function () {
        var dataSource = this.dataSource;
        return this.selectedMeasures.toList().map(function (measureName) { return dataSource.getMeasure(measureName); });
    };
    Essence.prototype.differentDataSource = function (other) {
        return this.dataSource !== other.dataSource;
    };
    Essence.prototype.differentTimezone = function (other) {
        return !this.timezone.equals(other.timezone);
    };
    Essence.prototype.differentFilter = function (other) {
        return !this.filter.equals(other.filter);
    };
    Essence.prototype.differentSplits = function (other) {
        return !this.splits.equals(other.splits);
    };
    Essence.prototype.differentColors = function (other) {
        if (Boolean(this.colors) !== Boolean(other.colors))
            return true;
        if (!this.colors)
            return false;
        return !this.colors.equals(other.colors);
    };
    Essence.prototype.differentSelectedMeasures = function (other) {
        return !this.selectedMeasures.equals(other.selectedMeasures);
    };
    Essence.prototype.newSelectedMeasures = function (other) {
        return !this.selectedMeasures.isSubset(other.selectedMeasures);
    };
    Essence.prototype.differentPinnedDimensions = function (other) {
        return !this.pinnedDimensions.equals(other.pinnedDimensions);
    };
    Essence.prototype.differentPinnedSort = function (other) {
        return this.pinnedSort !== other.pinnedSort;
    };
    Essence.prototype.differentCompare = function (other) {
        if (Boolean(this.compare) !== Boolean(other.compare))
            return true;
        return Boolean(this.compare && !this.compare.equals(other.compare));
    };
    Essence.prototype.differentHighligh = function (other) {
        if (Boolean(this.highlight) !== Boolean(other.highlight))
            return true;
        return Boolean(this.highlight && !this.highlight.equals(other.highlight));
    };
    Essence.prototype.differentEffectiveFilter = function (other, highlightId, unfilterDimension) {
        if (highlightId === void 0) { highlightId = null; }
        if (unfilterDimension === void 0) { unfilterDimension = null; }
        var myEffectiveFilter = this.getEffectiveFilter(highlightId, unfilterDimension);
        var otherEffectiveFilter = other.getEffectiveFilter(highlightId, unfilterDimension);
        return !myEffectiveFilter.equals(otherEffectiveFilter);
    };
    Essence.prototype.highlightOn = function (owner) {
        var highlight = this.highlight;
        if (!highlight)
            return false;
        return highlight.owner === owner;
    };
    Essence.prototype.getSingleHighlightSet = function () {
        var highlight = this.highlight;
        if (!highlight)
            return null;
        return highlight.delta.getSingleClauseSet();
    };
    Essence.prototype.getApplyForSort = function (sort) {
        var sortOn = sort.expression.name;
        var sortMeasure = this.dataSource.getMeasure(sortOn);
        if (!sortMeasure)
            return null;
        return sortMeasure.toApplyAction();
    };
    Essence.prototype.getCommonSort = function () {
        var splits = this.splits.toArray();
        var commonSort = null;
        for (var _i = 0; _i < splits.length; _i++) {
            var split = splits[_i];
            var sort = split.sortAction;
            if (commonSort) {
                if (!commonSort.equals(sort))
                    return null;
            }
            else {
                commonSort = sort;
            }
        }
        return commonSort;
    };
    Essence.prototype.updateDataSource = function (newDataSource) {
        var _a = this, dataSource = _a.dataSource, visualizations = _a.visualizations;
        if (dataSource.equals(newDataSource))
            return this; // nothing to do
        if (dataSource.equalsWithoutMaxTime(newDataSource)) {
            var value = this.valueOf();
            value.dataSource = newDataSource;
            return new Essence(value);
        }
        if (dataSource.name !== newDataSource.name)
            return Essence.fromDataSource(newDataSource, {
                dataSource: newDataSource,
                visualizations: visualizations
            });
        var value = this.valueOf();
        value.dataSource = newDataSource;
        // Make sure that all the elements of state are still valid
        value.filter = value.filter.constrainToDimensions(newDataSource.dimensions, newDataSource.timeAttribute, dataSource.timeAttribute);
        value.splits = value.splits.constrainToDimensions(newDataSource.dimensions);
        value.selectedMeasures = constrainMeasures(value.selectedMeasures, newDataSource);
        value.pinnedDimensions = constrainDimensions(value.pinnedDimensions, newDataSource);
        if (value.colors && !newDataSource.getDimension(value.colors.dimension)) {
            value.colors = null;
        }
        var defaultSortMeasureName = newDataSource.defaultSortMeasure;
        if (!newDataSource.getMeasure(value.pinnedSort))
            value.pinnedSort = defaultSortMeasureName;
        if (value.compare) {
            value.compare = value.compare.constrainToDimensions(newDataSource.dimensions, newDataSource.timeAttribute);
        }
        if (value.highlight) {
            value.highlight = value.highlight.constrainToDimensions(newDataSource.dimensions, newDataSource.timeAttribute);
        }
        return new Essence(value);
    };
    // Modification
    Essence.prototype.changeFilter = function (filter, removeHighlight) {
        if (removeHighlight === void 0) { removeHighlight = false; }
        var value = this.valueOf();
        value.filter = filter;
        if (removeHighlight) {
            value.highlight = null;
        }
        var timeAttribute = this.getTimeAttribute();
        if (timeAttribute) {
            var oldTimeSelection = this.filter.getSelection(timeAttribute);
            var newTimeSelection = filter.getSelection(timeAttribute);
            if (newTimeSelection && !newTimeSelection.equals(oldTimeSelection)) {
                value.splits = value.splits.updateWithTimeRange(timeAttribute, this.evaluateSelection(newTimeSelection), this.timezone, true);
            }
        }
        return new Essence(value);
    };
    Essence.prototype.changeTimeSelection = function (check) {
        var filter = this.filter;
        var timeAttribute = this.getTimeAttribute();
        return this.changeFilter(filter.setSelection(timeAttribute, check));
    };
    Essence.prototype.changeSplits = function (splits, strategy) {
        var _a = this, visualization = _a.visualization, visResolve = _a.visResolve, filter = _a.filter, colors = _a.colors, timezone = _a.timezone;
        var timeAttribute = this.getTimeAttribute();
        if (timeAttribute) {
            splits = splits.updateWithTimeRange(timeAttribute, this.evaluateSelection(filter.getSelection(timeAttribute)), timezone);
        }
        // If in manual mode stay there, keep the vis regardless of suggested strategy
        if (visResolve.isManual()) {
            strategy = VisStrategy.KeepAlways;
        }
        if (strategy !== VisStrategy.KeepAlways) {
            var visAndResolve = this.getBestVisualization(splits, colors, (strategy === VisStrategy.FairGame ? null : visualization));
            visualization = visAndResolve.visualization;
        }
        var value = this.valueOf();
        value.splits = splits;
        value.visualization = visualization;
        if (value.highlight) {
            value.filter = value.highlight.applyToFilter(value.filter);
            value.highlight = null;
        }
        return new Essence(value);
    };
    Essence.prototype.changeSplit = function (splitCombine, strategy) {
        return this.changeSplits(splits_1.Splits.fromSplitCombine(splitCombine), strategy);
    };
    Essence.prototype.addSplit = function (split, strategy) {
        var splits = this.splits;
        return this.changeSplits(splits.addSplit(split), strategy);
    };
    Essence.prototype.removeSplit = function (split, strategy) {
        var splits = this.splits;
        return this.changeSplits(splits.removeSplit(split), strategy);
    };
    Essence.prototype.updateWithTimeRange = function () {
        var _a = this, filter = _a.filter, splits = _a.splits, timezone = _a.timezone;
        var timeAttribute = this.getTimeAttribute();
        if (!timeAttribute)
            return this;
        var value = this.valueOf();
        value.splits = splits.updateWithTimeRange(timeAttribute, this.evaluateSelection(filter.getSelection(timeAttribute)), timezone);
        return new Essence(value);
    };
    Essence.prototype.changeColors = function (colors) {
        var value = this.valueOf();
        value.colors = colors;
        return new Essence(value);
    };
    Essence.prototype.changeVisualization = function (visualization) {
        var value = this.valueOf();
        value.visualization = visualization;
        return new Essence(value);
    };
    Essence.prototype.pin = function (dimension) {
        var value = this.valueOf();
        value.pinnedDimensions = value.pinnedDimensions.add(dimension.name);
        return new Essence(value);
    };
    Essence.prototype.unpin = function (dimension) {
        var value = this.valueOf();
        value.pinnedDimensions = value.pinnedDimensions.remove(dimension.name);
        return new Essence(value);
    };
    Essence.prototype.getPinnedSortMeasure = function () {
        return this.dataSource.getMeasure(this.pinnedSort);
    };
    Essence.prototype.changePinnedSortMeasure = function (measure) {
        var value = this.valueOf();
        value.pinnedSort = measure.name;
        return new Essence(value);
    };
    Essence.prototype.toggleMeasure = function (measure) {
        var dataSource = this.dataSource;
        var value = this.valueOf();
        var selectedMeasures = value.selectedMeasures;
        var measureName = measure.name;
        if (selectedMeasures.has(measureName)) {
            value.selectedMeasures = selectedMeasures.delete(measureName);
        }
        else {
            // Preserve the order of the measures in the datasource
            value.selectedMeasures = immutable_1.OrderedSet(dataSource.measures
                .toArray()
                .map(function (m) { return m.name; })
                .filter(function (name) { return selectedMeasures.has(name) || name === measureName; }));
        }
        return new Essence(value);
    };
    Essence.prototype.acceptHighlight = function () {
        var highlight = this.highlight;
        if (!highlight)
            return this;
        return this.changeFilter(highlight.applyToFilter(this.filter), true);
    };
    Essence.prototype.changeHighlight = function (owner, delta) {
        var highlight = this.highlight;
        // If there is already a highlight from someone else accept it
        var value;
        if (highlight && highlight.owner !== owner) {
            value = this.changeFilter(highlight.applyToFilter(this.filter)).valueOf();
        }
        else {
            value = this.valueOf();
        }
        value.highlight = new highlight_1.Highlight({
            owner: owner,
            delta: delta
        });
        return new Essence(value);
    };
    Essence.prototype.dropHighlight = function () {
        var value = this.valueOf();
        value.highlight = null;
        return new Essence(value);
    };
    return Essence;
})();
exports.Essence = Essence;
check = Essence;
//# sourceMappingURL=essence.js.map