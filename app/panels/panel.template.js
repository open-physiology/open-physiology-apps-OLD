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
var utils_model_1 = require('../services/utils.model');
var panel_resource_1 = require("./panel.resource");
var component_templateValue_1 = require('../components/component.templateValue');
var pipe_general_1 = require("../transformations/pipe.general");
var TemplatePanel = (function (_super) {
    __extends(TemplatePanel, _super);
    function TemplatePanel() {
        _super.apply(this, arguments);
        this.createType = false;
        this.typeCreated = false;
        this.cardinalityMultipliers = {};
    }
    TemplatePanel.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.ignore) {
            this.ignore = new Set(["cardinalityBase", "cardinalityMultipliers", "definedType"]);
        }
        if (!this.custom) {
            this.custom = new Set();
        }
        this.custom.add("cardinalityBase");
        _super.prototype.ngOnInit.call(this);
        if (this.item) {
            this.typeCreated = !!this.item['-->DefinesType'];
            //Options for cardinality multipliers
            this.item.fields['cardinalityMultipliers'].p('possibleValues').subscribe(function (data) {
                _this.cardinalityMultipliers =
                    new Set(new pipe_general_1.HideClass().transform(new pipe_general_1.SetToArray().transform(data), [utils_model_1.ResourceName.Border, utils_model_1.ResourceName.Node]));
            });
        }
    };
    TemplatePanel.prototype.onSaved = function (event) {
        if (this.item.class === utils_model_1.ResourceName.CoalescenceScenario) {
            if (this.item.lyphs && (this.item.lyphs.size !== 2)) {
                console.log("Wrong number of lyphs", this.item.lyphs.size);
            }
        }
        this.saved.emit({ createType: this.createType });
    };
    TemplatePanel = __decorate([
        core_1.Component({
            selector: 'template-panel',
            inputs: ['item', 'ignore', 'options', 'custom'],
            template: "\n    <resource-panel [item]=\"item\" \n      [ignore]   = \"ignore\"\n      [options]  = \"options\"\n      [custom]   = \"custom\"\n      (saved)    = \"onSaved($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" \n      (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n      \n      <toolbar *ngIf=\"!options?.hideCreateType\" >\n        <ng-content select=\"toolbar\"></ng-content>\n        <input type=\"checkbox\" [disabled]=\"typeCreated\" [(ngModel)]=\"createType\">Create type\n      </toolbar>\n      \n      <!--Cardinality base-->\n      <templateGroup *ngFor = \"let property of ['cardinalityBase']\">\n        <template-value *ngIf=\"includeProperty(property)\" \n          [caption]=\"getPropertyLabel(property)\" \n          [item]=\"item.p(property) | async\"\n          [step]=\"0.1\"\n          (updated)=\"updateProperty(property, $event)\">\n        </template-value>\n      </templateGroup>   \n    \n      <ng-content></ng-content>      \n\n    </resource-panel>\n  ",
            directives: [panel_resource_1.ResourcePanel, component_templateValue_1.TemplateValue]
        }), 
        __metadata('design:paramtypes', [])
    ], TemplatePanel);
    return TemplatePanel;
}(panel_resource_1.ResourcePanel));
exports.TemplatePanel = TemplatePanel;
//# sourceMappingURL=panel.template.js.map