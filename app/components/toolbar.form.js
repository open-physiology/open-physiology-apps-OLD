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
var FormToolbar = (function () {
    function FormToolbar() {
        this.removed = new core_1.EventEmitter();
        this.canceled = new core_1.EventEmitter();
        this.saved = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], FormToolbar.prototype, "options", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], FormToolbar.prototype, "removed", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], FormToolbar.prototype, "canceled", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], FormToolbar.prototype, "saved", void 0);
    FormToolbar = __decorate([
        core_1.Component({
            selector: 'form-toolbar',
            inputs: ["options"],
            template: "\n    <button *ngIf=\"!(options && options.hideRemove)\"\n      type=\"button\" class=\"btn btn-default btn-icon\" aria-label=\"Remove\" (click)=\"removed.emit()\">\n      <span class=\"glyphicon glyphicon-remove\"></span>\n    </button>\n    <button *ngIf=\"!(options && options.hideSave)\" \n      type=\"button\" class=\"btn btn-default btn-icon\" aria-label=\"Save\" (click)=\"saved.emit()\">\n      <span class=\"glyphicon glyphicon-check\"></span>\n    </button>\n    <button \n      *ngIf=\"!(options && options.hideRestore)\" \n      type=\"button\" class=\"btn btn-default btn-icon\" aria-label=\"Restore\" (click)=\"canceled.emit()\">\n      <span class=\"glyphicon glyphicon-refresh\"></span>\n    </button>    \n  "
        }), 
        __metadata('design:paramtypes', [])
    ], FormToolbar);
    return FormToolbar;
}());
exports.FormToolbar = FormToolbar;
//# sourceMappingURL=toolbar.form.js.map