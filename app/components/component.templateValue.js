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
 * Created by Natallia on 6/21/2016.
 */
var core_1 = require('@angular/core');
var toolbar_form_1 = require("./toolbar.form");
var TemplateValue = (function () {
    function TemplateValue() {
        this.value = 0;
        this.valueSet = { min: 0, max: 0, std: 0, mean: 0 };
        this.valueType = "Value";
        this.updated = new core_1.EventEmitter();
    }
    TemplateValue.prototype.ngOnInit = function () {
        if (this.item) {
            if (this.item instanceof Object) {
                this.valueSet = this.item;
                if (this.item.distribution) {
                    this.valueType = "Distribution";
                }
                else {
                    this.valueType = "Range";
                }
            }
            else {
                this.value = this.item;
            }
        }
    };
    TemplateValue.prototype.updateType = function (type) {
        this.valueType = type;
        if (type == "Value") {
            this.item = this.value;
        }
        else {
            this.item = this.valueSet;
            this.valueSet.distribution = (this.valueType == 'Distribution') ? "Normal" : undefined;
        }
        this.updated.emit(this.item);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TemplateValue.prototype, "item", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TemplateValue.prototype, "updated", void 0);
    TemplateValue = __decorate([
        core_1.Component({
            "inputs": ["caption", "item", "min", "max", "step"],
            "selector": "template-value",
            "template": "\n      <div class=\"input-control\">\n        <label for=\"caption\">{{caption}}:</label>\n        \n        <div class=\"btn-group\" style=\"float: left;\">\n          <button type=\"button\" class=\"btn btn-default btn-icon\" \n            [ngClass]=\"{'active': valueType == 'Value'}\" (click)=\"updateType('Value')\">\n            <span class=\"glyphicon glyphicon-th\"></span>\n          </button>\n          <button type=\"button\" class=\"btn btn-default btn-icon\" \n            [ngClass]=\"{'active': valueType == 'Range'}\" (click)=\"updateType('Range')\">\n            <span class=\"glyphicon glyphicon-transfer\"></span>\n          </button>\n          <button type=\"button\" class=\"btn btn-default btn-icon\" \n            [ngClass]=\"{'active': valueType == 'Distribution'}\" (click)=\"updateType('Distribution')\">\n            <span class=\"glyphicon glyphicon-random\"></span>\n          </button>\n        </div>\n        \n        <input *ngIf=\"valueType == 'Value'\" \n          type=\"number\" class=\"form-control\" \n           [min] =\"min? min: 0\" \n           [max] =\"max? max: 10\" \n           [step]=\"step? step: 1\" \n           [(ngModel)]=\"value\" \n           (ngModelChange)=\"updated.emit(value)\"/>\n        \n        <fieldset *ngIf=\"(valueType == 'Range') || (valueType == 'Distribution')\">\n          <!--Min--> \n          <div class=\"input-control\">\n            <label for=\"min\">Min: </label>\n            <input type=\"number\" class=\"form-control\" \n              [min] =\"min? min: 0\" \n              [max] =\"max? max: 10\" \n              [step]=\"step? step: 1\" \n              [(ngModel)]=\"valueSet.min\"\n              (ngModelChange)=\"updated.emit(valueSet)\">\n          </div>\n          <!--Max-->\n          <div class=\"input-control\">\n            <label for=\"max\">Max: </label>\n            <input type=\"number\" class=\"form-control\" \n              [min] =\"min? min: 0\" \n              [max] =\"max? max: 10\" \n              [step]=\"step? step: 1\" \n              [(ngModel)]=\"valueSet.max\"\n              (ngModelChange)=\"updated.emit(valueSet)\">\n          </div>\n          <div *ngIf=\"valueType == 'Distribution'\">\n            <!--Mean-->\n            <div class=\"input-control\">\n              <label for=\"mean\">Mean: </label>\n              <input type=\"number\" class=\"form-control\" \n              [min] =\"min? min: 0\" \n              [max] =\"max? max: 10\" \n              [step]=\"step? step: 1\" \n              [(ngModel)]=\"valueSet.mean\"\n              (ngModelChange)=\"updated.emit(valueSet)\">\n            </div>\n            <!--Std-->\n            <div class=\"input-control\">\n              <label for=\"std\">Std: </label>\n              <input type=\"number\" class=\"form-control\" \n              [min] =\"min? min: 0\" \n              [max] =\"max? max: 10\" \n              [step]=\"step? step: 1\" \n              [(ngModel)]=\"valueSet.std\"\n              (ngModelChange)=\"updated.emit(valueSet)\">\n            </div>\n          </div>\n        </fieldset>\n        \n       </div>\n   ",
            "styles": ["input {width: 60px;}"],
            "directives": [toolbar_form_1.FormToolbar]
        }), 
        __metadata('design:paramtypes', [])
    ], TemplateValue);
    return TemplateValue;
}());
exports.TemplateValue = TemplateValue;
//# sourceMappingURL=component.templateValue.js.map