var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./measures-tile.css');
var React = require('react');
var constants_1 = require('../../config/constants');
var checkbox_1 = require('../checkbox/checkbox');
var MeasuresTile = (function (_super) {
    __extends(MeasuresTile, _super);
    function MeasuresTile() {
        _super.call(this);
        this.state = {
            showSearch: false
        };
    }
    MeasuresTile.prototype.toggleSearch = function () {
        var showSearch = this.state.showSearch;
        this.setState({ showSearch: !showSearch });
    };
    MeasuresTile.prototype.measureClick = function (measure, e) {
        if (e.altKey && typeof console !== 'undefined') {
            console.log("Measure: " + measure.name);
            console.log("expression: " + measure.expression.toString());
            return;
        }
        var clicker = this.props.clicker;
        clicker.toggleMeasure(measure);
    };
    MeasuresTile.prototype.render = function () {
        var _this = this;
        var essence = this.props.essence;
        var showSearch = this.state.showSearch;
        var dataSource = essence.dataSource, selectedMeasures = essence.selectedMeasures;
        var maxHeight = constants_1.PIN_TITLE_HEIGHT;
        var rows = dataSource.measures.map(function (measure) {
            var measureName = measure.name;
            var selected = selectedMeasures.has(measureName);
            return <div className={'row' + (selected ? ' selected' : '')} key={measureName} onClick={_this.measureClick.bind(_this, measure)}>
        <checkbox_1.Checkbox selected={selected}/>
        <div className="label">{measure.title}</div>
      </div>;
        });
        maxHeight += (rows.size + 2) * constants_1.MEASURE_HEIGHT + constants_1.PIN_PADDING_BOTTOM;
        var style = {
            flex: rows.size + 2,
            maxHeight: maxHeight
        };
        return <div className="measures-tile" style={style}>
      <div className="title">{constants_1.STRINGS.measures}</div>
      <div className="rows">{rows}</div>
    </div>;
    };
    return MeasuresTile;
})(React.Component);
exports.MeasuresTile = MeasuresTile;
//# sourceMappingURL=measures-tile.js.map