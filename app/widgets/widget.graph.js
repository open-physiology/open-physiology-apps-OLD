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
var utils_model_1 = require('../services/utils.model');
var toolbar_add_1 = require('../components/toolbar.add');
var GraphWidget = (function () {
    function GraphWidget(renderer, el, resizeService) {
        var _this = this;
        this.renderer = renderer;
        this.el = el;
        this.resizeService = resizeService;
        this.highlightedItemChange = new core_1.EventEmitter();
        this.activeItemChange = new core_1.EventEmitter();
        this.types = [
            utils_model_1.ResourceName.Material,
            utils_model_1.ResourceName.Lyph,
            utils_model_1.ResourceName.LyphWithAxis,
            utils_model_1.ResourceName.Process,
            utils_model_1.ResourceName.Measurable,
            utils_model_1.ResourceName.Causality,
            utils_model_1.ResourceName.Node,
            utils_model_1.ResourceName.OmegaTree,
            utils_model_1.ResourceName.CoalescenceScenario];
        this.vp = { size: { width: 600, height: 600 },
            margin: { x: 20, y: 20 },
            node: { size: { width: 40, height: 40 } } };
        this.rs = resizeService.resize$.subscribe(function (event) {
            if (event.target == "graph-widget") {
                _this.setPanelSize(event.size);
            }
        });
    }
    GraphWidget.prototype.onAdded = function (Class) {
        var options = {};
        if (Class == utils_model_1.ResourceName.LyphWithAxis) {
            Class = utils_model_1.ResourceName.Lyph;
            options.createAxis = true;
        }
        if (Class == utils_model_1.ResourceName.Lyph) {
            options.createRadialBorders = true;
        }
        var newItem = utils_model_1.model[Class].new({ name: "New " + Class }, options);
        var newType = utils_model_1.model.Type.new({ name: newItem.name, definition: newItem });
        newItem.p('name').subscribe(newType.p('name'));
        if (Class == utils_model_1.ResourceName.CoalescenceScenario) {
            var layer1 = utils_model_1.model.Lyph.new({ name: "Layer 1" });
            var layer2 = utils_model_1.model.Lyph.new({ name: "Layer 2" });
            var layer3 = utils_model_1.model.Lyph.new({ name: "Layer 3" });
            var lyph1 = utils_model_1.model.Lyph.new({ name: "Lyph 1", layers: [layer1, layer2] }, { createAxis: true, createRadialBorders: true });
            var lyph2 = utils_model_1.model.Lyph.new({ name: "Lyph 2", layers: [layer3, layer2] }, { createAxis: true, createRadialBorders: true });
            newItem.lyphs = [lyph1, lyph2];
        }
        //Create template of given class
        //Create the type for it and attach to the template
        this.activeItemChange.emit(newItem);
        //this.activeItem = newItem;
        //this.createElement();
    };
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
    GraphWidget.prototype.getClassLabel = function (option) {
        if (!option)
            return "";
        var label = option;
        label = label.replace(/([a-z])([A-Z])/g, '$1 $2');
        label = label[0].toUpperCase() + label.substring(1).toLowerCase();
        return label;
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
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GraphWidget.prototype, "activeItemChange", void 0);
    GraphWidget = __decorate([
        core_1.Component({
            selector: 'graph-widget',
            inputs: ['activeItem', 'highlightedItem'],
            template: "\n     <div class=\"panel panel-success\">\n       <div class=\"panel-body\" style=\"position: relative\">\n          <add-toolbar [options]=\"types\" style=\"position: absolute;\" [transform]=\"getClassLabel\" (added)=\"onAdded($event)\"></add-toolbar>\n          <svg id=\"graphSvg\" class=\"svg-widget\"></svg>\n       </div>\n    </div> \n  ",
            directives: [toolbar_add_1.AddToolbar]
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, service_resize_1.ResizeService])
    ], GraphWidget);
    return GraphWidget;
}());
exports.GraphWidget = GraphWidget;
//# sourceMappingURL=widget.graph.js.map