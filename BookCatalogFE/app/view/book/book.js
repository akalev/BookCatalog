'use strict';

angular.module('myApp.book', ['ngRoute', 'ngTable'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/book', {
        templateUrl: 'view/book/book.html',
        controller: 'BookCtrl'
    });
}])

.controller('BookCtrl', ['$scope', 'ngTableParams', 'bookService', function($scope, ngTableParams, bookService) {
    bookService.getAll().then(({ data }) => {
        let originalData = data;
        $scope.tableForm = document.getElementById('tableBookCatalog');

        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 1
        }, {
            data: originalData
        });

        console.log($scope.tableParams.settings().data)

        $scope.deleteCount = 0;

        $scope.add = add;
        $scope.cancelChanges = cancelChanges;
        $scope.del = del;
        $scope.hasChanges = hasChanges;
        $scope.saveChanges = saveChanges;
    });

    function add() {
        $scope.isEditing = true;
        $scope.isAdding = true;
        $scope.tableParams.settings().data.unshift({
            name: "",
            age: null,
            money: null
        });
        // we need to ensure the user sees the new row we've just added.
        // it seems a poor but reliable choice to remove sorting and move them to the first page
        // where we know that our new item was added to
        $scope.tableParams.sorting({});
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    }

    function cancelChanges() {
        resetTableStatus();
        var currentPage = $scope.tableParams.page();
        $scope.tableParams.settings({
            data: angular.copy(originalData)
        });
        // keep the user on the current page when we can
        if (!$scope.isAdding) {
            $scope.tableParams.page(currentPage);
            $scope.tableParams.settings().data = $scope.tableParams.settings().data.filter(item => item.id);
            $scope.tableParams.reload();
        }
    }

    function del(row) {
        $scope.tableParams.settings().data = $scope.tableParams.settings().data.filter(item => item !== row);
        $scope.deleteCount++;
        $scope.tableParams.settings().$scope.tableTracker.untrack(row);
        $scope.tableParams.reload();
        bookService.delete(row);
    }

    function hasChanges() {
        return $scope.tableForm.$dirty || $scope.deleteCount > 0
    }

    function resetTableStatus() {
        $scope.isEditing = false;
        $scope.isAdding = false;
        $scope.deleteCount = 0;
        $scope.tableParams.settings().$scope.tableTracker.reset();
        //$scope.tableForm.$setPristine();
    }

    function saveChanges() {
        resetTableStatus();
        var currentPage = $scope.tableParams.page();
        originalData = angular.copy($scope.tableParams.settings().data);

        originalData.forEach(item => !item.id && bookService.save(item));
    }
}])

.directive('demoTrackedTable', function () {
    self.$inject = [];

    return {
        restrict: "A",
        priority: -1,
        require: "ngForm",
        controller: function demoTrackedTableController($scope, $parse, $attrs, $element) {
            var self = this;
            var tableForm = $element.controller("form");
            var dirtyCellsByRow = [];
            var invalidCellsByRow = [];

            init();

            ////////

            function init() {
                var setter = $parse($attrs.demoTrackedTable).assign;
                setter($scope, self);
                $scope.$on("$destroy", function() {
                    setter(null);
                });

                self.reset = reset;
                self.isCellDirty = isCellDirty;
                self.setCellDirty = setCellDirty;
                self.setCellInvalid = setCellInvalid;
                self.untrack = untrack;
            }

            function getCellsForRow(row, cellsByRow) {
                return cellsByRow.find(entry => entry.row === row);
            }

            function isCellDirty(row, cell) {
                var rowCells = getCellsForRow(row, dirtyCellsByRow);
                return rowCells && rowCells.cells.indexOf(cell) !== -1;
            }

            function reset() {
                dirtyCellsByRow = [];
                invalidCellsByRow = [];
                setInvalid(false);
            }

            function setCellDirty(row, cell, isDirty) {
                setCellStatus(row, cell, isDirty, dirtyCellsByRow);
            }

            function setCellInvalid(row, cell, isInvalid) {
                setCellStatus(row, cell, isInvalid, invalidCellsByRow);
                setInvalid(invalidCellsByRow.length > 0);
            }

            function setCellStatus(row, cell, value, cellsByRow) {
                var rowCells = getCellsForRow(row, cellsByRow);
                if (!rowCells && !value) {
                    return;
                }

                if (value) {
                    if (!rowCells) {
                        rowCells = {
                            row: row,
                            cells: []
                        };
                        cellsByRow.push(rowCells);
                    }
                    if (rowCells.cells.indexOf(cell) === -1) {
                        rowCells.cells.push(cell);
                    }
                } else {
                    rowCells.cells = rowCells.cells.filter(item => item !== cell);

                    if (rowCells.cells.length === 0) {
                        cellsByRow = cellsByRow.filter(item => item !== rowCells);
                    }
                }
            }

            function setInvalid(isInvalid) {
                self.$invalid = isInvalid;
                self.$valid = !isInvalid;
            }

            function untrack(row) {
                invalidCellsByRow = invalidCellsByRow.filter(item => item.row !== row);
                dirtyCellsByRow = dirtyCellsByRow.filter(item => item.row !== row);
                setInvalid(invalidCellsByRow.length > 0);
            }
        }
    };
});

