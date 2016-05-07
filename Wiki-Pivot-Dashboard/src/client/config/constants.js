var immutable_1 = require('immutable');
var plywood_1 = require('plywood');
exports.TITLE_HEIGHT = 36;
// Core = filter + split
exports.DIMENSION_HEIGHT = 27;
exports.MEASURE_HEIGHT = 27;
exports.CORE_ITEM_WIDTH = 192;
exports.CORE_ITEM_GAP = 8;
exports.BAR_TITLE_WIDTH = 66;
exports.PIN_TITLE_HEIGHT = 36;
exports.SEARCH_BOX_HEIGHT = 30;
exports.PIN_ITEM_HEIGHT = 24;
exports.PIN_PADDING_BOTTOM = 12;
exports.SPLIT = 'SPLIT';
exports.SEGMENT = 'SEGMENT';
exports.TIME_SEGMENT = 'TIME';
exports.TIME_SORT_ACTION = new plywood_1.SortAction({
    expression: plywood_1.$(exports.TIME_SEGMENT),
    direction: plywood_1.SortAction.ASCENDING
});
exports.MAX_SEARCH_LENGTH = 300;
exports.SEARCH_WAIT = 900;
exports.STRINGS = {
    dimensions: 'Dimensions',
    measures: 'Measures',
    filter: 'Filter',
    split: 'Split',
    subsplit: 'Split',
    sortBy: 'Sort by',
    limit: 'Limit',
    pin: 'Pin',
    pinboard: 'Pinboard',
    pinboardPlaceholder: 'Click or drag dimensions to pin them',
    granularity: 'Granularity',
    relative: 'Relative',
    specific: 'Specific',
    latest: 'Latest',
    current: 'Current',
    previous: 'Previous',
    start: 'Start',
    end: 'End',
    ok: 'OK',
    cancel: 'Cancel',
    queryError: 'Query Error'
};
exports.ADDITIONAL_LINKS = immutable_1.List([
    { title: 'Settings', name: 'settings' },
    { title: 'Info & Feedback', name: 'info & feedback', target: 'https://groups.google.com/forum/#!forum/imply-user-group' }
]);
//# sourceMappingURL=constants.js.map