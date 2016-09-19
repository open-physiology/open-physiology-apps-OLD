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
 * Created by Natallia on 7/14/2016.
 */
var core_1 = require('@angular/core');
var service_resize_1 = require('../services/service.resize');
var lyph_edit_widget_1 = require("lyph-edit-widget");
var LyphWidget = (function () {
    function LyphWidget(renderer, el, resizeService) {
        var _this = this;
        this.renderer = renderer;
        this.el = el;
        this.resizeService = resizeService;
        this.vp = { size: { width: 600, height: 300 },
            margin: { x: 20, y: 20 },
            node: { size: { width: 40, height: 40 } } };
        this.subscription = resizeService.resize$.subscribe(function (event) {
            if (event.target == "lyph") {
                _this.setPanelSize(event.size);
            }
        });
    }
    LyphWidget.prototype.setPanelSize = function (size) {
        var delta = 10;
        if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)) {
            this.vp.size = { width: size.width, height: size.height - 40 };
            if (this.svg && this.model) {
                this.model.width = this.vp.size.width;
                this.model.height = this.vp.size.height;
            }
        }
    };
    LyphWidget.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    LyphWidget.prototype.ngOnChanges = function (changes) {
        this.svg = $('#lyphSvg');
        if (!this.root)
            this.root = new lyph_edit_widget_1.Canvas({ element: this.svg });
        if (this.item) {
            this.model = new lyph_edit_widget_1.LyphRectangle({
                model: this.item,
                x: this.vp.margin.x, y: this.vp.margin.y,
                width: this.vp.size.width - 2 * this.vp.margin.x, height: this.vp.size.height - 2 * this.vp.margin.y });
            this.model.parent = this.root;
            this.svg.append(this.model.element);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LyphWidget.prototype, "item", void 0);
    LyphWidget = __decorate([
        core_1.Component({
            selector: 'lyph',
            inputs: ['item'],
            template: "\n     <div class=\"panel-body\">\n       <svg id=\"lyphSvg\" class=\"svg-widget\"></svg>\n     </div>\n  ",
            directives: []
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, service_resize_1.ResizeService])
    ], LyphWidget);
    return LyphWidget;
}());
exports.LyphWidget = LyphWidget;
//# sourceMappingURL=view.lyph.js.map