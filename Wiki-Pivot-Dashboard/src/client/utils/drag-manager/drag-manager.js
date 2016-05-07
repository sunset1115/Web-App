var DragManager = (function () {
    function DragManager() {
    }
    DragManager.init = function () {
        document.addEventListener("dragend", function () {
            DragManager.dragDimension = null;
            DragManager.dragSplit = null;
        }, false);
    };
    DragManager.setDragDimension = function (dimension) {
        DragManager.dragDimension = dimension;
    };
    DragManager.getDragDimension = function () {
        return DragManager.dragDimension;
    };
    DragManager.setDragSplit = function (split) {
        DragManager.dragSplit = split;
    };
    DragManager.getDragSplit = function () {
        return DragManager.dragSplit;
    };
    DragManager.dragDimension = null;
    DragManager.dragSplit = null;
    return DragManager;
})();
exports.DragManager = DragManager;
//# sourceMappingURL=drag-manager.js.map