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
 * Created by Natallia on 7/23/2016.
 */
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var pipe_general_1 = require("../transformations/pipe.general");
var ng2_select_1 = require('ng2-select/ng2-select');
////////////////////////////////////////////////////////////////////////////////
// select-input ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var MultiSelectInput = (function () {
    function MultiSelectInput() {
        this.options = new Set();
        this.items = new Set();
        this.updated = new core_1.EventEmitter();
        this.active = true;
        this.externalChange = false;
    }
    MultiSelectInput.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.externalChange) {
            setTimeout(function () { _this.active = false; }, 0);
            setTimeout(function () { _this.active = true; }, 0);
        }
        this.externalChange = true;
    };
    MultiSelectInput.prototype.refreshValue = function (value) {
        this.externalChange = false;
        var newItems = value.map(function (x) { return x.id; });
        this.updated.emit(new Set(newItems));
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Set)
    ], MultiSelectInput.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Set)
    ], MultiSelectInput.prototype, "items", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MultiSelectInput.prototype, "updated", void 0);
    MultiSelectInput = __decorate([
        core_1.Component({
            selector: 'select-input',
            inputs: ['items', 'options', 'disabled'],
            template: "\n    <div *ngIf=\"active\">\n      <ng-select \n        [items]       = \"options | setToArray | mapToOptions\"\n        [initData]    = \"items   | setToArray | mapToOptions\"\n        [multiple]    = \"true\"\n        [disabled]    = \"disabled\"\n        (data)        = \"refreshValue($event)\"\n      ></ng-select>\n    </div>\n    ",
            directives: [ng2_select_1.SELECT_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES],
            pipes: [pipe_general_1.MapToOptions, pipe_general_1.SetToArray],
        }), 
        __metadata('design:paramtypes', [])
    ], MultiSelectInput);
    return MultiSelectInput;
}());
exports.MultiSelectInput = MultiSelectInput;
////////////////////////////////////////////////////////////////////////////////
// select-1-input //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var SingleSelectInput = (function () {
    function SingleSelectInput() {
        this.updated = new core_1.EventEmitter();
        this.active = true;
        this.externalChange = false;
    }
    Object.defineProperty(SingleSelectInput.prototype, "items", {
        get: function () {
            return this.item ? [this.item] : [];
        },
        enumerable: true,
        configurable: true
    });
    SingleSelectInput.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.externalChange) {
            setTimeout(function () { _this.active = false; }, 0);
            setTimeout(function () { _this.active = true; }, 0);
        }
        this.externalChange = true;
    };
    SingleSelectInput.prototype.refreshValue = function (value) {
        //let options: any[] = (this.options[0] && this.options[0].children)? [].concat.apply([], this.options.map(item => item.children)): this.options;
        this.externalChange = false;
        if (value.id) {
            this.item = value.id;
            this.updated.emit(this.item);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SingleSelectInput.prototype, "item", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SingleSelectInput.prototype, "options", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SingleSelectInput.prototype, "updated", void 0);
    SingleSelectInput = __decorate([
        core_1.Component({
            selector: 'select-input-1',
            inputs: ['item', 'options', 'disabled'],
            template: "\n    <div *ngIf=\"active\">\n      <ng-select\n        [items]       = \"options | setToArray | mapToOptions\"\n        [initData]    = \"items | mapToOptions\"\n        [multiple]    = false\n        [disabled]    = \"disabled\"\n        (data)        = \"refreshValue($event)\"\n      ></ng-select>\n    </div>\n  ",
            directives: [ng2_select_1.SELECT_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES],
            pipes: [pipe_general_1.MapToOptions, pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], SingleSelectInput);
    return SingleSelectInput;
}());
exports.SingleSelectInput = SingleSelectInput;
//# sourceMappingURL=component.select.js.map