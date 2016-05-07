var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./dimension-tile.css');
var React = require('react');
var ReactDOM = require('react-dom');
var svg_icon_1 = require('../svg-icon/svg-icon');
var plywood_1 = require('plywood');
var constants_1 = require('../../config/constants');
var formatter_1 = require('../../../common/utils/formatter/formatter');
var dom_1 = require('../../utils/dom/dom');
var index_1 = require('../../../common/models/index');
var general_1 = require('../../../common/utils/general/general');
var drag_manager_1 = require('../../utils/drag-manager/drag-manager');
var tile_header_1 = require('../tile-header/tile-header');
var clearable_input_1 = require('../clearable-input/clearable-input');
var checkbox_1 = require('../checkbox/checkbox');
var loader_1 = require('../loader/loader');
var query_error_1 = require('../query-error/query-error');
var highlight_string_1 = require('../highlight-string/highlight-string');
var TOP_N = 100;
var SEARCH_BOX_HEIGHT = 26;
var SEARCH_BOX_GAP = 3;
var FOLDER_BOX_HEIGHT = 30;
var DimensionTile = (function (_super) {
    __extends(DimensionTile, _super);
    function DimensionTile() {
        var _this = this;
        _super.call(this);
        this.state = {
            loading: false,
            dataset: null,
            error: null,
            fetchQueued: false,
            unfolded: true,
            foldability: false,
            showSearch: false,
            searchText: ''
        };
        this.collectTriggerSearch = general_1.collect(constants_1.SEARCH_WAIT, function () {
            if (!_this.mounted)
                return;
            var _a = _this.props, essence = _a.essence, dimension = _a.dimension, sortOn = _a.sortOn;
            var unfolded = _this.state.unfolded;
            _this.fetchData(essence, dimension, sortOn, unfolded);
        });
        this.globalMouseDownListener = this.globalMouseDownListener.bind(this);
        this.globalKeyDownListener = this.globalKeyDownListener.bind(this);
    }
    DimensionTile.prototype.fetchData = function (essence, dimension, sortOn, unfolded) {
        var _this = this;
        var searchText = this.state.searchText;
        var dataSource = essence.dataSource, colors = essence.colors;
        var filter = essence.getEffectiveFilter();
        if (unfolded) {
            filter = filter.remove(dimension.expression);
        }
        var filterExpression = filter.toExpression();
        if (!unfolded && colors && colors.dimension === dimension.name && colors.values) {
            filterExpression = filterExpression.and(dimension.expression.in(colors.toSet()));
        }
        if (searchText) {
            filterExpression = filterExpression.and(dimension.expression.contains(plywood_1.r(searchText), 'ignoreCase'));
        }
        var query = plywood_1.$('main')
            .filter(filterExpression)
            .split(dimension.expression, constants_1.SEGMENT);
        if (sortOn.measure) {
            query = query.performAction(sortOn.measure.toApplyAction());
        }
        query = query.sort(sortOn.getExpression(), plywood_1.SortAction.DESCENDING).limit(TOP_N + 1);
        this.setState({
            loading: true,
            fetchQueued: false
        });
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
    DimensionTile.prototype.updateFoldability = function (essence, dimension, colors) {
        var unfolded = this.state.unfolded;
        var foldability = true;
        if (essence.filter.filteredOn(dimension.expression)) {
            if (colors) {
                foldability = false;
                unfolded = false;
            }
        }
        else {
            if (!colors) {
                foldability = false;
                unfolded = true;
            }
        }
        this.setState({ foldability: foldability, unfolded: unfolded });
        return unfolded;
    };
    DimensionTile.prototype.componentWillMount = function () {
        var _a = this.props, essence = _a.essence, dimension = _a.dimension, colors = _a.colors, sortOn = _a.sortOn;
        var unfolded = this.updateFoldability(essence, dimension, colors);
        this.fetchData(essence, dimension, sortOn, unfolded);
    };
    DimensionTile.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = this.props, essence = _a.essence, dimension = _a.dimension, sortOn = _a.sortOn;
        var nextEssence = nextProps.essence;
        var nextDimension = nextProps.dimension;
        var nextColors = nextProps.colors;
        var nextSortOn = nextProps.sortOn;
        var unfolded = this.updateFoldability(nextEssence, nextDimension, nextColors);
        if (essence.differentDataSource(nextEssence) ||
            essence.differentEffectiveFilter(nextEssence, null, unfolded ? dimension : null) ||
            essence.differentColors(nextEssence) ||
            !dimension.equals(nextDimension) ||
            !sortOn.equals(nextSortOn)) {
            this.fetchData(nextEssence, nextDimension, nextSortOn, unfolded);
        }
    };
    DimensionTile.prototype.componentDidMount = function () {
        this.mounted = true;
        window.addEventListener('mousedown', this.globalMouseDownListener);
        window.addEventListener('keydown', this.globalKeyDownListener);
    };
    DimensionTile.prototype.componentWillUnmount = function () {
        this.mounted = false;
        window.removeEventListener('mousedown', this.globalMouseDownListener);
        window.removeEventListener('keydown', this.globalKeyDownListener);
    };
    DimensionTile.prototype.globalMouseDownListener = function (e) {
        var searchBoxElement = ReactDOM.findDOMNode(this.refs['search-box']);
        if (!searchBoxElement)
            return;
        var headerRef = this.refs['header'];
        if (!headerRef)
            return;
        var searchButtonElement = ReactDOM.findDOMNode(headerRef.refs['searchButton']);
        if (!searchButtonElement)
            return;
        var target = e.target;
        if (dom_1.isInside(target, searchBoxElement) || dom_1.isInside(target, searchButtonElement))
            return;
        var searchText = this.state.searchText;
        // Remove search if it looses focus while empty
        if (searchText !== '')
            return;
        this.toggleSearch();
    };
    DimensionTile.prototype.globalKeyDownListener = function (e) {
        if (!dom_1.escapeKey(e))
            return;
        var showSearch = this.state.showSearch;
        if (!showSearch)
            return;
        this.toggleSearch();
    };
    DimensionTile.prototype.toggleSearch = function () {
        var showSearch = this.state.showSearch;
        this.setState({ showSearch: !showSearch });
        this.onSearchChange('');
    };
    DimensionTile.prototype.onRowClick = function (value, e) {
        var _a = this.props, clicker = _a.clicker, essence = _a.essence, dimension = _a.dimension, colors = _a.colors;
        var dataset = this.state.dataset;
        var filter = essence.filter;
        if (colors && colors.dimension === dimension.name) {
            if (colors.limit) {
                if (!dataset)
                    return;
                var values = dataset.data.slice(0, colors.limit).map(function (d) { return d[constants_1.SEGMENT]; });
                colors = index_1.Colors.fromValues(colors.dimension, values);
            }
            colors = colors.toggle(value);
            if (filter.filteredOn(dimension.expression)) {
                filter = filter.toggleValue(dimension.expression, value);
                clicker.changeFilter(filter, colors);
            }
            else {
                clicker.changeColors(colors);
            }
        }
        else {
            if (e.altKey || e.ctrlKey || e.metaKey) {
                if (filter.filteredOnValue(dimension.expression, value) && filter.getLiteralSet(dimension.expression).size() === 1) {
                    filter = filter.remove(dimension.expression);
                }
                else {
                    filter = filter.remove(dimension.expression).addValue(dimension.expression, value);
                }
            }
            else {
                filter = filter.toggleValue(dimension.expression, value);
            }
            // If no longer filtered switch unfolded to true for later
            var unfolded = this.state.unfolded;
            if (!unfolded && !filter.filteredOn(dimension.expression)) {
                this.setState({ unfolded: true });
            }
            clicker.changeFilter(filter);
        }
    };
    DimensionTile.prototype.toggleFold = function () {
        var _a = this.props, essence = _a.essence, dimension = _a.dimension, sortOn = _a.sortOn;
        var unfolded = this.state.unfolded;
        unfolded = !unfolded;
        this.setState({ unfolded: unfolded });
        this.fetchData(essence, dimension, sortOn, unfolded);
    };
    DimensionTile.prototype.onDragStart = function (e) {
        var _a = this.props, essence = _a.essence, dimension = _a.dimension, getUrlPrefix = _a.getUrlPrefix;
        var newUrl = essence.changeSplit(index_1.SplitCombine.fromExpression(dimension.expression), index_1.VisStrategy.FairGame).getURL(getUrlPrefix());
        var dataTransfer = e.dataTransfer;
        dataTransfer.effectAllowed = 'all';
        dataTransfer.setData("text/url-list", newUrl);
        dataTransfer.setData("text/plain", newUrl);
        drag_manager_1.DragManager.setDragDimension(dimension);
        dom_1.setDragGhost(dataTransfer, dimension.title);
    };
    DimensionTile.prototype.onSearchChange = function (text) {
        var _a = this.state, searchText = _a.searchText, dataset = _a.dataset, fetchQueued = _a.fetchQueued, loading = _a.loading;
        var newSearchText = text.substr(0, constants_1.MAX_SEARCH_LENGTH);
        if (searchText === newSearchText)
            return; // nothing to do;
        // If the user is just typing in more and there are already < TOP_N results then there is nothing to do
        if (newSearchText.indexOf(searchText) !== -1 && !fetchQueued && !loading && dataset && dataset.data.length < TOP_N) {
            this.setState({
                searchText: newSearchText
            });
            return;
        }
        this.setState({
            searchText: newSearchText,
            fetchQueued: true
        });
        this.collectTriggerSearch();
    };
    DimensionTile.prototype.render = function () {
        var _this = this;
        var _a = this.props, clicker = _a.clicker, essence = _a.essence, dimension = _a.dimension, sortOn = _a.sortOn, colors = _a.colors, onClose = _a.onClose;
        var _b = this.state, loading = _b.loading, dataset = _b.dataset, error = _b.error, showSearch = _b.showSearch, unfolded = _b.unfolded, foldability = _b.foldability, fetchQueued = _b.fetchQueued, searchText = _b.searchText;
        var measure = sortOn.measure;
        var measureName = measure ? measure.name : null;
        var filterSet = essence.filter.getLiteralSet(dimension.expression);
        var maxHeight = constants_1.PIN_TITLE_HEIGHT;
        var searchBar = null;
        if (showSearch) {
            searchBar = <div className="search-box" ref="search-box">
        <clearable_input_1.ClearableInput placeholder="Search" focusOnMount={true} value={searchText} onChange={this.onSearchChange.bind(this)}/>
      </div>;
            maxHeight += SEARCH_BOX_HEIGHT + SEARCH_BOX_GAP;
        }
        var rows = [];
        var folder = null;
        var highlightControls = null;
        var hasMore = false;
        if (dataset) {
            hasMore = dataset.data.length > TOP_N;
            var rowData = dataset.data.slice(0, TOP_N);
            if (!unfolded) {
                if (filterSet) {
                    rowData = rowData.filter(function (d) { return filterSet.contains(d[constants_1.SEGMENT]); });
                }
                if (colors) {
                    if (colors.values) {
                        var colorsSet = colors.toSet();
                        rowData = rowData.filter(function (d) { return colorsSet.contains(d[constants_1.SEGMENT]); });
                    }
                    else {
                        rowData = rowData.slice(0, colors.limit);
                    }
                }
            }
            if (searchText) {
                var searchTextLower = searchText.toLowerCase();
                rowData = rowData.filter(function (d) {
                    return String(d[constants_1.SEGMENT]).toLowerCase().indexOf(searchTextLower) !== -1;
                });
            }
            var formatter = measure ? formatter_1.formatterFromData(rowData.map(function (d) { return d[measureName]; }), measure.format) : null;
            rows = rowData.map(function (d, i) {
                var segmentValue = d[constants_1.SEGMENT];
                var segmentValueStr = String(segmentValue);
                var className = 'row';
                var checkbox = null;
                if (filterSet || colors) {
                    var selected;
                    if (colors) {
                        selected = false;
                        className += ' color';
                    }
                    else {
                        selected = essence.filter.filteredOnValue(dimension.expression, segmentValue);
                        className += ' ' + (selected ? 'selected' : 'not-selected');
                    }
                    checkbox = <checkbox_1.Checkbox selected={selected} color={colors ? colors.getColor(segmentValue, i) : null}/>;
                }
                var measureValueElement = null;
                if (measure) {
                    measureValueElement = <div className="measure-value">{formatter(d[measureName])}</div>;
                }
                var row = <div className={className} key={segmentValueStr} onClick={_this.onRowClick.bind(_this, segmentValue)}>
          <div className="segment-value" title={segmentValueStr}>
            {checkbox}
            <highlight_string_1.HighlightString className="label" text={segmentValueStr} highlightText={searchText}/>
          </div>
          {measureValueElement}
          {selected ? highlightControls : null}
        </div>;
                if (selected && highlightControls)
                    highlightControls = null; // place only once
                return row;
            });
            maxHeight += Math.max(2, rows.length) * constants_1.PIN_ITEM_HEIGHT;
            if (foldability) {
                folder = <div className={'folder ' + (unfolded ? 'folded' : 'unfolded')} onClick={this.toggleFold.bind(this)}>
          <svg_icon_1.SvgIcon svg={require('../../icons/caret.svg')}/>
          {unfolded ? 'Show selection' : 'Show all'}
        </div>;
                maxHeight += FOLDER_BOX_HEIGHT;
            }
        }
        maxHeight += constants_1.PIN_PADDING_BOTTOM;
        var loader = null;
        var message = null;
        if (loading) {
            loader = <loader_1.Loader />;
        }
        else if (dataset && !fetchQueued && searchText && !rows.length) {
            message = <div className="message">{"No results for \"" + searchText + "\""}</div>;
        }
        var queryError = null;
        if (error) {
            queryError = <query_error_1.QueryError error={error}/>;
        }
        var className = [
            'dimension-tile',
            (searchBar ? 'has-search' : 'no-search'),
            (folder ? 'has-folder' : 'no-folder'),
            (colors ? 'has-colors' : 'no-colors')
        ].join(' ');
        var style = {
            maxHeight: maxHeight
        };
        return <div className={className} style={style}>
      <tile_header_1.TileHeader title={dimension.title} onDragStart={this.onDragStart.bind(this)} onSearch={this.toggleSearch.bind(this)} onClose={onClose} ref="header"/>
      {searchBar}
      <div className="rows">
        {rows}
        {message}
      </div>
      {folder}
      {queryError}
      {loader}
    </div>;
    };
    return DimensionTile;
})(React.Component);
exports.DimensionTile = DimensionTile;
//# sourceMappingURL=dimension-tile.js.map