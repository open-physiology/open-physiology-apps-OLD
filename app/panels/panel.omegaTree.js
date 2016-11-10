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
var panel_template_1 = require("./panel.template");
var component_select_1 = require('../components/component.select');
var pipe_general_1 = require("../transformations/pipe.general");
var OmegaTreePanel = (function (_super) {
    __extends(OmegaTreePanel, _super);
    function OmegaTreePanel() {
        _super.apply(this, arguments);
    }
    OmegaTreePanel.prototype.ngOnInit = function () {
        this.custom = new Set(['treeParent', 'treeChildren']);
        _super.prototype.ngOnInit.call(this);
        this.ignore = this.ignore.add('supertypes').add('subtypes').add('elements')
            .add('cardinalityMultipliers').add('treeParent').add('treeChildren');
    };
    OmegaTreePanel.prototype.onPropertyUpdate = function (event) {
        this.propertyUpdated.emit(event);
    };
    OmegaTreePanel = __decorate([
        core_1.Component({
            selector: 'omegaTree-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <template-panel [item]=\"item\" \n      [ignore]   = \"ignore\"\n      [options]  = \"options\"\n      [custom]   = \"custom\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"onPropertyUpdate($event)\"\n      (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n      \n      <!--TreeParent-->\n      <div  *ngIf=\"includeProperty('type')\" class=\"input-control\">\n        <label for=\"treeParent\">{{getPropertyLabel('treeParent')}}: </label>\n        <select-input-1 [item] = \"item.p('treeParent') | async\"\n         (updated) = \"updateProperty('treeParent', $event)\"    \n         [options] = \"item.fields['treeParent'].p('possibleValues') | async\"></select-input-1>\n      </div>\n      \n      <!--TreeChildren-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('treeChildren')\">\n        <label for=\"treeChildren\">{{getPropertyLabel('treeChildren')}}: </label>\n        <select-input \n          [items]=\"item.p('treeChildren') | async\" \n          (updated)=\"updateProperty('treeChildren', $event)\" \n          [options]=\"item.fields['treeChildren'].p('possibleValues') | async\"></select-input>\n      </div>  \n\n      <ng-content></ng-content> \n    \n    </template-panel>\n  ",
            directives: [panel_template_1.TemplatePanel, component_select_1.SingleSelectInput, component_select_1.MultiSelectInput],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], OmegaTreePanel);
    return OmegaTreePanel;
}(panel_template_1.TemplatePanel));
exports.OmegaTreePanel = OmegaTreePanel;
//# sourceMappingURL=panel.omegaTree.js.map