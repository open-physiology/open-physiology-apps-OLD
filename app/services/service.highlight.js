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
var HighlightService = (function () {
    function HighlightService() {
        this.highlightedItemChanged$ = new core_1.EventEmitter();
    }
    HighlightService.prototype.highlight = function (item) {
        this.highlightedItemChanged$.emit(item);
    };
    HighlightService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], HighlightService);
    return HighlightService;
}());
exports.HighlightService = HighlightService;
//# sourceMappingURL=service.highlight.js.map