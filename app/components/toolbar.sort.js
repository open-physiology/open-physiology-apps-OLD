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
 * Created by Natallia on 7/29/2016.
 */
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var dropdown_1 = require('ng2-bootstrap/components/dropdown');
var SortToolbar = (function () {
    function SortToolbar() {
        this.sortByMode = "unsorted";
        this.sorted = new core_1.EventEmitter();
    }
    SortToolbar.prototype.onClick = function (item) {
        this.sortByMode = item;
        this.sorted.emit(item);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SortToolbar.prototype, "sorted", void 0);
    SortToolbar = __decorate([
        core_1.Component({
            selector: 'sort-toolbar',
            inputs: ['options'],
            template: "\n      <div class=\"btn-group\" dropdown>\n        <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" aria-label=\"SortAsc\" dropdownToggle>\n          <span class=\"glyphicon glyphicon-sort-by-attributes\" aria-hidden=\"true\"></span>\n        </button>\n        <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"SortAsc\">\n          <li role=\"menuitem\" (click)=\"onClick('unsorted')\">\n            <a class=\"dropdown-item\" href=\"#\">\n            <span *ngIf=\"sortByMode == 'unsorted'\">&#10004;</span>\n            (unsorted)</a>\n          </li>\n          <li class=\"divider\"></li>\n          <li *ngFor=\"let option of options; let i = index\" role=\"menuitem\" (click)=\"onClick(option)\">\n            <a class=\"dropdown-item\" href=\"#\">\n              <span *ngIf=\"sortByMode == option\">&#10004;</span>\n              {{option}}\n            </a>\n          </li>\n        </ul>\n      </div>\n      <div class=\"btn-group\" dropdown>\n        <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" aria-label=\"SortDesc\" dropdownToggle>\n          <span class=\"glyphicon glyphicon-sort-by-attributes-alt\" aria-hidden=\"true\"></span>\n        </button>\n        <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"SortDesc\">\n          <li *ngFor=\"let option of options; let i = index\" role=\"menuitem\" (click)=\"onClick('-'+option)\">\n            <a class=\"dropdown-item\" href=\"#\">\n             <span *ngIf=\"sortByMode == '-'+option\">&#10004;</span>\n             {{option}}\n            </a>\n          </li>\n        </ul>\n      </div>\n    ",
            directives: [dropdown_1.DROPDOWN_DIRECTIVES, common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], SortToolbar);
    return SortToolbar;
}());
exports.SortToolbar = SortToolbar;
//# sourceMappingURL=toolbar.sort.js.map