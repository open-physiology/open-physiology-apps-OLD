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
var repo_nested_1 = require('../repos/repo.nested');
var pipe_general_1 = require("../transformations/pipe.general");
var GroupPanel = (function (_super) {
    __extends(GroupPanel, _super);
    function GroupPanel() {
        _super.apply(this, arguments);
    }
    GroupPanel = __decorate([
        core_1.Component({
            selector: 'group-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <template-panel [item]=\"item\" \n      [ignore]   = \"ignore\"\n      [options]  = \"options\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n      \n      <relationGroup>\n        <!--Elements-->\n        <div class=\"input-control\" *ngIf=\"includeProperty('elements')\">\n           <repo-nested [caption]=\"getPropertyLabel('elements')\" \n           [items] = \"item.p('elements') | async | setToArray\" \n           (updated)=\"updateProperty('elements', $event)\"\n           [types]=\"[ResourceName.Lyph, ResourceName.OmegaTree]\"\n           (highlightedItemChange)=\"highlightedItemChange.emit($event)\"></repo-nested>\n        </div>\n         <ng-content select=\"relationGroup\"></ng-content> \n      </relationGroup>\n      \n      <ng-content></ng-content>    \n    \n    </template-panel>\n  ",
            directives: [panel_template_1.TemplatePanel, repo_nested_1.RepoNested],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], GroupPanel);
    return GroupPanel;
}(panel_template_1.TemplatePanel));
exports.GroupPanel = GroupPanel;
//# sourceMappingURL=panel.group.js.map