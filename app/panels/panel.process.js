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
var ng2_radio_group_1 = require("ng2-radio-group");
var pipe_general_1 = require("../transformations/pipe.general");
var ProcessPanel = (function (_super) {
    __extends(ProcessPanel, _super);
    function ProcessPanel() {
        _super.apply(this, arguments);
        this.sourceOptions = [];
        this.targetOptions = [];
    }
    ProcessPanel.prototype.ngOnInit = function () {
        var _this = this;
        this.custom = new Set(['transportPhenomenon']);
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
    ProcessPanel.prototype.updateProperty = function (property, lyph) {
        _super.prototype.updateProperty.call(this, property, lyph);
        if (!lyph)
            return;
        if (property === "sourceLyph") {
            this.sourceOptions = lyph.nodes;
            if (this.item.source) {
                if (this.sourceOptions.indexOf(this.item.source) < 0)
                    this.item.source = null;
            }
        }
        if (property === "targetLyph") {
            this.targetOptions = lyph.nodes;
            if (this.item.target) {
                if (this.targetOptions.indexOf(this.item.target) < 0)
                    this.item.target = null;
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
            template: "\n    <template-panel [item]=\"item\" \n      [ignore]   = \"ignore\"\n      [options]  = \"options\"\n      [custom]   = \"custom\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" \n      (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n        \n      <!--TransportPhenomenon-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('transportPhenomenon')\">\n        <fieldset>\n          <legend>{{getPropertyLabel('transportPhenomenon')}}:</legend>\n          <checkbox-group [(ngModel)]=\"item.transportPhenomenon\" (ngModelChange)=\"onSelectChange(item.transportPhenomenon)\">\n             <input type=\"checkbox\" value=\"diffusion\">diffusion&nbsp;\n             <input type=\"checkbox\" value=\"advection\">advection<br/>\n           </checkbox-group>\n        </fieldset>\n      </div>\n\n      <ng-content></ng-content>  \n   \n    </template-panel>\n  ",
            directives: [panel_template_1.TemplatePanel, ng2_radio_group_1.RADIO_GROUP_DIRECTIVES],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], ProcessPanel);
    return ProcessPanel;
}(panel_template_1.TemplatePanel));
exports.ProcessPanel = ProcessPanel;
//# sourceMappingURL=panel.process.js.map