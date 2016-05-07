var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./bar-chart.css');
var React = require('react');
var plywood_1 = require('plywood');
// import { ... } from '../../config/constants';
var index_1 = require('../../../common/models/index');
var constants_1 = require('../../config/constants');
var loader_1 = require('../../components/loader/loader');
var query_error_1 = require('../../components/query-error/query-error');
var BarChart = (function (_super) {
    __extends(BarChart, _super);
    function BarChart() {
        _super.call(this);
        this.state = {
            loading: false,
            dataset: null,
            error: null
        };
    }
    BarChart.handleCircumstance = function (dataSource, splits, colors, current) {
        // Must have at least one dimension
        if (splits.length() === 0) {
            var someDimensions = dataSource.dimensions.toArray().filter(function (d) { return d.kind === 'string'; }).slice(0, 2);
            return index_1.Resolve.manual(4, 'This visualization requires at least one split', someDimensions.map(function (someDimension) {
                return {
                    description: "Add a split on " + someDimension.title,
                    adjustment: {
                        splits: index_1.Splits.fromSplitCombine(index_1.SplitCombine.fromExpression(someDimension.expression))
                    }
                };
            }));
        }
        //return Resolve.ready(8);
        return index_1.Resolve.manual(0, 'The Bar Chart visualization is not ready, please select another visualization.', []);
    };
    BarChart.prototype.fetchData = function (essence) {
        var _this = this;
        var splits = essence.splits, dataSource = essence.dataSource;
        var measures = essence.getMeasures();
        var $main = plywood_1.$('main');
        var query = plywood_1.ply()
            .apply('main', $main.filter(essence.getEffectiveFilter(BarChart.id).toExpression()));
        measures.forEach(function (measure) {
            query = query.performAction(measure.toApplyAction());
        });
        function makeQuery(i) {
            var split = splits.get(i);
            var sortAction = split.sortAction, limitAction = split.limitAction;
            if (!sortAction)
                throw new Error('something went wrong in bar chart query generation');
            var subQuery = $main.split(split.toSplitExpression(), constants_1.SEGMENT);
            measures.forEach(function (measure) {
                subQuery = subQuery.performAction(measure.toApplyAction());
            });
            var applyForSort = essence.getApplyForSort(sortAction);
            if (applyForSort) {
                subQuery = subQuery.performAction(applyForSort);
            }
            subQuery = subQuery.performAction(sortAction);
            if (limitAction) {
                subQuery = subQuery.performAction(limitAction);
            }
            if (i + 1 < splits.length()) {
                subQuery = subQuery.apply(constants_1.SPLIT, makeQuery(i + 1));
            }
            return subQuery;
        }
        query = query.apply(constants_1.SPLIT, makeQuery(0));
        this.setState({ loading: true });
        dataSource.executor(query)
            .then(function (dataset) {
            if (!_this.mounted)
                return;
            _this.setState({
                loading: false,
                dataset: dataset,
                error: null
            });
        }, function (error) {
            if (!_this.mounted)
                return;
            _this.setState({
                loading: false,
                dataset: null,
                error: error
            });
        });
    };
    BarChart.prototype.componentDidMount = function () {
        this.mounted = true;
        var essence = this.props.essence;
        this.fetchData(essence);
    };
    BarChart.prototype.componentWillReceiveProps = function (nextProps) {
        var essence = this.props.essence;
        var nextEssence = nextProps.essence;
        if (nextEssence.differentDataSource(essence) ||
            nextEssence.differentEffectiveFilter(essence, BarChart.id) ||
            nextEssence.differentSplits(essence) ||
            nextEssence.newSelectedMeasures(essence)) {
            this.fetchData(nextEssence);
        }
    };
    BarChart.prototype.componentWillUnmount = function () {
        this.mounted = false;
    };
    BarChart.prototype.render = function () {
        var _a = this.props, clicker = _a.clicker, essence = _a.essence, stage = _a.stage;
        var _b = this.state, loading = _b.loading, error = _b.error, dataset = _b.dataset;
        var splits = essence.splits;
        var measure = essence.getMeasures().first();
        var measureName = measure.name;
        var getY = function (d) { return d[measureName]; };
        var bars = null;
        if (dataset) {
            var myDatum = dataset.data[0];
            var myDataset = myDatum[constants_1.SPLIT];
            var extentY = d3.extent(myDataset.data, getY);
            if (isNaN(extentY[0])) {
                extentY = [0, 1];
            }
            extentY[0] = Math.min(extentY[0] * 1.1, 0);
            extentY[1] = Math.max(extentY[1] * 1.1, 0);
            var scaleY = d3.scale.linear()
                .domain(extentY)
                .range([stage.height, 0]);
            bars = myDataset.data.map(function (d, i) {
                var segmentValue = d[constants_1.SEGMENT];
                var segmentValueStr = String(segmentValue);
                return <rect key={segmentValueStr} x={i * 30 + 10} y={scaleY(getY(d))} width={20} height={Math.abs(scaleY(getY(d)) - scaleY(0))}/>;
            });
        }
        var loader = null;
        if (loading) {
            loader = <loader_1.Loader />;
        }
        var queryError = null;
        if (error) {
            queryError = <query_error_1.QueryError error={error}/>;
        }
        return <div className="bar-chart">
      <svg width={stage.width} height={stage.height}>
        <g className="bars">
          {bars}
        </g>
      </svg>
      {queryError}
      {loader}
    </div>;
    };
    BarChart.id = 'bar-chart';
    BarChart.title = 'Bar Chart';
    return BarChart;
})(React.Component);
exports.BarChart = BarChart;
//# sourceMappingURL=bar-chart.js.map