var immutable_1 = require('immutable');
var immutable_class_1 = require('immutable-class');
var objectHasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwnProperty(obj, key) {
    if (!obj)
        return false;
    return objectHasOwnProperty.call(obj, key);
}
exports.hasOwnProperty = hasOwnProperty;
function moveInList(list, itemIndex, insertPoint) {
    var n = list.size;
    if (itemIndex < 0 || itemIndex >= n)
        throw new Error('itemIndex out of range');
    if (insertPoint < 0 || insertPoint > n)
        throw new Error('insertPoint out of range');
    var newArray = [];
    list.forEach(function (value, i) {
        if (i === insertPoint)
            newArray.push(list.get(itemIndex));
        if (i !== itemIndex)
            newArray.push(value);
    });
    if (n === insertPoint)
        newArray.push(list.get(itemIndex));
    return immutable_1.List(newArray);
}
exports.moveInList = moveInList;
function makeTitle(name) {
    return name.replace(/(^|[_\-]+)\w/g, function (s) {
        return s.replace(/[_\-]+/, ' ').toUpperCase();
    }).replace(/[a-z][A-Z]/g, function (s) {
        return s[0] + ' ' + s[1];
    }).trim();
}
exports.makeTitle = makeTitle;
function listsEqual(listA, listB) {
    if (listA === listB)
        return true;
    if (!listA || !listB)
        return false;
    return immutable_class_1.arraysEqual(listA.toArray(), listB.toArray());
}
exports.listsEqual = listsEqual;
function calculateDragPosition(offset, numItems, itemWidth, itemGap) {
    if (!numItems) {
        return {
            dragInsertPosition: null,
            dragReplacePosition: 0
        };
    }
    if (offset < 0) {
        return {
            dragInsertPosition: 0,
            dragReplacePosition: null
        };
    }
    var sectionWidth = itemWidth + itemGap;
    var sectionNumber = Math.floor(offset / sectionWidth);
    if (sectionNumber > numItems) {
        return {
            dragInsertPosition: null,
            dragReplacePosition: numItems
        };
    }
    var offsetWithinSection = offset - sectionWidth * sectionNumber;
    if (offsetWithinSection < itemWidth) {
        return {
            dragInsertPosition: null,
            dragReplacePosition: sectionNumber
        };
    }
    else {
        return {
            dragInsertPosition: sectionNumber + 1,
            dragReplacePosition: null
        };
    }
}
exports.calculateDragPosition = calculateDragPosition;
function collect(wait, func) {
    var timeout;
    var later = function () {
        timeout = null;
        func();
    };
    return function () {
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
    };
}
exports.collect = collect;
function verifyUrlSafeName(name) {
    if (typeof name !== 'string')
        throw new TypeError('name must be a string');
    if (!name.length)
        throw new Error('can not have empty name');
    if (!/^[\w.~\-]*$/.test(name)) {
        throw new Error("'" + name + "' is not a URL safe name. Try '" + name.replace(/[^\w~.~\-]+/g, '_') + "' instead?");
    }
}
exports.verifyUrlSafeName = verifyUrlSafeName;
//# sourceMappingURL=general.js.map