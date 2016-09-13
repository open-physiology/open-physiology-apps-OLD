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
var common_1 = require('@angular/common');
var dropdown_1 = require('ng2-bootstrap/components/dropdown');
var AddToolbar = (function () {
    function AddToolbar() {
        this.added = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AddToolbar.prototype, "added", void 0);
    AddToolbar = __decorate([
        core_1.Component({
            selector: 'add-toolbar',
            inputs: ['options', 'transform'],
            template: "\n      <div *ngIf=\"options && (options.length > 1)\" class=\"btn-group\" dropdown>\n        <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" aria-label=\"Add\" dropdownToggle>\n          <span class=\"glyphicon glyphicon-plus\"></span>\n        </button>\n        <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"Add\">\n          <li *ngFor=\"let option of options; let i = index\" role=\"menuitem\" (click)=\"added.emit(option)\">\n            <a class=\"dropdown-item\" href=\"#\">{{transform? transform(option): option}}</a>\n          </li>\n        </ul>\n      </div>\n      <button *ngIf=\"options && (options.length == 1)\" \n        type=\"button\" class=\"btn btn-default btn-icon\" (click)=\"added.emit(options[0])\">\n        <span class=\"glyphicon glyphicon-plus\"></span>\n      </button>\n    ",
            directives: [dropdown_1.DROPDOWN_DIRECTIVES, common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], AddToolbar);
    return AddToolbar;
}());
exports.AddToolbar = AddToolbar;
//# sourceMappingURL=toolbar.add.js.map