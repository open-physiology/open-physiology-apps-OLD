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
var component_templateValue_1 = require('../components/component.templateValue');
var component_select_1 = require('../components/component.select');
var CausalityPanel = (function (_super) {
    __extends(CausalityPanel, _super);
    function CausalityPanel() {
        _super.apply(this, arguments);
    }
    CausalityPanel.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.ignore = this.ignore.add('cardinalityBase').add('cardinalityMultipliers');
    };
    CausalityPanel = __decorate([
        core_1.Component({
            selector: 'causality-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <template-panel [item]=\"item\" \n      [ignore]   = \"ignore\"\n      [options]  = \"options\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n      \n       <!--Cause-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('cause')\">      \n        <label for=\"cause\">{{getPropertyLabel('cause')}}: </label>\n        <select-input-1 [item] = \"item.p('cause') | async\" \n          (updated)=\"updateProperty('cause', $event)\"    \n          [options] = \"item.fields['cause'].p('possibleValues') | async\"></select-input-1>\n      </div>\n      \n      <!--Effect-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('effect')\">      \n        <label for=\"effect\">{{getPropertyLabel('effect')}}: </label>\n        <select-input-1 [item] = \"item.p('effect') | async\" \n          (updated) = \"updateProperty('effect', $event)\"    \n          [options] = \"item.fields['effect'].p('possibleValues') | async\"></select-input-1>\n      </div>\n      \n      <ng-content></ng-content>      \n    \n    </template-panel>\n  ",
            directives: [panel_template_1.TemplatePanel, component_templateValue_1.TemplateValue, component_select_1.SingleSelectInput],
        }), 
        __metadata('design:paramtypes', [])
    ], CausalityPanel);
    return CausalityPanel;
}(panel_template_1.TemplatePanel));
exports.CausalityPanel = CausalityPanel;
//# sourceMappingURL=panel.causality.js.map