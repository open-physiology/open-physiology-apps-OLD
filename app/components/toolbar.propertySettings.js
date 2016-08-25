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
 * Created by Natallia on 6/19/2016.
 */
var core_1 = require('@angular/core');
var ng2_dropdown_1 = require("ng2-dropdown");
var ng2_radio_group_1 = require("ng2-radio-group");
var directive_draggable_1 = require("../directives/directive.draggable");
var PropertyToolbar = (function () {
    function PropertyToolbar() {
        this.selectionChanged = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PropertyToolbar.prototype, "selectionChanged", void 0);
    PropertyToolbar = __decorate([
        core_1.Component({
            selector: 'property-toolbar',
            inputs: ['options', 'transform'],
            template: "\n    <div class=\"dropdown\" dropdown>\n      <button type=\"button\" class=\"btn btn-default btn-icon\"  dropdown-open>\n        <span class=\"glyphicon glyphicon-list\"></span>\n      </button>\n      <ul class=\"dropdown-menu dropdown-menu-right\" dropdown-not-closable-zone draggable>\n        <li *ngFor=\"let option of options\">\n          <a class=\"small\" href=\"#\"><input type=\"checkbox\"\n          [(ngModel)]=\"option.selected\" (ngModelChange)=\"selectionChanged.emit(option)\"/>&nbsp;\n          <span [style.color]=\"option.color\">{{transform? transform(option.value): option.value}}</span>\n          </a>\n        </li>\n      </ul>\n    </div>\n    ",
            styles: [':host {float: right;}'],
            directives: [ng2_dropdown_1.DROPDOWN_DIRECTIVES, ng2_radio_group_1.RADIO_GROUP_DIRECTIVES, directive_draggable_1.Draggable]
        }), 
        __metadata('design:paramtypes', [])
    ], PropertyToolbar);
    return PropertyToolbar;
}());
exports.PropertyToolbar = PropertyToolbar;
var CustomPropertyToolbar = (function () {
    function CustomPropertyToolbar() {
        this.selectionChanged = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], CustomPropertyToolbar.prototype, "selectionChanged", void 0);
    CustomPropertyToolbar = __decorate([
        core_1.Component({
            selector: 'custom-property-toolbar',
            inputs: ['options', 'caption'],
            template: "\n    <div class=\"dropdown\" dropdown>\n      <button type=\"button\" class=\"btn btn-default btn-icon\" dropdown-open>\n        {{caption}} <span class=\"caret\"></span>\n      </button>\n      <ul class=\"dropdown-menu\" dropdown-not-closable-zone>\n        <li *ngFor=\"let option of options; let i = index\">\n          <a class=\"small\" href=\"#\"><input type=\"checkbox\" \n          [(ngModel)]=\"option.selected\" (ngModelChange)=\"selectionChanged.emit(option)\"/>&nbsp;{{option.value}}</a>\n        </li>\n      </ul>\n    </div>\n    ",
            styles: [':host {float: left;}'],
            directives: [ng2_dropdown_1.DROPDOWN_DIRECTIVES, ng2_radio_group_1.RADIO_GROUP_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], CustomPropertyToolbar);
    return CustomPropertyToolbar;
}());
exports.CustomPropertyToolbar = CustomPropertyToolbar;
//# sourceMappingURL=toolbar.propertySettings.js.map