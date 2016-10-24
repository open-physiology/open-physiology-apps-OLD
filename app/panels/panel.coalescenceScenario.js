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
var repo_nested_1 = require('../repos/repo.nested');
var pipe_general_1 = require('../transformations/pipe.general');
var CoalescenceScenarioPanel = (function (_super) {
    __extends(CoalescenceScenarioPanel, _super);
    function CoalescenceScenarioPanel() {
        _super.apply(this, arguments);
    }
    CoalescenceScenarioPanel.prototype.onSaved = function (event) {
        if (this.item && this.item.lyphs && (this.item.lyphs.size != 2)) {
            console.log("Wrong number of lyphs", this.item.lyphs.size);
        }
        this.saved.emit({ createType: this.createType });
    };
    CoalescenceScenarioPanel = __decorate([
        core_1.Component({
            selector: 'coalescenceScenario-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <template-panel [item] = \"item\" \n      [ignore] = \"ignore\"\n      [options] =\"options\"\n      (saved)    = \"onSaved($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n\n       <!--Lyphs-->  \n      <relationGroup *ngFor=\"let property of ['lyphs']\">\n        <div class=\"input-control\" *ngIf=\"includeProperty(property)\">\n          <repo-nested \n            [caption]=\"getPropertyLabel(property)\" \n            [items]  =\"item.p(property) | async | setToArray\" \n            [types]  =\"getTypes(property)\"\n            (updated)=\"updateProperty(property, $event)\" \n            (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n          </repo-nested>\n        </div>\n        <ng-content select=\"relationGroup\"></ng-content>\n      </relationGroup>\n      <ng-content></ng-content>      \n\n    </template-panel>\n  ",
            directives: [panel_template_1.TemplatePanel, repo_nested_1.RepoNested],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], CoalescenceScenarioPanel);
    return CoalescenceScenarioPanel;
}(panel_template_1.TemplatePanel));
exports.CoalescenceScenarioPanel = CoalescenceScenarioPanel;
//# sourceMappingURL=panel.coalescenceScenario.js.map