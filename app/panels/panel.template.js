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
var component_select_1 = require('../components/component.select');
var component_templateValue_1 = require('../components/component.templateValue');
var pipe_general_1 = require("../transformations/pipe.general");
var TemplatePanel = (function (_super) {
    __extends(TemplatePanel, _super);
    function TemplatePanel() {
        _super.apply(this, arguments);
        this.createType = false;
        this.cardinalityMultipliers = {};
    }
    TemplatePanel.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        if (this.item) {
            var setToArray_1 = new pipe_general_1.SetToArray();
            var hideClass_1 = new pipe_general_1.HideClass();
            //Options for cardinality multiplieers
            this.item.fields['cardinalityMultipliers'].p('possibleValues').subscribe(function (data) {
                _this.cardinalityMultipliers =
                    new Set(hideClass_1.transform(setToArray_1.transform(data), [utils_model_1.ResourceName.Border, utils_model_1.ResourceName.Node]));
            });
        }
    };
    TemplatePanel.prototype.onSaved = function (event) {
        this.saved.emit({ createType: this.createType });
    };
    TemplatePanel = __decorate([
        core_1.Component({
            selector: 'template-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <resource-panel [item]=\"item\" \n      [ignore]   =\"ignore\"\n      [options]  =\"options\"\n      (saved)    = \"onSaved($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n      \n      <toolbar *ngIf=\"!(options && options.hideCreateType)\" >\n        <ng-content select=\"toolbar\"></ng-content>\n        <input type=\"checkbox\" [(ngModel)]=\"createType\">Create type\n      </toolbar>\n      \n      <!--Species-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('species')\">\n        <label for=\"species\">Species: </label>\n        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.species\">\n      </div>\n\n      <!--Cardinality base-->\n      <template-value *ngIf=\"includeProperty('cardinalityBase')\" \n        [caption]=\"getPropertyLabel('cardinalityBase')\" \n        [item]=\"item.cardinalityBase\"\n        [step]=\"0.1\"\n        (updated)=\"updateProperty('cardinalityBase', $event)\"\n      ></template-value>\n      \n      <!--Cardinality multipliers-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('cardinalityMultipliers')\">\n        <label for=\"cardinalityMultipliers\">{{getPropertyLabel('cardinalityMultipliers')}}: </label>\n          <select-input [items]=\"item.p('cardinalityMultipliers') | async\" \n          (updated)=\"updateProperty('cardinalityMultipliers', $event)\"          \n          [options]=\"cardinalityMultipliers\"></select-input>  \n      </div>\n      \n      <!--Types-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('types')\">\n        <label for=\"types\">{{getPropertyLabel('types')}}: </label>\n          <select-input [items]=\"item.p('types') | async\" \n          (updated)=\"updateProperty('types', $event)\"          \n          [options]=\"item.fields['types'].p('possibleValues') | async\"></select-input>  \n      </div>\n      \n      <ng-content select=\"relationGroup\"></ng-content>\n      \n      <ng-content></ng-content>      \n\n    </resource-panel>\n  ",
            directives: [panel_resource_1.ResourcePanel, component_select_1.MultiSelectInput, component_templateValue_1.TemplateValue]
        }), 
        __metadata('design:paramtypes', [])
    ], TemplatePanel);
    return TemplatePanel;
}(panel_resource_1.ResourcePanel));
exports.TemplatePanel = TemplatePanel;
//# sourceMappingURL=panel.template.js.map