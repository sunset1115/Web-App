require('./pivot-entry.css');
var immutable_1 = require('immutable');
var chronoshift_1 = require('chronoshift');
var ajax_1 = require('./utils/ajax/ajax');
var index_1 = require('../common/models/index');
var pivot_1 = require('./pivot');
// Init chronoshift
if (!chronoshift_1.WallTime.rules) {
    var tzData = require("chronoshift/lib/walltime/walltime-data.js");
    chronoshift_1.WallTime.init(tzData.rules, tzData.zones);
}
var config = window['__CONFIG__'];
var version = null;
var dataSources;
if (config && Array.isArray(config.dataSources)) {
    version = config.version || '0.0.0';
    dataSources = immutable_1.List(config.dataSources.map(function (dataSourceJS) {
        var executor = ajax_1.queryUrlExecutorFactory(dataSourceJS.name, '/plywood', version);
        return index_1.DataSource.fromJS(dataSourceJS, executor);
    }));
    var container = document.getElementsByClassName('app-container')[0];
    if (container) {
        pivot_1.pivot(container, {
            version: version,
            user: config.user,
            dataSources: dataSources,
            linkViewConfig: config.linkViewConfig
        });
    }
}
else {
    throw new Error('config not found');
}
//# sourceMappingURL=pivot-entry.js.map