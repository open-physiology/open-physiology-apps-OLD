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
var GraphWidget = (function () {
    function GraphWidget(renderer, el, resizeService) {
        var _this = this;
        this.renderer = renderer;
        this.el = el;
        this.resizeService = resizeService;
        this.highlightedItemChange = new core_1.EventEmitter();
        this.vp = { size: { width: 600, height: 600 },
            margin: { x: 20, y: 20 },
            node: { size: { width: 40, height: 40 } } };
        this.rs = resizeService.resize$.subscribe(function (event) {
            if (event.target == "graph-widget") {
                _this.setPanelSize(event.size);
            }
        });
    }
    GraphWidget.prototype.setPanelSize = function (size) {
        var delta = 10;
        if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)) {
            this.vp.size = { width: size.width, height: size.height - 40 };
            if (this.svg) { }
        }
    };
    GraphWidget.prototype.ngOnInit = function () { };
    GraphWidget.prototype.ngOnDestroy = function () {
        if (this.rs)
            this.rs.unsubscribe();
    };
    GraphWidget.prototype.ngOnChanges = function (changes) {
        if (changes['activeItem']) {
            if (this.activeItem)
                this.createElement();
        }
    };
    GraphWidget.prototype.createElement = function () {
        this.createCanvas();
        this.drawingTool.model = this.activeItem;
        /*
        //Creating elements for active item
        if (this.elementExists(this.activeItem)) return;
    
        if (this.activeItem.class == ResourceName.Lyph){
          let element = new LyphRectangle({
            model:  this.activeItem, x: 100, y: 100, width: 200, height: 150
          });
          element.parent = this.root;
        }
        if (this.activeItem.class == ResourceName.Process){
          let element = new ProcessLine({model:  this.activeItem});
          element.parent = this.root;
        }
        */
    };
    GraphWidget.prototype.elementExists = function (model) {
        if (this.root && this.root.children) {
            for (var _i = 0, _a = this.root.children; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x.model == model)
                    return true;
            }
        }
        return false;
    };
    GraphWidget.prototype.createCanvas = function () {
        var _this = this;
        if (!this.root) {
            this.svg = $('#graphSvg');
            this.root = new lyph_edit_widget_1.Canvas({ element: this.svg });
            new lyph_edit_widget_1.SelectTool(this.root.context);
            new lyph_edit_widget_1.DragDropTool(this.root.context);
            new lyph_edit_widget_1.ResizeTool(this.root.context);
            new lyph_edit_widget_1.ZoomTool(this.root.context);
            new lyph_edit_widget_1.PanTool(this.root.context);
            new lyph_edit_widget_1.BorderToggleTool(this.root.context);
            this.drawingTool = new lyph_edit_widget_1.DrawingTool(this.root.context);
            this.root.context.p('selected').subscribe(function (x) {
                if (x)
                    _this.highlightedItemChange.emit(x.model);
            });
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GraphWidget.prototype, "activeItem", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], GraphWidget.prototype, "highlightedItem", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GraphWidget.prototype, "highlightedItemChange", void 0);
    GraphWidget = __decorate([
        core_1.Component({
            selector: 'graph-widget',
            inputs: ['activeItem', 'highlightedItem'],
            template: "\n     <div class=\"panel panel-success\">\n     <div class=\"panel-heading\">Graph editor</div>\n       <div class=\"panel-body\" style=\"position: relative\">\n          <svg id=\"graphSvg\" class=\"svg-widget\"></svg>\n       </div>\n    </div> \n  "
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, service_resize_1.ResizeService])
    ], GraphWidget);
    return GraphWidget;
}());
exports.GraphWidget = GraphWidget;
//# sourceMappingURL=widget.graph.js.map