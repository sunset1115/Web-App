var jsdom = require('jsdom');
var g = global;
if (!g.document) {
    var document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    g.document = document;
    g.window = document.defaultView;
    g.navigator = {
        userAgent: 'testing'
    };
}
//# sourceMappingURL=jsdom-setup.js.map