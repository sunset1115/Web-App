var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./chart-line.css');
var React = require('react');
var d3 = require('d3');
var constants_1 = require('../../config/constants');
var lineFn = d3.svg.line();
var ChartLine = (function (_super) {
    __extends(ChartLine, _super);
    function ChartLine() {
        _super.call(this);
        // this.state = {};
    }
    ChartLine.prototype.render = function () {
        var _a = this.props, stage = _a.stage, dataset = _a.dataset, getY = _a.getY, scaleX = _a.scaleX, scaleY = _a.scaleY, color = _a.color, showArea = _a.showArea, hoverTimeRange = _a.hoverTimeRange;
        if (!dataset || !color)
            return null;
        var dataPoints = [];
        var hoverDataPoint = null;
        var ds = dataset.data;
        for (var i = 0; i < ds.length; i++) {
            var datum = ds[i];
            var timeRange = datum[constants_1.TIME_SEGMENT];
            if (!timeRange)
                return null; // Incorrect data loaded
            var timeRangeMidPoint = timeRange.midpoint();
            var measureValue = getY(datum);
            // Add potential pre zero point
            var prevDatum = ds[i - 1];
            if (prevDatum) {
                var prevTimeRange = prevDatum[constants_1.TIME_SEGMENT];
                if (prevTimeRange.end.valueOf() !== timeRange.start.valueOf()) {
                    dataPoints.push([
                        scaleX(timeRangeMidPoint.valueOf() - (timeRange.end.valueOf() - timeRange.start.valueOf())),
                        scaleY(0)
                    ]);
                }
            }
            // Add the point itself
            var y = scaleY(measureValue);
            var dataPoint = [scaleX(timeRangeMidPoint), isNaN(y) ? 0 : y];
            dataPoints.push(dataPoint);
            if (hoverTimeRange && hoverTimeRange.equals(timeRange)) {
                hoverDataPoint = dataPoint;
            }
            // Add potential post zero point
            var nextDatum = ds[i + 1];
            if (nextDatum) {
                var nextTimeRange = nextDatum[constants_1.TIME_SEGMENT];
                if (timeRange.end.valueOf() !== nextTimeRange.start.valueOf()) {
                    dataPoints.push([
                        scaleX(timeRangeMidPoint.valueOf() + (timeRange.end.valueOf() - timeRange.start.valueOf())),
                        scaleY(0)
                    ]);
                }
            }
        }
        var strokeStyle = null;
        var fillStyle = null;
        if (color !== 'default') {
            strokeStyle = { stroke: color };
            fillStyle = { fill: color };
        }
        var areaPath = null;
        var linePath = null;
        var singletonCircle = null;
        if (dataPoints.length > 1) {
            if (showArea) {
                var areaFn = d3.svg.area().y0(scaleY(0));
                areaPath = <path className="area" d={areaFn(dataPoints)}/>;
            }
            linePath = <path className="line" d={lineFn(dataPoints)} style={strokeStyle}/>;
        }
        else if (dataPoints.length === 1) {
            singletonCircle = <circle className="singleton" cx={dataPoints[0][0]} cy={dataPoints[0][1]} r="2" style={fillStyle}/>;
        }
        var hoverCircle = null;
        if (hoverDataPoint) {
            hoverCircle = <circle className="hover" cx={hoverDataPoint[0]} cy={hoverDataPoint[1]} r="2.5" style={strokeStyle}/>;
        }
        return <g className="chart-line" transform={stage.getTransform()}>
      {areaPath}
      {linePath}
      {singletonCircle}
      {hoverCircle}
    </g>;
    };
    return ChartLine;
})(React.Component);
exports.ChartLine = ChartLine;
//# sourceMappingURL=chart-line.js.map