require('./pivot.css');
var React = require('react');
var ReactDOM = require('react-dom');
var pivot_application_1 = require("./components/pivot-application/pivot-application");
// Polyfill
// from https://github.com/reppners/ios-html5-drag-drop-shim/tree/effectAllowed_dropEffect
// /polyfill/mobile-drag-and-drop-polyfill/mobile-drag-and-drop-polyfill.js
// From ../../assets/polyfill/ios-drag-drop.js
var div = document.createElement('div');
var dragDiv = 'draggable' in div;
var evts = 'ondragstart' in div && 'ondrop' in div;
var needsPatch = !(dragDiv || evts) || /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
if (needsPatch) {
    require.ensure(['../../assets/polyfill/ios-drag-drop.js'], function (require) {
        require('../../assets/polyfill/ios-drag-drop.js');
    }, 'ios-drag-drop');
}
function pivot(container, options) {
    return ReactDOM.render(React.createElement(pivot_application_1.PivotApplication, options), container);
}
exports.pivot = pivot;
//# sourceMappingURL=pivot.js.map