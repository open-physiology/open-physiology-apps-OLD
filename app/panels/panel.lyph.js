"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
 * Created by Natallia on 6/17/2016.
 */
var core_1 = require('@angular/core');
var panel_material_1 = require("./panel.material");
var component_select_1 = require('../components/component.select');
var repo_nested_1 = require('../repos/repo.nested');
var pipe_general_1 = require("../transformations/pipe.general");
var panel_border_1 = require("./panel.border");
var component_templateValue_1 = require('../components/component.templateValue');
var utils_model_1 = require("../services/utils.model");
var Measurable = utils_model_1.model.Measurable;
var LyphPanel = (function (_super) {
    __extends(LyphPanel, _super);
    function LyphPanel() {
        _super.apply(this, arguments);
        this.borderOptions = { 'readOnly': true, 'hideRemove': true, 'hideCreateType': true };
        this.layersIgnore = new Set();
        this.patchesIgnore = new Set();
        this.partsIgnore = new Set();
        this.segmentsIgnore = new Set();
        this.supertypeMeasurables = [];
        this.measurablesToReplicate = [];
    }
    LyphPanel.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.layersIgnore = new Set(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
        this.patchesIgnore = new Set(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
        this.partsIgnore = new Set(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
        this.segmentsIgnore = new Set(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
        /*  if (this.item){
              this.item.p('layers').subscribe(x => {
                console.log("Layers updated", x);
              });
              this.item.p('parts').subscribe(x => {
                console.log("Parts updated", x);
              })
            }*/
    };
    LyphPanel.prototype.generateMeasurables = function () {
        this.supertypeMeasurables = [];
        for (var _i = 0, _a = this.item.types; _i < _a.length; _i++) {
            var type = _a[_i];
            for (var _b = 0, _c = type.supertypes; _b < _c.length; _b++) {
                var supertype = _c[_b];
                if (supertype.measurables) {
                    var supertypeMeasurables = Array.from(new Set(supertype.measurables.map(function (item) { return item.type; })));
                    for (var _d = 0, supertypeMeasurables_1 = supertypeMeasurables; _d < supertypeMeasurables_1.length; _d++) {
                        var supertypeMeasurable = supertypeMeasurables_1[_d];
                        if (this.supertypeMeasurables.indexOf(supertypeMeasurable) < 0)
                            this.supertypeMeasurables.push(supertypeMeasurable);
                    }
                }
            }
        }
        console.log("Supertype measurables", this.supertypeMeasurables);
        this.measurablesToReplicate = Array.from(this.supertypeMeasurables);
        for (var _e = 0, _f = this.measurablesToReplicate; _e < _f.length; _e++) {
            var measurable = _f[_e];
            delete measurable["id"];
            var newMeasurable = Measurable.new(measurable);
            newMeasurable.locations.add(this.item);
        }
    };
    LyphPanel = __decorate([
        core_1.Component({
            selector: 'lyph-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <material-panel [item]=\"item\" \n        [ignore]  = \"ignore\"\n        [options] = \"options\"\n        (saved)   = \"saved.emit($event)\"\n        (canceled)= \"canceled.emit($event)\"\n        (removed) = \"removed.emit($event)\"\n        (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n        \n        <toolbar>\n          <button type=\"button\" class=\"btn btn-default btn-icon\" \n            (click)=\"generateMeasurables()\">\n            <span class=\"glyphicon glyphicon-cog\"></span>\n          </button>\n        </toolbar>\n        \n        <!--Thickness-->\n        <template-value *ngIf=\"includeProperty('thickness')\" \n          [caption]=\"getPropertyLabel('thickness')\" \n          [item]=\"item.thickness\"\n          (updated)=\"updateProperty('thickness', $event)\"\n        ></template-value>\n        \n        <!--Length-->\n        <template-value *ngIf=\"includeProperty('length')\" \n            [caption]=\"getPropertyLabel('length')\" \n            [item]=\"item.length\"\n            (updated)=\"updateProperty('length', $event)\">\n        </template-value>\n        \n        <!--Auxilliary field: measurables to generate-->\n        <!--TODO: replace with modal-->\n        <!--<generateFromSupertype>-->\n          <!--<div class=\"generate-control\">-->\n            <!--<label for=\"measurablesToReplicate\"><img class=\"icon\" src=\"images/measurable.png\"/> Measurables to generate </label>-->\n            <!--<select-input [items]=\"measurablesToReplicate\" -->\n              <!--(updated)=\"measurablesToReplicate = $event\"-->\n              <!--[options]=\"supertypeMeasurables\">-->\n            <!--</select-input>-->\n          <!--</div>-->\n        <!--</generateFromSupertype>-->\n        \n        <relationGroup>   \n          <!--Nodes-->\n          <div class=\"input-control\" *ngIf=\"includeProperty('nodes')\">\n            <repo-nested [caption]=\"getPropertyLabel('nodes')\" \n            [items]  = \"item.p('nodes') | async | setToArray\" \n            (updated) = \"updateProperty('nodes', $event)\"\n            [selectionOptions] = \"item.fields['nodes'].p('possibleValues') | async \"\n            [types]  = \"[ResourceName.Node]\"\n            (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div> \n        \n           <!--Measurables-->\n          <div class=\"input-control\" *ngIf=\"includeProperty('measurables')\">\n            <repo-nested [caption]=\"getPropertyLabel('measurables')\" \n            [items]  = \"item.p('measurables') | async | setToArray\" \n            (updated) = \"updateProperty('measurables', $event)\"\n            [selectionOptions] = \"item.fields['measurables'].p('possibleValues') | async\"\n            [types]  = \"[ResourceName.Measurable]\"\n            (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div> \n           \n          <!--Layers-->\n          <div class=\"input-control\" *ngIf=\"includeProperty('layers')\">\n            <repo-nested [caption]=\"getPropertyLabel('layers')\" \n            [items]  = \"item.p('layers') | async | setToArray\" \n            [ignore] = \"layersIgnore\"\n            [options]=\"{ordered: true}\"\n            (updated)= \"updateProperty('layers', $event)\" \n            [types]  = \"[item.class]\"\n            (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>     \n               \n          <!--Segments-->\n          <div class=\"input-control\" *ngIf=\"includeProperty('segments')\">\n            <repo-nested [caption]=\"getPropertyLabel('segments')\" \n            [items] = \"item.p('segments') | async | setToArray\" \n            [ignore]=\"segmentsIgnore\"\n            [options]=\"{ordered: true}\"\n            (updated)= \"updateProperty('segments', $event)\" \n            [types]=\"[item.class]\"\n            (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>     \n  \n          <!--Patches-->\n          <div class=\"input-control\" *ngIf=\"includeProperty('patches')\">\n            <repo-nested [caption]=\"getPropertyLabel('patches')\" \n            [items]  = \"item.p('patches') | async | setToArray\" \n            [ignore] = \"patchesIgnore\"\n            [types]  = \"[item.class]\"\n            (updated)= \"updateProperty('patches', $event)\" \n            (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>\n                  \n          <!--Parts-->\n          <div class=\"input-control\" *ngIf=\"includeProperty('parts')\">\n            <repo-nested [caption]=\"getPropertyLabel('parts')\" \n            [items]  = \"item.p('parts') | async | setToArray\" \n            [ignore] = \"partsIgnore\"\n            [types]  = \"[item.class]\"\n            (updated)= \"updateProperty('parts', $event)\" \n            (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>\n          \n          <!--Processes-->\n          <div class=\"input-control\" *ngIf=\"includeProperty('processes')\">\n            <repo-nested [caption]=\"getPropertyLabel('processes')\" \n             [items]  = \"item.p('processes') | async | setToArray\" \n             [types]  = \"[ResourceName.Process]\" \n             (updated)= \"updateProperty('processes', $event)\" \n             (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>\n          \n           <!--Coalescences-->\n           <div class=\"input-control\" *ngIf=\"includeProperty('coalescences')\">\n            <repo-nested [caption]=\"getPropertyLabel('coalescences')\" \n             [items]  = \"item.p('coalescences') | async | setToArray\" \n             [types]  = \"[ResourceName.Coalescence]\" \n             (updated) = \"updateProperty('coalescences', $event)\" \n             (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>\n            \n          <!--Incoming processes-->\n           <div class=\"input-control\" *ngIf=\"includeProperty('incomingProcesses')\">\n            <repo-nested [caption]=\"getPropertyLabel('incomingProcesses')\" \n             [items]  = \"item.p('incomingProcesses') | async | setToArray\" \n             [types]  = \"[ResourceName.Process]\" \n             (updated) = \"updateProperty('incomingProcesses', $event)\" \n             (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>\n          \n          <!--Outgoing processes-->\n           <div class=\"input-control\" *ngIf=\"includeProperty('outgoingProcesses')\">\n            <repo-nested [caption]=\"getPropertyLabel('outgoingProcesses')\" \n             [items]  = \"item.p('outgoingProcesses') | async | setToArray\" \n             [types]  = \"[ResourceName.Process]\" \n             (updated) = \"updateProperty('outgoingProcesses', $event)\" \n             (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>\n          \n          <ng-content select=\"relationGroup\"></ng-content>\n        </relationGroup>     \n        \n        <fieldset *ngIf=\"includeProperty('borders')\" >  \n          <legend>Borders</legend>\n          \n          <!--Axis-->\n          <div class=\"input-control\" *ngIf=\"item.axis\">      \n            <label for=\"axis\">{{getPropertyLabel('axis')}}: </label>\n            <border-panel [item]=\"item.p('axis') | async\" \n              [options]=\"borderOptions\"\n              (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\"\n              (saved)  = \"updateProperty('axis', $event)\">\n            </border-panel>\n          </div>              \n        \n          <!--RadialBorders-->        \n          <div class=\"input-control\" *ngIf=\"item.radialBorders\">      \n            <label for=\"radialBorders\">{{getPropertyLabel('radialBorders')}}: </label>\n             <repo-nested [caption]=\"getPropertyLabel('radialBorders')\" \n               [items]  = \"item.p('radialBorders') | async | setToArray\" \n               [types]  = \"[ResourceName.Border]\" \n               [options] = \"borderOptions\"\n               (updated) = \"updateProperty('radialBorders', $event)\"\n               (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>\n          \n          <!--LongitudinalBorders-->        \n          <div class=\"input-control\"  *ngIf=\"item.longitudinalBorders\">      \n            <label for=\"longitudinalBorders\">{{getPropertyLabel('longitudinalBorders')}}: </label>\n             <repo-nested [caption]=\"getPropertyLabel('longitudinalBorders')\" \n               [items]  = \"item.p('longitudinalBorders') | async | setToArray\" \n               [types]  = \"[ResourceName.Border]\" \n               [options] = \"borderOptions\"\n               (updated) = \"updateProperty('longitudinalBorders', $event)\"\n               (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n          </div>\n          \n          <ng-content select=\"borderGroup\"></ng-content>\n        </fieldset>\n        \n        <!--TreeParent-->\n        <div *ngIf=\"includeProperty('treeParent')\" class=\"input-control\">\n          <label for=\"treeParent\">{{getPropertyLabel('treeParent')}}: </label>\n          <select-input-1 [item] = \"item.p('treeParent') | async\"\n           (updated) = \"updateProperty('treeParent', $event)\"    \n           [options] = \"item.fields['treeParent'].p('possibleValues') | async\"></select-input-1>\n        </div>\n        \n        <!--TreeChildren-->\n        <div class=\"input-control\" *ngIf=\"includeProperty('treeChildren')\">\n          <label for=\"treeChildren\">{{getPropertyLabel('treeChildren')}}: </label>\n          <select-input \n            [items]=\"item.p('treeChildren') | async\" \n            (updated)=\"updateProperty('treeChildren', $event)\" \n            [options]=\"item.fields['treeChildren'].p('possibleValues') | async\"></select-input>\n        </div> \n       \n        <ng-content></ng-content>  \n        \n    </material-panel>\n  ",
            directives: [panel_material_1.MaterialPanel, component_select_1.MultiSelectInput, component_select_1.SingleSelectInput,
                repo_nested_1.RepoNested, panel_border_1.BorderPanel, component_templateValue_1.TemplateValue],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], LyphPanel);
    return LyphPanel;
}(panel_material_1.MaterialPanel));
exports.LyphPanel = LyphPanel;
//# sourceMappingURL=panel.lyph.js.map