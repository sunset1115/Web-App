var immutable_class_1 = require('immutable-class');
var plywood_1 = require('plywood');
var general_1 = require('../../../common/utils/general/general');
var NULL_COLOR = '#666666';
//const OTHERS_COLOR = '#AAAAAA';
var NORMAL_COLORS = [
    '#2D95CA',
    '#EFB925',
    '#DA4E99',
    '#4CC873',
    '#745CBD',
    '#EA7136',
    '#E68EE0',
    '#218C35',
    '#B0B510',
    '#904064'
];
function valuesFromJS(valuesJS) {
    var values = {};
    for (var i = 0; i < NORMAL_COLORS.length; i++) {
        if (!general_1.hasOwnProperty(valuesJS, i))
            continue;
        values[i] = plywood_1.valueFromJS(valuesJS[i]);
    }
    return values;
}
function valuesToJS(values) {
    var valuesJS = {};
    for (var i = 0; i < NORMAL_COLORS.length; i++) {
        if (!general_1.hasOwnProperty(values, i))
            continue;
        valuesJS[i] = plywood_1.valueToJS(values[i]);
    }
    return valuesJS;
}
function valueEquals(v1, v2) {
    if (v1 === v2)
        return true;
    if (!v1 !== !v2)
        return false;
    if (v1.toISOString && v2.toISOString)
        return v1.valueOf() === v2.valueOf();
    if (immutable_class_1.isImmutableClass(v1))
        return v1.equals(v2);
    return false;
}
function valuesEqual(values1, values2) {
    if (!Boolean(values1) === Boolean(values2))
        return false;
    if (values1 === values2)
        return true;
    if (!values1 !== !values2)
        return false;
    if (typeof values1 !== typeof values2)
        return false;
    for (var i = 0; i < NORMAL_COLORS.length; i++) {
        var v1 = values1[i];
        var v2 = values2[i];
        if (general_1.hasOwnProperty(values1, i) !== general_1.hasOwnProperty(values2, i))
            return false;
        if (!valueEquals(v1, v2))
            return false;
    }
    return true;
}
function cloneValues(values) {
    var newValues = {};
    for (var i = 0; i < NORMAL_COLORS.length; i++) {
        if (!general_1.hasOwnProperty(values, i))
            continue;
        newValues[i] = values[i];
    }
    return newValues;
}
var check;
var Colors = (function () {
    function Colors(parameters) {
        this.dimension = parameters.dimension;
        if (!this.dimension)
            throw new Error('must have a dimension');
        this.values = parameters.values;
        this.limit = parameters.limit;
        if (!this.values && !this.limit)
            throw new Error('must have values or limit');
    }
    Colors.isColors = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, Colors);
    };
    Colors.fromLimit = function (dimension, limit) {
        return new Colors({ dimension: dimension, limit: limit });
    };
    Colors.fromValues = function (dimension, values) {
        var valueLookup = {};
        var n = Math.min(values.length, NORMAL_COLORS.length);
        for (var i = 0; i < n; i++) {
            valueLookup[i] = values[i];
        }
        return new Colors({ dimension: dimension, values: valueLookup });
    };
    Colors.fromJS = function (parameters) {
        var value = {
            dimension: parameters.dimension,
            values: parameters.values ? valuesFromJS(parameters.values) : null,
            limit: parameters.limit
        };
        return new Colors(value);
    };
    Colors.prototype.valueOf = function () {
        return {
            dimension: this.dimension,
            values: this.values,
            limit: this.limit
        };
    };
    Colors.prototype.toJS = function () {
        var js = {
            dimension: this.dimension
        };
        if (this.values)
            js.values = valuesToJS(this.values);
        if (this.limit)
            js.limit = this.limit;
        return js;
    };
    Colors.prototype.toJSON = function () {
        return this.toJS();
    };
    Colors.prototype.toString = function () {
        return "[Colors: " + this.dimension + "]";
    };
    Colors.prototype.equals = function (other) {
        return Colors.isColors(other) &&
            valuesEqual(this.values, other.values) &&
            Boolean(this.limit) === Boolean(other.limit) &&
            (!this.limit || this.limit === other.limit);
    };
    Colors.prototype.numColors = function () {
        var _a = this, values = _a.values, limit = _a.limit;
        if (values) {
            return Object.keys(values).length;
        }
        return limit;
    };
    Colors.prototype.toArray = function () {
        var values = this.values;
        if (!values)
            return null;
        var vs = [];
        for (var i = 0; i < NORMAL_COLORS.length; i++) {
            if (!general_1.hasOwnProperty(values, i))
                continue;
            vs.push(values[i]);
        }
        return vs;
    };
    Colors.prototype.toSet = function () {
        if (!this.values)
            return null;
        return plywood_1.Set.fromJS(this.toArray());
    };
    Colors.prototype.toHavingFilter = function (segmentName) {
        var _a = this, dimension = _a.dimension, values = _a.values;
        if (!segmentName)
            segmentName = dimension;
        if (!values)
            return null;
        return new plywood_1.FilterAction({
            expression: plywood_1.$(segmentName).in(this.toSet())
        });
    };
    Colors.prototype.toLimitAction = function () {
        return new plywood_1.LimitAction({
            limit: this.numColors()
        });
    };
    Colors.prototype.toggle = function (v) {
        return this.has(v) ? this.remove(v) : this.add(v);
    };
    Colors.prototype.valueIndex = function (v) {
        var values = this.values;
        if (!values)
            return -1;
        for (var i = 0; i < NORMAL_COLORS.length; i++) {
            if (!general_1.hasOwnProperty(values, i))
                continue;
            if (valueEquals(values[i], v))
                return i;
        }
        return -1;
    };
    Colors.prototype.nextIndex = function () {
        var values = this.values;
        if (!values)
            return 0;
        for (var i = 0; i < NORMAL_COLORS.length; i++) {
            if (general_1.hasOwnProperty(values, i))
                continue;
            return i;
        }
        return -1;
    };
    Colors.prototype.has = function (v) {
        return this.valueIndex(v) !== -1;
    };
    Colors.prototype.add = function (v) {
        if (this.has(v))
            return this;
        var idx = this.nextIndex();
        if (idx === -1)
            return this;
        var value = this.valueOf();
        value.values = value.values ? cloneValues(value.values) : {};
        value.values[idx] = v;
        delete value.limit;
        return new Colors(value);
    };
    Colors.prototype.remove = function (v) {
        var idx = this.valueIndex(v);
        if (idx === -1)
            return this;
        var value = this.valueOf();
        value.values = cloneValues(value.values);
        delete value.values[idx];
        delete value.limit;
        return new Colors(value);
    };
    Colors.prototype.getColor = function (value, index) {
        if (value === null)
            return NULL_COLOR;
        var _a = this, values = _a.values, limit = _a.limit;
        if (values) {
            var colorIdx = this.valueIndex(value);
            return colorIdx === -1 ? null : NORMAL_COLORS[colorIdx];
        }
        else {
            return index < limit ? NORMAL_COLORS[index] : null;
        }
    };
    return Colors;
})();
exports.Colors = Colors;
check = Colors;
//# sourceMappingURL=colors.js.map