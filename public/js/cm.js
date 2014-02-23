var cm = angular.module('cm', []);
var onlyUnique = function (value, index, self) {
    return self.indexOf(value) === index;
}