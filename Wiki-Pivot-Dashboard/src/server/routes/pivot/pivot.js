var express_1 = require('express');
var config_1 = require('../../config');
var views_1 = require('../../views');
var router = express_1.Router();
router.get('/', function (req, res, next) {
    req.dataSourceManager.getQueryableDataSources()
        .then(function (dataSources) {
        if (dataSources.length) {
            res.send(views_1.pivotLayout({
                version: config_1.VERSION,
                title: "Pivot (" + config_1.VERSION + ")",
                config: {
                    version: config_1.VERSION,
                    user: req.user,
                    dataSources: dataSources.map(function (ds) { return ds.toClientDataSource(); }),
                    linkViewConfig: config_1.LINK_VIEW_CONFIG
                }
            }));
        }
        else {
            res.send(views_1.noDataSourcesLayout({
                version: config_1.VERSION,
                title: 'No Data Sources'
            }));
        }
    })
        .done();
});
module.exports = router;
//# sourceMappingURL=pivot.js.map