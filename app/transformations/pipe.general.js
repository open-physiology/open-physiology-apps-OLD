"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by Natallia on 6/9/2016.
 */
var core_1 = require('@angular/core');
///////////////////////////////////////////////////
var HideClass = (function () {
    function HideClass() {
    }
    HideClass.prototype.transform = function (items, classNames) {
        if (!items)
            return items;
        if (classNames instanceof Set)
            classNames = Array.from(classNames);
        var filteredItems = items.filter(function (x) { return (classNames.indexOf(x.class) < 0); });
        if (classNames.indexOf('Type') > -1) {
            filteredItems = filteredItems.filter(function (x) { return (x.class.indexOf('Type') < 0); });
        }
        return filteredItems;
    };
    HideClass = __decorate([
        core_1.Pipe({
            name: 'hideClass'
        }), 
        __metadata('design:paramtypes', [])
    ], HideClass);
    return HideClass;
}());
exports.HideClass = HideClass;
///////////////////////////////////////////////////
var FilterBy = (function () {
    function FilterBy() {
    }
    FilterBy.prototype.transform = function (items, args) {
        if (!items)
            return items;
        if (!args || args.length < 2)
            return items;
        if (args[0].length == 0)
            return items;
        var filter = args[0];
        var property = args[1];
        return items.filter(function (item) {
            return (typeof (item[property]) === 'string') ?
                item[property].toLowerCase().indexOf(filter.toLowerCase()) !== -1 :
                item[property] == filter;
        });
    };
    FilterBy = __decorate([
        core_1.Pipe({
            name: 'filterBy'
        }), 
        __metadata('design:paramtypes', [])
    ], FilterBy);
    return FilterBy;
}());
exports.FilterBy = FilterBy;
///////////////////////////////////////////////////
var FilterByClass = (function () {
    function FilterByClass() {
    }
    FilterByClass.prototype.transform = function (items, classNames) {
        if (!items)
            return items;
        return items.filter(function (item) { return (classNames.indexOf(item.class) !== -1); });
    };
    FilterByClass = __decorate([
        core_1.Pipe({
            name: 'filterByClass'
        }), 
        __metadata('design:paramtypes', [])
    ], FilterByClass);
    return FilterByClass;
}());
exports.FilterByClass = FilterByClass;
///////////////////////////////////////////////////
var SetToArray = (function () {
    function SetToArray() {
    }
    SetToArray.prototype.transform = function (items) {
        return Array.from(items || []);
    };
    SetToArray = __decorate([
        core_1.Pipe({
            name: 'setToArray'
        }), 
        __metadata('design:paramtypes', [])
    ], SetToArray);
    return SetToArray;
}());
exports.SetToArray = SetToArray;
///////////////////////////////////////////////////
var MapToOptions = (function () {
    function MapToOptions() {
    }
    MapToOptions.prototype.transform = function (items) {
        if (!items || !items[0])
            return [];
        return convert(items);
        function convert(items) {
            //Show unnamed options?
            var namedItems = items.filter(function (x) { return (x.name && (x.name !== "")); });
            return namedItems.map(function (entry) { return ({
                id: entry,
                text: entry.name ? entry.name : "(Unnamed) " + entry.class
            }); });
        }
    };
    MapToOptions = __decorate([
        core_1.Pipe({
            name: 'mapToOptions'
        }), 
        __metadata('design:paramtypes', [])
    ], MapToOptions);
    return MapToOptions;
}());
exports.MapToOptions = MapToOptions;
///////////////////////////////////////////////////
var MapToCategories = (function () {
    function MapToCategories() {
    }
    MapToCategories.prototype.transform = function (items) {
        if (!items || (items.length == 0))
            return [];
        var types = Array.from(new Set(items.map(function (item) { return item.type; })));
        var typedItems = [];
        var _loop_1 = function(type) {
            var typed = items.filter(function (item) { return (item.type == type); });
            typedItems.push({ text: type, children: typed });
        };
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            _loop_1(type);
        }
        return typedItems;
    };
    MapToCategories = __decorate([
        core_1.Pipe({
            name: 'mapToCategories'
        }), 
        __metadata('design:paramtypes', [])
    ], MapToCategories);
    return MapToCategories;
}());
exports.MapToCategories = MapToCategories;
////////////////////////////////////////////////////
var OrderBy = (function () {
    function OrderBy() {
    }
    OrderBy.prototype.transform = function (items, property) {
        var orderType = 'asc';
        var currentField = property;
        if (currentField.indexOf("unsorted") > -1)
            return items;
        if (currentField[0] === '-') {
            currentField = currentField.substring(1);
            orderType = 'desc';
        }
        items.sort(function (a, b) {
            if (orderType === 'desc') {
                if (a[currentField] > b[currentField])
                    return -1;
                if (a[currentField] < b[currentField])
                    return 1;
                return 0;
            }
            else {
                if (a[currentField] > b[currentField])
                    return 1;
                if (a[currentField] < b[currentField])
                    return -1;
                return 0;
            }
        });
        return items;
    };
    OrderBy = __decorate([
        core_1.Pipe({ name: 'orderBy', pure: false }), 
        __metadata('design:paramtypes', [])
    ], OrderBy);
    return OrderBy;
}());
exports.OrderBy = OrderBy;
//# sourceMappingURL=pipe.general.js.map