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
var core_1 = require("@angular/core");
var panel_resource_1 = require("./panel.resource");
var component_select_1 = require("../components/component.select");
var repo_nested_1 = require("../repos/repo.nested");
var pipe_general_1 = require("../transformations/pipe.general");
var CorrelationPanel = (function (_super) {
    __extends(CorrelationPanel, _super);
    function CorrelationPanel() {
        _super.apply(this, arguments);
        this.selectTemplate = "\n\n\n";
    }
    CorrelationPanel.prototype.getTypes = function (property) {
        switch (property) {
            case "measurables": return [this.ResourceName.Measurable];
        }
        return [this.item.class];
    };
    CorrelationPanel = __decorate([
        core_1.Component({
            selector: 'correlation-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <resource-panel [item]=\"item\" \n      [ignore]=\"ignore\" \n      [options] =\"options\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n      \n      <!--Comment-->\n      <inputGroup *ngFor=\"let property of ['comment']\">\n        <div class=\"input-control input-control-lg\" *ngIf=\"includeProperty(property)\">\n          <label for=\"comment\">{{getPropertyLabel(property)}}: </label>\n          <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item[property]\">\n        </div>\n        <ng-content select=\"inputGroup\"></ng-content>\n      </inputGroup>\n        \n      <!--Publication-->\n      <selectGroup *ngFor=\"let property of ['publication']\">\n        <div class=\"input-control\" *ngIf=\"includeProperty(property)\">      \n          <label>{{getPropertyLabel(property)}}: </label>\n          <select-input-1 [item] = \"item.p(property) | async\" \n            (updated) = \"updateProperty(property, $event)\"  \n            [options] = \"item.fields[property].p('possibleValues') | async\">\n          </select-input-1>\n        </div>\n        <ng-content select=\"selectGroup\"></ng-content>\n      </selectGroup>\n      \n      <!--ClinicalIndices-->\n      <multiSelectGroup *ngFor=\"let property of ['clinicalIndices']\">\n         <div class=\"input-control\" *ngIf=\"includeProperty(property)\">\n            <label>{{getPropertyLabel(property)}}: </label>\n            <select-input [items] = \"item.p(property) | async\"\n             (updated) = \"updateProperty(property, $event)\"    \n             [options] = \"item.fields[property].p('possibleValues') | async\">\n            </select-input>\n         </div>\n        <ng-content select=\"multiSelectGroup\"></ng-content>\n      </multiSelectGroup>\n           \n      <!--Measurables-->  \n      <relationGroup *ngFor=\"let property of ['measurables']\">\n        <div class=\"input-control\" *ngIf=\"includeProperty(property)\">\n          <repo-nested \n            [caption]=\"getPropertyLabel(property)\" \n            [items]  =\"item.p(property) | async | setToArray\" \n            [types]  =\"getTypes(property)\"\n            (updated)=\"updateProperty(property, $event)\" \n            (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n          </repo-nested>\n        </div>\n        <ng-content select=\"relationGroup\"></ng-content>\n      </relationGroup>\n        \n      <ng-content></ng-content>      \n    \n    </resource-panel>\n  ",
            directives: [panel_resource_1.ResourcePanel, component_select_1.SingleSelectInput, component_select_1.MultiSelectInput, repo_nested_1.RepoNested],
            pipes: [pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [])
    ], CorrelationPanel);
    return CorrelationPanel;
}(panel_resource_1.ResourcePanel));
exports.CorrelationPanel = CorrelationPanel;
//# sourceMappingURL=panel.correlation.js.map