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
var utils_model_1 = require('../services/utils.model');
var pipe_general_1 = require("../transformations/pipe.general");
var utils_model_2 = require("../services/utils.model");
var service_highlight_1 = require("../services/service.highlight");
var OmegaTreeEditor = (function () {
    function OmegaTreeEditor(resizeService, highlightService, el) {
        var _this = this;
        this.resizeService = resizeService;
        this.highlightService = highlightService;
        this.el = el;
        this.ResourceName = utils_model_1.ResourceName;
        this.trees = [];
        this.lyphs = [];
        this.selectedItem = {};
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
                            type: 'column',
                            content: [
                                {
                                    type: 'component',
                                    componentName: 'OmegaTreePanel'
                                },
                                {
                                    type: 'component',
                                    componentName: 'LyphPanel'
                                }
                            ]
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
                            ]
                        }
                    ]
                }]
        };
        this.sLyphs = utils_model_2.model.Lyph.p('all').subscribe(function (data) { _this.lyphs = data; });
        this.sOmegaTrees = utils_model_2.model.OmegaTree.p('all').subscribe(function (data) { _this.trees = data; });
        var self = this;
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                /*External resources*/
                var fma7203 = utils_model_2.model.ExternalResource.new({ name: "FMA:7203", uri: "" });
                var fma15610 = utils_model_2.model.ExternalResource.new({ name: "FMA:15610", uri: "" });
                var fma66610 = utils_model_2.model.ExternalResource.new({ name: "FMA:66610", uri: "" });
                var fma17881 = utils_model_2.model.ExternalResource.new({ name: "FMA:17881", uri: "" });
                var externals = [fma7203, fma15610, fma66610, fma17881];
                yield Promise.all(externals.map(function (p) { return p.commit(); }));
                /*Lyphs*/
                var renalH = utils_model_2.model.Lyph.new({ name: "Renal hilum", externals: [fma15610] });
                var renalP = utils_model_2.model.Lyph.new({ name: "Renal parenchyma" });
                var renalC = utils_model_2.model.Lyph.new({ name: "Renal capsule", externals: [fma66610] });
                var cLyphsGroup = [renalH, renalP, renalC];
                yield Promise.all(cLyphsGroup.map(function (p) { return p.commit(); }));
                var kidney = utils_model_2.model.Lyph.new({ name: "Kidney", externals: [fma7203] });
                yield kidney.commit();
                var kidneyLobus = utils_model_2.model.Lyph.new({ name: "Kidney lobus", externals: [fma17881] });
                yield kidneyLobus.commit();
                self.selectedItem = kidney;
            });
        })();
    }
    OmegaTreeEditor.prototype.ngOnDestroy = function () {
        this.sLyphs.unsubscribe();
        this.sOmegaTrees.unsubscribe();
    };
    OmegaTreeEditor.prototype.onItemSelected = function (item) {
        var _this = this;
        setTimeout(function () { _this.selectedItem = null; }, 0);
        setTimeout(function () { _this.selectedItem = item; }, 0);
    };
    OmegaTreeEditor.prototype.ngOnInit = function () {
        var self = this;
        var main = $('app > #main');
        this.mainLayout = new GoldenLayout(this.layoutConfig, main);
        this.mainLayout.registerComponent('OmegaTreePanel', function (container, componentState) {
            var panel = container.getElement();
            var content = $('app > #omegaTreeRepo');
            content.detach().appendTo(panel);
        });
        this.mainLayout.registerComponent('LyphPanel', function (container, componentState) {
            var panel = container.getElement();
            var content = $('app > #lyphRepo');
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
        this.mainLayout.registerComponent('Repo2Panel', function (container, componentState) {
            var panel = container.getElement();
            var component = $('app > #repo2');
            component.detach().appendTo(panel);
        });
        this.mainLayout.init();
    };
    OmegaTreeEditor = __decorate([
        core_1.Component({
            selector: 'app',
            providers: [service_resize_1.ResizeService, service_highlight_1.HighlightService],
            template: "\n    <repo-general id=\"omegaTreeRepo\"\n      [items]=\"trees | setToArray\" \n      [caption]=\"'Omega trees'\"\n      [types]=\"[ResourceName.OmegaTree]\"\n      (selectedItemChange)=\"onItemSelected($event)\"\n      >\n    </repo-general>         \n    \n    <repo-general id=\"lyphRepo\"\n      [items]=\"lyphs | setToArray\" \n      [caption]=\"'Lyphs'\" \n      [types]=\"[ResourceName.Lyph]\"\n      (selected)=\"onItemSelected($event)\">\n    </repo-general>\n    \n    <hierarchy-widget id = \"hierarchy\" [item]=\"selectedItem\"></hierarchy-widget>\n    <resource-widget id = \"resource\" [item]=\"selectedItem\"></resource-widget>   \n    \n    <div id=\"main\"></div>\n  ",
            styles: ["#main {width: 100%; height: 100%; border: 0; margin: 0; padding: 0}"],
            directives: [repo_general_1.RepoGeneral, repo_nested_1.RepoNested, widget_relations_1.RelationshipWidget, widget_resource_1.ResourceWidget],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [service_resize_1.ResizeService, service_highlight_1.HighlightService, core_1.ElementRef])
    ], OmegaTreeEditor);
    return OmegaTreeEditor;
}());
exports.OmegaTreeEditor = OmegaTreeEditor;
//# sourceMappingURL=editor.omegaTrees.js.map