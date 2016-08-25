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
var panel_group_1 = require("./panel.group");
var component_select_1 = require('../components/component.select');
var pipe_general_1 = require("../transformations/pipe.general");
var repo_nested_1 = require('../repos/repo.nested');
var OmegaTreePanel = (function (_super) {
    __extends(OmegaTreePanel, _super);
    function OmegaTreePanel() {
        _super.apply(this, arguments);
    }
    OmegaTreePanel.prototype.ngOnInit = function () {
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
            template: "\n    <group-panel [item]=\"item\" \n      [ignore] = \"ignore\"\n      [options] = \"options\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"onPropertyUpdate($event)\">\n      \n      <!--Root-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('root')\">      \n        <label for=\"root\">{{getPropertyLabel('root')}}: </label>\n        <select-input [items] = \"item.p('root') | async\" \n          (updated) = \"updateProperty('root', $event)\"   \n          [options] = \"item.fields['root'].p('possibleValues') | async\"></select-input>\n      </div>\n      \n       <relationGroup>\n        <!--Parts-->\n        <div class=\"input-control\" *ngIf=\"includeProperty('parts')\">\n           <repo-nested [caption]=\"getPropertyLabel('parts')\" \n           [items] = \"item.p('parts') | async | setToArray\" \n           (updated)=\"updateProperty('parts', $event)\"\n           [options]=\"{linked: true}\"\n           [types]=\"[ResourceName.Lyph, ResourceName.OmegaTree]\"\n           (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n        </div>\n         <ng-content select=\"relationGroup\"></ng-content> \n      </relationGroup>\n      \n      <!--TreeParent-->\n      <div  *ngIf=\"includeProperty('type')\" class=\"input-control\">\n        <label for=\"treeParent\">{{getPropertyLabel('treeParent')}}: </label>\n        <select-input-1 [item] = \"item.p('treeParent') | async\"\n         (updated) = \"updateProperty('treeParent', $event)\"    \n         [options] = \"item.fields['treeParent'].p('possibleValues') | async\"></select-input-1>\n      </div>\n      \n      <!--TreeChildren-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('treeChildren')\">\n        <label for=\"treeChildren\">{{getPropertyLabel('treeChildren')}}: </label>\n        <select-input \n          [items]=\"item.p('treeChildren') | async\" \n          (updated)=\"updateProperty('treeChildren', $event)\" \n          [options]=\"item.fields['treeChildren'].p('possibleValues') | async\"></select-input>\n      </div>  \n\n      <ng-content></ng-content> \n    \n    </group-panel>\n  ",
            directives: [panel_group_1.GroupPanel, component_select_1.MultiSelectInput, component_select_1.SingleSelectInput, repo_nested_1.RepoNested],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], OmegaTreePanel);
    return OmegaTreePanel;
}(panel_group_1.GroupPanel));
exports.OmegaTreePanel = OmegaTreePanel;
//# sourceMappingURL=panel.omegaTree.js.map