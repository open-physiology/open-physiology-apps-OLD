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
 * Created by Natallia on 7/28/2016.
 */
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var dropdown_1 = require('ng2-bootstrap/components/dropdown');
var FilterToolbar = (function () {
    function FilterToolbar() {
        this.applied = new core_1.EventEmitter();
    }
    FilterToolbar.prototype.ngOnInit = function () {
        if (this.options && (this.options.length > 0))
            this.mode = this.options[0];
    };
    FilterToolbar.prototype.updateMode = function (option) {
        this.mode = option;
        this.applied.emit({ filter: this.filter, mode: this.mode });
    };
    FilterToolbar.prototype.updateValue = function (event) {
        this.filter = event.target.value;
        //Remove filter if search string is empty
        if (this.filter.trim().length == 0)
            this.applied.emit({ filter: this.filter, mode: this.mode });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], FilterToolbar.prototype, "applied", void 0);
    FilterToolbar = __decorate([
        core_1.Component({
            selector: 'filter-toolbar',
            inputs: ['filter', 'options'],
            template: "\n      <div class=\"input-group input-group-sm\" style=\"width: 220px;\">\n        <input type=\"text\" class=\"form-control\" \n        [value]=\"filter\" (input)=\"updateValue($event)\" (keyup.enter)=\"applied.emit({filter: filter, mode: mode});\"/>\n        <div class=\"input-group-btn\" dropdown>\n          <button type=\"button\" class=\"btn btn-secondary dropdown-toggle\" aria-label=\"Filter\" dropdownToggle\n            aria-haspopup=\"true\" aria-expanded=\"false\">\n             <span class=\"glyphicon glyphicon-filter\" aria-hidden=\"true\"></span>\n          </button>\n          <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\" aria-labelledby=\"Filter\">\n            <li *ngFor=\"let option of options; let i = index\" (click)=\"updateMode(option)\">\n              <a class=\"dropdown-item\" href=\"#\"> <span *ngIf=\"mode == option\">&#10004;</span>{{option}}</a>\n            </li>            \n          </ul>\n        </div>\n      </div>\n    ",
            styles: [':host {float: right;}'],
            directives: [dropdown_1.DROPDOWN_DIRECTIVES, common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], FilterToolbar);
    return FilterToolbar;
}());
exports.FilterToolbar = FilterToolbar;
//# sourceMappingURL=toolbar.filter.js.map