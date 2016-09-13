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
var widget_relations_1 = require('../widgets/widget.relations');
var widget_resource_1 = require('../widgets/widget.resource');
var service_resize_1 = require('../services/service.resize');
var pipe_general_1 = require("../transformations/pipe.general");
var utils_model_1 = require("../services/utils.model");
var service_highlight_1 = require("../services/service.highlight");
require('rxjs/add/operator/map');
var ResourceEditor = (function () {
    function ResourceEditor(resizeService, highlightService, el) {
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
                            type: 'column',
                            content: [
                                {
                                    type: 'component',
                                    componentName: 'HierarchyPanel'
                                },
                                {
                                    type: 'component',
                                    componentName: 'ResourcePanel'
                                }
                            ],
                            width: 50
                        }
                    ]
                }]
        };
        this.rs = utils_model_1.model.Resource.p('all').subscribe(function (data) {
            _this.items = data;
        });
        var self = this;
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                /*Lyphs*/
                var renalH = utils_model_1.model.Lyph.new({ name: "Renal hilum" });
                var renalP = utils_model_1.model.Lyph.new({ name: "Renal parenchyma" });
                var renalC = utils_model_1.model.Lyph.new({ name: "Renal capsule" });
                var cLyphsGroup = [renalH, renalP, renalC];
                //await Promise.all(cLyphsGroup.map(p => p.commit()));
                var kidney = utils_model_1.model.Lyph.new({ name: "Kidney", layers: cLyphsGroup });
                //await kidney.commit();
                var layers = Array.from(kidney.layers);
                var parts = Array.from(kidney.parts);
                kidney.p('measurables').subscribe(function (x) {
                    var measurablesP = Array.from(x);
                });
                var measurable1 = utils_model_1.model.Measurable.new({ name: "Measurable 1" });
                kidney.measurables = [measurable1];
                var measurable2 = utils_model_1.model.Measurable.new({ name: "Measurable 2" });
                kidney.measurables.add(measurable2);
                //let kidneyLobus = model.Lyph.new({name: "Kidney lobus"});
                //await kidneyLobus.commit();
            });
        })();
    }
    ResourceEditor.prototype.ngOnDestroy = function () {
        this.rs.unsubscribe();
    };
    ResourceEditor.prototype.onItemSelected = function (item) {
        var _this = this;
        setTimeout(function () {
            _this.selectedItem = null;
        }, 0);
        setTimeout(function () {
            _this.selectedItem = item;
        }, 0);
    };
    ResourceEditor.prototype.ngOnInit = function () {
        var self = this;
        var main = $('app > #main');
        this.mainLayout = new GoldenLayout(this.layoutConfig, main);
        this.mainLayout.registerComponent('RepoPanel', function (container, componentState) {
            var panel = container.getElement();
            var content = $('app > #repo');
            content.detach().appendTo(panel);
        });
        this.mainLayout.registerComponent('HierarchyPanel', function (container, componentState) {
            var panel = container.getElement();
            var component = $('app > #hierarchy');
            component.detach().appendTo(panel);
            //Notify components about window resize
            container.on('open', function () {
                var size = { width: container.width, height: container.height };
                self.resizeService.announceResize({ target: "hierarchy-widget", size: size });
            });
            container.on('resize', function () {
                var size = { width: container.width, height: container.height };
                self.resizeService.announceResize({ target: "hierarchy-widget", size: size });
            });
        });
        this.mainLayout.registerComponent('ResourcePanel', function (container, componentState) {
            var panel = container.getElement();
            var component = $('app > #resource');
            component.detach().appendTo(panel);
            //Notify components about window resize
            container.on('open', function () {
                var size = { width: container.width, height: container.height };
                self.resizeService.announceResize({ target: "resource-widget", size: size });
            });
            container.on('resize', function () {
                var size = { width: container.width, height: container.height };
                self.resizeService.announceResize({ target: "resource-widget", size: size });
            });
        });
        this.mainLayout.init();
    };
    ResourceEditor = __decorate([
        core_1.Component({
            selector: 'app',
            providers: [service_resize_1.ResizeService, service_highlight_1.HighlightService],
            template: "\n    <repo-general id=\"repo\"\n      [items]=\"items | setToArray | hideClass : ['Border']\" \n      [caption]=\"'Resources'\" \n      (selectedItemChange)=\"onItemSelected($event)\">\n    </repo-general>\n    <hierarchy-widget id = \"hierarchy\" [item]=\"selectedItem\"></hierarchy-widget>\n    <resource-widget id = \"resource\" [item]=\"selectedItem\"></resource-widget>   \n    <div id=\"main\"></div>\n  ",
            styles: ["#main {width: 100%; height: 100%; border: 0; margin: 0; padding: 0}"],
            directives: [repo_general_1.RepoGeneral, repo_nested_1.RepoNested, widget_relations_1.RelationshipWidget, widget_resource_1.ResourceWidget],
            pipes: [pipe_general_1.SetToArray, pipe_general_1.HideClass]
        }), 
        __metadata('design:paramtypes', [service_resize_1.ResizeService, service_highlight_1.HighlightService, core_1.ElementRef])
    ], ResourceEditor);
    return ResourceEditor;
}());
exports.ResourceEditor = ResourceEditor;
//# sourceMappingURL=editor.resources.js.map