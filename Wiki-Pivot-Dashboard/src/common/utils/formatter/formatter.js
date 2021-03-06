var numeral = require('numeral');
var scales = {
    'a': {
        '': 1,
        'k': 1e3,
        'm': 1e6,
        'b': 1e9,
        't': 1e12
    },
    'b': {
        'B': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024,
        'PB': 1024 * 1024 * 1024 * 1024 * 1024,
        'EB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        'ZB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        'YB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024
    }
};
function getMiddleNumber(values) {
    var filteredAbsData = [];
    for (var _i = 0; _i < values.length; _i++) {
        var v = values[_i];
        if (v === 0 || isNaN(v) || !isFinite(v))
            continue;
        filteredAbsData.push(Math.abs(v));
    }
    var n = filteredAbsData.length;
    if (n) {
        filteredAbsData.sort(function (a, b) { return b - a; });
        return filteredAbsData[Math.ceil((n - 1) / 2)];
    }
    else {
        return 0;
    }
}
exports.getMiddleNumber = getMiddleNumber;
function formatterFromData(values, format) {
    var match = format.match(/^(\S*)( ?)([ab])$/);
    if (match) {
        var numberFormat = match[1];
        var space = match[2];
        var formatType = match[3];
        var middle = getMiddleNumber(values);
        var formatMiddle = numeral(middle).format('0 ' + formatType);
        var unit = formatMiddle.split(' ')[1] || '';
        var scale = scales[formatType][unit];
        var append = unit ? space + unit : '';
        return function (n) {
            if (isNaN(n) || !isFinite(n))
                return '-';
            return numeral(n / scale).format(numberFormat) + append;
        };
    }
    else {
        return function (n) {
            if (isNaN(n) || !isFinite(n))
                return '-';
            return numeral(n).format(format);
        };
    }
}
exports.formatterFromData = formatterFromData;
//# sourceMappingURL=formatter.js.map