(function() {
    angular.module("myApp").directive("demoTrackedTableRow", demoTrackedTableRow);

    demoTrackedTableRow.$inject = [];

    function demoTrackedTableRow() {
        return {
            restrict: "A",
            priority: -1,
            require: ["^demoTrackedTable", "ngForm"],
            controller: demoTrackedTableRowController
        };
    }

    demoTrackedTableRowController.$inject = ["$attrs", "$element", "$parse", "$scope"];

    function demoTrackedTableRowController($attrs, $element, $parse, $scope) {
        var self = this;
        var row = $parse($attrs.demoTrackedTableRow)($scope);
        var rowFormCtrl = $element.controller("form");
        var trackedTableCtrl = $element.controller("demoTrackedTable");

        self.isCellDirty = isCellDirty;
        self.setCellDirty = setCellDirty;
        self.setCellInvalid = setCellInvalid;

        function isCellDirty(cell) {
            return trackedTableCtrl.isCellDirty(row, cell);
        }

        function setCellDirty(cell, isDirty) {
            trackedTableCtrl.setCellDirty(row, cell, isDirty)
        }

        function setCellInvalid(cell, isInvalid) {
            trackedTableCtrl.setCellInvalid(row, cell, isInvalid)
        }
    }
})();

(function() {
    angular.module("myApp").directive("demoTrackedTableCell", demoTrackedTableCell);

    demoTrackedTableCell.$inject = [];

    function demoTrackedTableCell() {
        return {
            restrict: "A",
            priority: -1,
            scope: true,
            require: ["^demoTrackedTableRow", "ngForm"],
            controller: demoTrackedTableCellController
        };
    }

    demoTrackedTableCellController.$inject = ["$attrs", "$element", "$scope"];

    function demoTrackedTableCellController($attrs, $element, $scope) {
        var self = this;
        var cellFormCtrl = $element.controller("form");
        var cellName = cellFormCtrl.$name;
        var trackedTableRowCtrl = $element.controller("demoTrackedTableRow");

        if (trackedTableRowCtrl.isCellDirty(cellName)) {
            cellFormCtrl.$setDirty();
        } else {
            cellFormCtrl.$setPristine();
        }
        // note: we don't have to force setting validaty as angular will run validations
        // when we page back to a row that contains invalid data

        $scope.$watch(function() {
            return cellFormCtrl.$dirty;
        }, function(newValue, oldValue) {
            if (newValue === oldValue) return;

            trackedTableRowCtrl.setCellDirty(cellName, newValue);
        });

        $scope.$watch(function() {
            return cellFormCtrl.$invalid;
        }, function(newValue, oldValue) {
            if (newValue === oldValue) return;

            trackedTableRowCtrl.setCellInvalid(cellName, newValue);
        });
    }
})();