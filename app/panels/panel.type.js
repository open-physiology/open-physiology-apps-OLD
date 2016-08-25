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
var panel_resource_1 = require("./panel.resource");
var component_select_1 = require('../components/component.select');
var component_templateValue_1 = require('../components/component.templateValue');
var TypePanel = (function (_super) {
    __extends(TypePanel, _super);
    function TypePanel() {
        _super.apply(this, arguments);
    }
    TypePanel = __decorate([
        core_1.Component({
            selector: 'type-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <resource-panel [item]=\"item\" \n      [ignore]   =\"ignore\"\n      [options]  =\"options\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n      \n      <!--Supertypes-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('supertypes')\">\n        <label for=\"supertypes\">{{getPropertyLabel('supertypes')}}: </label>\n        <select-input [items]=\"item.p('supertypes') | async\" \n        (updated)=\"updateProperty('supertypes', $event)\" \n        [options]=\"item.constructor.p('all') | async\"></select-input>\n      </div>\n      \n      <!--Subtypes-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('subtypes')\">\n        <label for=\"subtypes\">{{getPropertyLabel('subtypes')}}: </label>\n        <select-input [items]=\"item.p('subtypes') | async\" \n          (updated)=\"updateProperty('subtypes', $event)\" \n        [options]=\"item.constructor.p('all') | async\"></select-input>\n      </div>\n      \n      <!--Definition-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('definition')\">      \n        <label for=\"target\">{{getPropertyLabel('definition')}}: </label>\n         <select-input-1 [item] = \"item.p('definition') | async\"\n         (updated) = \"updateProperty('definition', $event)\"    \n         [options] = \"item.fields['definition'].p('possibleValues') | async\"></select-input-1>\n      </div>  \n      <ng-content></ng-content>      \n\n    </resource-panel>\n  ",
            directives: [panel_resource_1.ResourcePanel, component_select_1.SingleSelectInput, component_select_1.MultiSelectInput, component_templateValue_1.TemplateValue]
        }), 
        __metadata('design:paramtypes', [])
    ], TypePanel);
    return TypePanel;
}(panel_resource_1.ResourcePanel));
exports.TypePanel = TypePanel;
//# sourceMappingURL=panel.type.js.map