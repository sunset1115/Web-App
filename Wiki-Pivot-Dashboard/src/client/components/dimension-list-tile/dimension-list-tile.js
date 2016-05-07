var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./dimension-list-tile.css');
var React = require('react');
var svg_icon_1 = require('../svg-icon/svg-icon');
var constants_1 = require('../../config/constants');
var drag_manager_1 = require('../../utils/drag-manager/drag-manager');
var dom_1 = require('../../utils/dom/dom');
var index_1 = require('../../../common/models/index');
var DIMENSION_CLASS_NAME = 'dimension';
var DimensionListTile = (function (_super) {
    __extends(DimensionListTile, _super);
    function DimensionListTile() {
        _super.call(this);
        this.state = {
            PreviewMenuAsync: null,
            menuOpenOn: null,
            menuDimension: null,
            highlightDimension: null
        };
    }
    DimensionListTile.prototype.componentDidMount = function () {
        var _this = this;
        require.ensure(['../preview-menu/preview-menu'], function (require) {
            _this.setState({
                PreviewMenuAsync: require('../preview-menu/preview-menu').PreviewMenu
            });
        }, 'preview-menu');
    };
    DimensionListTile.prototype.clickDimension = function (dimension, e) {
        var menuOpenOn = this.state.menuOpenOn;
        var target = dom_1.findParentWithClass(e.target, DIMENSION_CLASS_NAME);
        if (menuOpenOn === target) {
            this.closeMenu();
            return;
        }
        this.setState({
            menuOpenOn: target,
            menuDimension: dimension
        });
    };
    DimensionListTile.prototype.closeMenu = function () {
        var menuOpenOn = this.state.menuOpenOn;
        if (!menuOpenOn)
            return;
        this.setState({
            menuOpenOn: null,
            menuDimension: null
        });
    };
    DimensionListTile.prototype.dragStart = function (dimension, e) {
        var _a = this.props, essence = _a.essence, getUrlPrefix = _a.getUrlPrefix;
        var dataTransfer = e.dataTransfer;
        dataTransfer.effectAllowed = 'all';
        if (getUrlPrefix) {
            var newUrl = essence.changeSplit(index_1.SplitCombine.fromExpression(dimension.expression), index_1.VisStrategy.FairGame).getURL(getUrlPrefix());
            dataTransfer.setData("text/url-list", newUrl);
            dataTransfer.setData("text/plain", newUrl);
        }
        drag_manager_1.DragManager.setDragDimension(dimension);
        dom_1.setDragGhost(dataTransfer, dimension.title);
        this.closeMenu();
    };
    DimensionListTile.prototype.onMouseOver = function (dimension) {
        var highlightDimension = this.state.highlightDimension;
        if (highlightDimension === dimension)
            return;
        this.setState({
            highlightDimension: dimension
        });
    };
    DimensionListTile.prototype.onMouseLeave = function (dimension) {
        var highlightDimension = this.state.highlightDimension;
        if (highlightDimension !== dimension)
            return;
        this.setState({
            highlightDimension: null
        });
    };
    DimensionListTile.prototype.renderMenu = function () {
        var _a = this.props, essence = _a.essence, clicker = _a.clicker, menuStage = _a.menuStage, triggerFilterMenu = _a.triggerFilterMenu, triggerSplitMenu = _a.triggerSplitMenu;
        var _b = this.state, PreviewMenuAsync = _b.PreviewMenuAsync, menuOpenOn = _b.menuOpenOn, menuDimension = _b.menuDimension;
        if (!PreviewMenuAsync || !menuDimension)
            return null;
        var onClose = this.closeMenu.bind(this);
        return <PreviewMenuAsync clicker={clicker} essence={essence} direction="right" containerStage={menuStage} openOn={menuOpenOn} dimension={menuDimension} triggerFilterMenu={triggerFilterMenu} triggerSplitMenu={triggerSplitMenu} onClose={onClose}/>;
    };
    DimensionListTile.prototype.render = function () {
        var _this = this;
        var essence = this.props.essence;
        var _a = this.state, menuDimension = _a.menuDimension, highlightDimension = _a.highlightDimension;
        var dataSource = essence.dataSource;
        var itemY = 0;
        var dimensionItems = dataSource.dimensions.toArray().map(function (dimension, i) {
            var style = dom_1.transformStyle(0, itemY);
            itemY += constants_1.DIMENSION_HEIGHT;
            var classNames = [
                DIMENSION_CLASS_NAME,
                'type-' + dimension.className
            ];
            if (dimension === highlightDimension)
                classNames.push('highlight');
            if (dimension === menuDimension)
                classNames.push('selected');
            return <div className={classNames.join(' ')} key={dimension.name} onClick={_this.clickDimension.bind(_this, dimension)} onMouseOver={_this.onMouseOver.bind(_this, dimension)} onMouseLeave={_this.onMouseLeave.bind(_this, dimension)} draggable={true} onDragStart={_this.dragStart.bind(_this, dimension)} style={style}>
        <div className="icon">
          <svg_icon_1.SvgIcon svg={require('../../icons/type-' + dimension.className + '.svg')}/>
        </div>
        <div className="item-title">{dimension.title}</div>
      </div>;
        }, this);
        var style = {
            flex: dimensionItems.length + 2
        };
        return <div className="dimension-list-tile" style={style}>
      <div className="title">{constants_1.STRINGS.dimensions}</div>
      <div className="items" ref="items">
        {dimensionItems}
      </div>
      {this.renderMenu()}
    </div>;
    };
    return DimensionListTile;
})(React.Component);
exports.DimensionListTile = DimensionListTile;
//# sourceMappingURL=dimension-list-tile.js.map