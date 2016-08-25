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
 * Created by Natallia on 6/19/2016.
 */
var core_1 = require('@angular/core');
var panel_template_1 = require("./panel.template");
var component_select_1 = require('../components/component.select');
var ng2_radio_group_1 = require("ng2-radio-group");
var pipe_general_1 = require("../transformations/pipe.general");
var repo_nested_1 = require("../repos/repo.nested");
var ProcessPanel = (function (_super) {
    __extends(ProcessPanel, _super);
    function ProcessPanel() {
        _super.apply(this, arguments);
        this.sourceOptions = {};
        this.targetOptions = {};
    }
    ProcessPanel.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        if (!this.item.transportPhenomenon)
            this.item.transportPhenomenon = [];
        this.ignore = this.ignore.add('cardinalityBase').add('cardinalityMultipliers');
        this.item.fields['source'].p('possibleValues').subscribe(function (data) {
            if (_this.item.sourceLyph) {
                _this.sourceOptions = _this.item.sourceLyph.nodes;
            }
            else {
                _this.sourceOptions = data;
            }
        });
        this.item.fields['target'].p('possibleValues').subscribe(function (data) {
            if (_this.item.targetLyph) {
                _this.targetOptions = _this.item.targetLyph.nodes;
            }
            else {
                _this.targetOptions = data;
            }
        });
    };
    ProcessPanel.prototype.onLyphChange = function (property, lyph) {
        _super.prototype.updateProperty.call(this, property, lyph);
        if (!lyph)
            return;
        if (property == "sourceLyph") {
            this.sourceOptions = lyph.nodes;
            if (this.source) {
                if (this.sourceOptions.indexOf(this.source) < 0)
                    this.source = null;
            }
        }
        if (property == "targetLyph") {
            this.targetOptions = lyph.nodes;
            if (this.target) {
                if (this.targetOptions.indexOf(this.target) < 0)
                    this.target = null;
            }
        }
    };
    ProcessPanel.prototype.onSelectChange = function (value) {
        var newTP = (Array.isArray(value)) ? value.slice() : value;
        this.propertyUpdated.emit({ property: 'transportPhenomenon', values: newTP });
    };
    ProcessPanel = __decorate([
        core_1.Component({
            selector: 'process-panel',
            inputs: ['item', 'ignore', "options"],
            template: "\n    <template-panel [item]=\"item\" \n      [ignore]  =\"ignore\"\n      [options] =\"options\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n        \n      <!--TransportPhenomenon-->\n        <div class=\"input-control\" *ngIf=\"includeProperty('transportPhenomenon')\">\n          <fieldset>\n            <legend>{{getPropertyLabel('transportPhenomenon')}}:</legend>\n            <checkbox-group [(ngModel)]=\"item.transportPhenomenon\" (ngModelChange)=\"onSelectChange(item.transportPhenomenon)\">\n               <input type=\"checkbox\" value=\"diffusion\">diffusion&nbsp;\n               <input type=\"checkbox\" value=\"advection\">advection<br/>\n             </checkbox-group>\n          </fieldset>\n        </div>\n          \n        <!--ConveyingLyph-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('conveyingLyph')\">\n        <label for=\"conveyingLyph\">{{getPropertyLabel('conveyingLyph')}}: </label>\n        <select-input [items] = \"item.p('conveyingLyph') | async\"\n         (updated) = \"updateProperty('conveyingLyph', $event)\"    \n         [options] = \"item.fields['conveyingLyph'].p('possibleValues') | async\"></select-input>\n      </div>\n      \n      <!--SourceLyph-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('sourceLyph')\">      \n        <label for=\"sourceLyph\">{{getPropertyLabel('sourceLyph')}}: </label>\n        <select-input-1 [item] = \"item.p('sourceLyph') | async\" \n          (updated) = \"onLyphChange('sourceLyph', $event)\"  \n          [options] = \"item.fields['sourceLyph'].p('possibleValues') | async\"></select-input-1>\n      </div>\n      \n      <!--TargetLyph-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('targetLyph')\">      \n        <label for=\"targetLyph\">{{getPropertyLabel('targetLyph')}}: </label>\n        <select-input-1 [item] = \"item.p('targetLyph') | async\" \n          (updated) = \"onLyphChange('targetLyph', $event)\"   \n          [options] = \"item.fields['targetLyph'].p('possibleValues') | async\"></select-input-1>\n      </div>        \n      \n      <!--Source-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('source')\">      \n        <label for=\"source\">{{getPropertyLabel('source')}}: </label>\n        <select-input-1 [item] = \"item.p('source') | async\" \n          (updated) = \"updateProperty('source', $event)\"   \n          [options] = \"sourceOptions\"></select-input-1>\n      </div>\n      \n      <!--Target-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('target')\">      \n        <label for=\"target\">{{getPropertyLabel('target')}}: </label>\n        <select-input-1 [item] = \"item.p('target') | async\" \n          (updated) = \"updateProperty('target', $event)\"  \n          [options] = \"targetOptions\"></select-input-1>\n      </div>   \n          \n       <!--Materials-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('materials')\">\n        <label for=\"meterials\">{{getPropertyLabel('materials')}}: </label>\n        <select-input [items]=\"item.p('materials') | async\" \n        (updated)=\"updateProperty('materials', $event)\" \n         [options]=\"item.fields['materials'].p('possibleValues') | async\"></select-input>\n      </div> \n        \n       <relationGroup>\n        <!--Segments-->\n        <div class=\"input-control\" *ngIf=\"includeProperty('segments')\">\n          <repo-nested [caption]=\"getPropertyLabel('segments')\" \n          [items]=\"item.p('segments') | async | setToArray\" \n          (updated)=\"updateProperty('segments', $event)\" \n          [types]=\"[ResourceName.Process]\"\n          (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n        </div>\n        \n        <!--Channels-->\n        <div class=\"input-control\" *ngIf=\"includeProperty('channels')\">\n          <repo-nested [caption]=\"getPropertyLabel('channels')\" \n          [items]=\"item.p('channels') | async | setToArray\" \n          (updated)=\"updateProperty('channels', $event)\"           \n          [types]=\"[ResourceName.Process]\"\n          (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n        </div>\n      \n        <ng-content select=\"relationGroup\"></ng-content>\n      </relationGroup>\n       \n        <ng-content></ng-content>  \n   \n    </template-panel>\n  ",
            directives: [panel_template_1.TemplatePanel, component_select_1.MultiSelectInput, component_select_1.SingleSelectInput, repo_nested_1.RepoNested, ng2_radio_group_1.RADIO_GROUP_DIRECTIVES],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], ProcessPanel);
    return ProcessPanel;
}(panel_template_1.TemplatePanel));
exports.ProcessPanel = ProcessPanel;
//# sourceMappingURL=panel.process.js.map