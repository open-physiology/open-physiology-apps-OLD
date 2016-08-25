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
 * Created by Natallia on 7/24/2016.
 */
/**
 * Created by Natallia on 7/7/2016.
 */
var core_1 = require('@angular/core');
var DynamicLoader = (function () {
    function DynamicLoader(resolver) {
        this.resolver = resolver;
        this.isViewInitialized = false;
    }
    DynamicLoader.prototype.updateComponent = function () {
        var _this = this;
        if (!this.isViewInitialized) {
            return;
        }
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
        this.resolver.resolveComponent(this.type).then(function (factory) {
            _this.cmpRef = _this.target.createComponent(factory);
            _this.cmpRef.instance.input = _this.input;
        });
    };
    DynamicLoader.prototype.ngOnChanges = function () {
        this.updateComponent();
    };
    DynamicLoader.prototype.ngAfterViewInit = function () {
        this.isViewInitialized = true;
        this.updateComponent();
    };
    DynamicLoader.prototype.ngOnDestroy = function () {
        if (this.cmpRef) {
            this.cmpRef.destroy();
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DynamicLoader.prototype, "target", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DynamicLoader.prototype, "type", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DynamicLoader.prototype, "input", void 0);
    DynamicLoader = __decorate([
        core_1.Directive({
            selector: '[dcl-wrapper]'
        }), 
        __metadata('design:paramtypes', [core_1.ComponentResolver])
    ], DynamicLoader);
    return DynamicLoader;
}());
exports.DynamicLoader = DynamicLoader;
//# sourceMappingURL=directive.dynamicLoader.js.map