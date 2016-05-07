var chai_1 = require('chai');
require('../../utils/jsdom-setup');
var ReactDOM = require('react-dom');
require('../../utils/require-extensions');
var TestUtils = require('react-addons-test-utils');
var dimension_tile_1 = require('./dimension-tile');
describe('DimensionTile', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(<dimension_tile_1.DimensionTile clicker={null} dimension={null} sortOn={null} essence={null}/>);
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('dimension-tile');
    });
});
//# sourceMappingURL=dimension-tile.mocha.js.map