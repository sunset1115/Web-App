var Qajax = require('qajax');
var plywood_1 = require('plywood');
function getSplitsDescription(ex) {
    var splits = [];
    ex.forEach(function (ex) {
        if (ex instanceof plywood_1.ChainExpression) {
            ex.actions.forEach(function (action) {
                if (action instanceof plywood_1.SplitAction) {
                    splits.push(action.firstSplitExpression().toString());
                }
            });
        }
    });
    return splits.join(';');
}
var reloadRequested = false;
function reload() {
    if (reloadRequested)
        return;
    reloadRequested = true;
    window.location.reload(true);
}
function queryUrlExecutorFactory(name, url, version) {
    return function (ex) {
        return Qajax({
            method: "POST",
            url: url + '?by=' + getSplitsDescription(ex),
            data: {
                version: version,
                dataSource: name,
                expression: ex.toJS()
            }
        })
            .then(Qajax.filterSuccess)
            .then(Qajax.toJSON)
            .then(function (dataJS) {
            return plywood_1.Dataset.fromJS(dataJS);
        }, function (xhr) {
            if (!xhr)
                return null; // This is only here to stop TS complaining
            var jsonError = JSON.parse(xhr.responseText);
            if (jsonError.action === 'reload')
                reload();
            throw new Error(jsonError.message);
        });
    };
}
exports.queryUrlExecutorFactory = queryUrlExecutorFactory;
//# sourceMappingURL=ajax.js.map