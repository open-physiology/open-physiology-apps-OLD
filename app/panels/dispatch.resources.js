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
var panel_resource_1 = require('./panel.resource');
var panel_externalResource_1 = require('./panel.externalResource');
var panel_material_1 = require('./panel.material');
var panel_lyph_1 = require('./panel.lyph');
var panel_causality_1 = require('./panel.causality');
var panel_process_1 = require('./panel.process');
var panel_node_1 = require('./panel.node');
var panel_border_1 = require('./panel.border');
var panel_measurable_1 = require('./panel.measurable');
var panel_correlation_1 = require('./panel.correlation');
var panel_coalescence_1 = require('./panel.coalescence');
var panel_coalescenceScenario_1 = require('./panel.coalescenceScenario');
var panel_group_1 = require('./panel.group');
var panel_omegaTree_1 = require('./panel.omegaTree');
var panel_type_1 = require('./panel.type');
var utils_model_1 = require("../services/utils.model");
var ng2_toasty_1 = require('ng2-toasty/ng2-toasty');
var PanelDispatchResources = (function () {
    function PanelDispatchResources(toastyService) {
        this.toastyService = toastyService;
        this.saved = new core_1.EventEmitter();
        this.removed = new core_1.EventEmitter();
        this.canceled = new core_1.EventEmitter();
        this.highlightedItemChange = new core_1.EventEmitter();
        this.ResourceName = utils_model_1.ResourceName;
        this.isType = false;
    }
    PanelDispatchResources.prototype.ngOnInit = function () {
        if (this.item) {
            if (this.item.class.indexOf('Type') > -1)
                this.isType = true;
        }
    };
    PanelDispatchResources.prototype.onSaved = function (event) {
        var _this = this;
        this.item.commit()
            .catch(function (reason) {
            var errorMsg = "Failed to commit resource: Relationship constraints violated! \n" +
                "See browser console (Ctrl+Shift+J) for technical details.";
            console.error(reason);
            _this.toastyService.error(errorMsg);
        });
        //create type
        if (event.createType) {
            var template_1 = this.item;
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    var newType = utils_model_1.model.Type.new({ definition: template_1 });
                    template_1.p('name').subscribe(newType.p('name'));
                    yield newType.commit();
                    //TODO: create only if types does not exist
                    var type = template_1['-->DefinesType'][2];
                    console.log("MY TYPE", type);
                });
            })();
        }
        this.saved.emit(this.item);
    };
    PanelDispatchResources.prototype.onCanceled = function () {
        this.item.rollback();
        //this.canceled.emit(this.item);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PanelDispatchResources.prototype, "item", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PanelDispatchResources.prototype, "ignore", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PanelDispatchResources.prototype, "options", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PanelDispatchResources.prototype, "saved", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PanelDispatchResources.prototype, "removed", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PanelDispatchResources.prototype, "canceled", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], PanelDispatchResources.prototype, "highlightedItemChange", void 0);
    PanelDispatchResources = __decorate([
        core_1.Component({
            selector: 'panel-general',
            inputs: ['item', 'ignore', 'options'],
            providers: [ng2_toasty_1.ToastyService],
            template: "\n    <!--External resources-->\n    <externalResource-panel *ngIf=\"item.class == ResourceName.ExternalResource\"\n     [item]=\"item\" [ignore]=\"ignore\" [options]=\"options\" \n     (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></externalResource-panel>\n\n    <!--Materials-->\n    <material-panel *ngIf=\"item.class==ResourceName.Material\"\n     [item]=\"item\" [ignore]=\"ignore\" [options]=\"options\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></material-panel>\n    \n     <!--Lyphs-->      \n    <lyph-panel *ngIf=\"item.class==ResourceName.Lyph\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></lyph-panel>\n\n    <!--Processes-->      \n    <process-panel *ngIf=\"item.class==ResourceName.Process\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></process-panel>\n   \n    <!--Mesurables-->\n    <measurable-panel *ngIf=\"item.class==ResourceName.Measurable\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></measurable-panel>\n   \n    <!--Causalities-->\n    <causality-panel *ngIf=\"item.class==ResourceName.Causality\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></causality-panel>\n    \n    <!--Nodes-->\n    <node-panel *ngIf=\"item.class==ResourceName.Node\" [ignore]=\"ignore\" [options]=\"options\" \n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></node-panel>\n\n    <!--Borders-->\n    <border-panel *ngIf=\"item.class==ResourceName.Border\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></border-panel>\n    \n    <!--Groups-->\n    <group-panel *ngIf=\"item.class==ResourceName.Group\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></group-panel>\n\n    <!--Omega trees-->\n    <omegaTree-panel *ngIf=\"item.class==ResourceName.OmegaTree\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></omegaTree-panel>\n\n     <!--Publications: generic panel-->\n     <resource-panel *ngIf=\"item.class==ResourceName.Publication\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></resource-panel>\n\n     <!--Correlations-->\n     <correlation-panel *ngIf=\"item.class==ResourceName.Correlation\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></correlation-panel>\n\n     <!--Clinical indices: generic panel-->\n     <resource-panel *ngIf=\"item.class==ResourceName.ClinicalIndex\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></resource-panel>  \n\n     <!--Coalescence-->\n     <coalescence-panel *ngIf=\"item.class==ResourceName.Coalescence\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></coalescence-panel>\n\n     <!--CoalescenceScenario-->\n     <coalescenceScenario-panel *ngIf=\"item.class==ResourceName.CoalescenceScenario\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></coalescenceScenario-panel>\n\n     <!--Type-->\n     <type-panel *ngIf=\"isType\" [ignore]=\"ignore\" [options]=\"options\"\n     [item]=\"item\" (saved)=\"onSaved($event)\" (canceled)=\"onCanceled($event)\" (removed)=\"removed.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></type-panel>\n     \n     <ng2-toasty></ng2-toasty>\n  ",
            directives: [
                panel_resource_1.ResourcePanel, panel_externalResource_1.ExternalResourcePanel,
                panel_material_1.MaterialPanel,
                panel_lyph_1.LyphPanel,
                panel_measurable_1.MeasurablePanel,
                panel_process_1.ProcessPanel,
                panel_causality_1.CausalityPanel, panel_node_1.NodePanel, panel_border_1.BorderPanel,
                panel_correlation_1.CorrelationPanel, panel_coalescence_1.CoalescencePanel, panel_coalescenceScenario_1.CoalescenceScenarioPanel,
                panel_group_1.GroupPanel, panel_omegaTree_1.OmegaTreePanel, panel_type_1.TypePanel,
                ng2_toasty_1.Toasty
            ]
        }), 
        __metadata('design:paramtypes', [ng2_toasty_1.ToastyService])
    ], PanelDispatchResources);
    return PanelDispatchResources;
}());
exports.PanelDispatchResources = PanelDispatchResources;
//# sourceMappingURL=dispatch.resources.js.map