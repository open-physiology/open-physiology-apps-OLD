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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var core_1 = require('@angular/core');
var repo_general_1 = require('../repos/repo.general');
var repo_nested_1 = require('../repos/repo.nested');
var widget_graph_1 = require('../widgets/widget.graph');
var service_resize_1 = require('../services/service.resize');
var pipe_general_1 = require("../transformations/pipe.general");
var utils_model_1 = require("../services/utils.model");
var service_highlight_1 = require("../services/service.highlight");
require('rxjs/add/operator/map');
var GraphEditor = (function () {
    function GraphEditor(resizeService, highlightService, el) {
        var _this = this;
        this.resizeService = resizeService;
        this.highlightService = highlightService;
        this.el = el;
        this.layoutConfig = {
            settings: {
                hasHeaders: false,
                constrainDragToContainer: true,
                reorderEnabled: true,
                showMaximiseIcon: true,
                showCloseIcon: true,
                selectionEnabled: false,
                popoutWholeStack: false,
                showPopoutIcon: false
            },
            dimensions: {
                borderWidth: 2
            },
            content: [{
                    type: 'row',
                    content: [
                        {
                            type: 'component',
                            componentName: 'RepoPanel'
                        },
                        {
                            type: 'component',
                            componentName: 'GraphWidgetPanel'
                        }
                    ]
                }]
        };
        var self = this;
        this.rs = utils_model_1.model.Resource.p('all').subscribe(function (data) {
            _this.items = data;
        });
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                var vesselWall, bloodLayer, node1, node2;
                var bloodVessel = utils_model_1.model.Lyph.new({
                    name: 'Blood Vessel',
                    layers: [
                        vesselWall = utils_model_1.model.Lyph.new({ name: 'Vessel Wall' }, { createRadialBorders: true }),
                        bloodLayer = utils_model_1.model.Lyph.new({
                            name: 'Blood Layer',
                            parts: [
                                utils_model_1.model.Lyph.new({ name: 'Sublyph' }, { createAxis: true, createRadialBorders: true })
                            ]
                        }, { createRadialBorders: true })
                    ],
                    nodes: [node1 = utils_model_1.model.Node.new()]
                }, { createAxis: true, createRadialBorders: true });
                var brain = utils_model_1.model.Lyph.new({
                    name: 'Brain',
                    nodes: [
                        node2 = utils_model_1.model.Node.new()
                    ]
                }, { createAxis: true, createRadialBorders: true });
                var concentration = utils_model_1.model.Measurable.new({ name: "Concentration of water" });
                concentration.locations.add(brain);
                /*
                        let body = model.Lyph.new({name: "Body"});
                        let blood = model.Lyph.new({name: "Blood"});
                        let bloodType = model.Type.new({name: blood.name, definition: blood});
                        body.types.add(bloodType);
                        body.commit();
                */
            });
        })();
    }
    GraphEditor.prototype.ngOnDestroy = function () {
        if (this.rs)
            this.rs.unsubscribe();
    };
    GraphEditor.prototype.updateSelected = function (item) {
        var _this = this;
        setTimeout(function () {
            _this.selectedItem = null;
        }, 0);
        setTimeout(function () {
            _this.selectedItem = item;
        }, 0);
    };
    GraphEditor.prototype.updateActive = function (item) {
        this.activeItem = item;
    };
    //Repo -> widget
    GraphEditor.prototype.updateHighlightedRepo = function (item) {
        this.highlightedItem = item;
    };
    //Widget -> repo
    GraphEditor.prototype.updateHighlightedWidget = function (item) {
        if (this.highlightService) {
            this.highlightService.highlight(item);
        }
    };
    GraphEditor.prototype.ngOnInit = function () {
        var self = this;
        var main = $('app > #main');
        this.mainLayout = new GoldenLayout(this.layoutConfig, main);
        this.mainLayout.registerComponent('RepoPanel', function (container, componentState) {
            var panel = container.getElement();
            var content = $('app > #repo');
            content.detach().appendTo(panel);
        });
        this.mainLayout.registerComponent('GraphWidgetPanel', function (container, componentState) {
            var panel = container.getElement();
            var component = $('app > #graphWidget');
            component.detach().appendTo(panel);
            //Notify components about window resize
            container.on('open', function () {
                var size = { width: container.width, height: container.height };
                self.resizeService.announceResize({ target: "graph-widget", size: size });
            });
            container.on('resize', function () {
                var size = { width: container.width, height: container.height };
                self.resizeService.announceResize({ target: "graph-widget", size: size });
            });
        });
        this.mainLayout.init();
    };
    GraphEditor = __decorate([
        core_1.Component({
            selector: 'app',
            providers: [service_resize_1.ResizeService, service_highlight_1.HighlightService],
            template: "\n    <repo-general id=\"repo\"\n      [items]=\"items | setToArray\" \n      [caption]=\"'Resources'\" \n      [options]=\"{showActive: true}\"\n      (selectedItemChange)=\"updateSelected($event)\"\n      (activeItemChange)  =\"updateActive($event)\"  \n      (highlightedItemChange) = \"updateHighlightedRepo($event)\"\n      >\n    </repo-general>\n    <graph-widget id=\"graphWidget\" \n      [activeItem]=\"activeItem\" \n      [highlightedItem]=\"highlightedItem\" \n      (highlightedItemChange) = \"updateHighlightedWidget($event)\"\n    ></graph-widget>\n    <div id=\"main\"></div>\n  ",
            styles: ["#main {width: 100%; height: 100%; border: 0; margin: 0; padding: 0}"],
            directives: [repo_general_1.RepoGeneral, repo_nested_1.RepoNested, widget_graph_1.GraphWidget],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [service_resize_1.ResizeService, service_highlight_1.HighlightService, core_1.ElementRef])
    ], GraphEditor);
    return GraphEditor;
}());
exports.GraphEditor = GraphEditor;
//# sourceMappingURL=editor.graph.js.map