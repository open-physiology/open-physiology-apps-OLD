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
 * Created by Natallia on 7/8/2016.
 */
var core_1 = require('@angular/core');
var utils_model_1 = require("../services/utils.model");
var RepoAbstract = (function () {
    function RepoAbstract(highlightService) {
        var _this = this;
        this.added = new core_1.EventEmitter();
        this.removed = new core_1.EventEmitter();
        this.updated = new core_1.EventEmitter();
        this.selectedItemChange = new core_1.EventEmitter();
        this.activeItemChange = new core_1.EventEmitter();
        this.highlightedItemChange = new core_1.EventEmitter();
        this.items = [];
        this.types = [];
        this.options = {};
        this.zones = [];
        this.ignore = new Set();
        this.sortByMode = "unsorted";
        this.filterByMode = "Name";
        this.searchString = "";
        this.isSelectedOpen = false;
        this.getClassLabel = utils_model_1.getClassLabel;
        this.getIcon = utils_model_1.getIcon;
        this.getItemClass = utils_model_1.getItemClass;
        this.hs = highlightService.highlightedItemChanged$.subscribe(function (item) {
            if (_this.items.indexOf(item) > -1) {
                _this._highlightedItem = item;
            }
        });
    }
    RepoAbstract.prototype.ngOnDestroy = function () {
        if (this.hs)
            this.hs.unsubscribe();
    };
    Object.defineProperty(RepoAbstract.prototype, "selectedItem", {
        get: function () {
            return this._selectedItem;
        },
        set: function (item) {
            if (this._selectedItem != item) {
                this._selectedItem = item;
                this.selectedItemChange.emit(item);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoAbstract.prototype, "activeItem", {
        get: function () {
            return this._activeItem;
        },
        set: function (item) {
            if (this._activeItem != item) {
                this._activeItem = item;
                this.activeItemChange.emit(item);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoAbstract.prototype, "highlightedItem", {
        set: function (item) {
            if (this.highlightedItem != item) {
                this._highlightedItem = item;
                this.highlightedItemChange.emit(item);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RepoAbstract.prototype, "highightedItem", {
        get: function () {
            return this._highlightedItem;
        },
        enumerable: true,
        configurable: true
    });
    RepoAbstract.prototype.ngOnInit = function () {
        if (!this.items)
            this.items = [];
        if (this.items[0] || !this.selectedItem)
            this.selectedItem = this.items[0];
        //Resources
        if (this.types.length == 0) {
            for (var x in utils_model_1.ResourceName) {
                this.types.push(x);
            }
        }
        this.zones = this.types.map(function (x) { return x + "_zone"; });
    };
    RepoAbstract.prototype.updateHighlighted = function (item) {
        this.highlightedItem = item;
    };
    RepoAbstract.prototype.cleanHighlighted = function (item) {
        if (this.highlightedItem == item)
            this.highlightedItem = null;
    };
    RepoAbstract.prototype.updateActive = function (item) {
        this.activeItem = item;
    };
    RepoAbstract.prototype.updateSelected = function (item) {
        this.selectedItem = item;
        this.isSelectedOpen = !this.isSelectedOpen;
    };
    RepoAbstract.prototype.onSorted = function (prop) {
        this.sortByMode = prop.toLowerCase();
    };
    RepoAbstract.prototype.onFiltered = function (config) {
        this.filterByMode = config.mode.toLowerCase();
        this.searchString = config.filter;
    };
    RepoAbstract.prototype.onSaved = function (item, updatedItem) {
        this.updated.emit(this.items);
        if (item == this.selectedItem) {
            this.selectedItemChange.emit(this.selectedItem);
        }
    };
    RepoAbstract.prototype.onCanceled = function (updatedItem) { };
    RepoAbstract.prototype.onRemoved = function (item) {
        if (!this.items)
            return;
        var index = this.items.indexOf(item);
        if (index > -1)
            this.items.splice(index, 1);
        if (item == this.selectedItem) {
            if (this.items.length > 0)
                this.selectedItem = this.items[0];
            else
                this.selectedItem = null;
        }
        item.delete();
        this.removed.emit(item);
        this.updated.emit(this.items);
    };
    RepoAbstract.prototype.onAdded = function (Class) {
        var options = {};
        if (Class == utils_model_1.ResourceName.LyphWithAxis) {
            Class = utils_model_1.ResourceName.Lyph;
            options.createAxis = true;
        }
        if (Class == utils_model_1.ResourceName.Lyph) {
            options.createRadialBorders = true;
        }
        var newItem = utils_model_1.model[Class].new({ name: "New " + Class }, options);
        if (Class == utils_model_1.ResourceName.Material) {
            var newType = utils_model_1.model.Type.new({ name: newItem.name, definition: newItem });
            newItem.p('name').subscribe(newType.p('name'));
        }
        this.items.push(newItem);
        this.updated.emit(this.items);
        this.added.emit(newItem);
        this.selectedItem = newItem;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RepoAbstract.prototype, "added", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RepoAbstract.prototype, "removed", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RepoAbstract.prototype, "updated", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RepoAbstract.prototype, "selectedItemChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RepoAbstract.prototype, "activeItemChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RepoAbstract.prototype, "highlightedItemChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RepoAbstract.prototype, "items", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RepoAbstract.prototype, "types", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RepoAbstract.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RepoAbstract.prototype, "selectionOptions", void 0);
    return RepoAbstract;
}());
exports.RepoAbstract = RepoAbstract;
//# sourceMappingURL=repo.abstract.js.map