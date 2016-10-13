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
var panel_resource_1 = require("./panel.resource");
var component_select_1 = require('../components/component.select');
var repo_nested_1 = require('../repos/repo.nested');
var utils_model_1 = require("../services/utils.model");
var Resource = utils_model_1.model.Resource;
var ExternalResourcePanel = (function (_super) {
    __extends(ExternalResourcePanel, _super);
    function ExternalResourcePanel() {
        _super.apply(this, arguments);
        this.Resource = Resource;
    }
    ExternalResourcePanel.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.ignore = this.ignore.add('externals');
    };
    ExternalResourcePanel = __decorate([
        core_1.Component({
            selector: 'externalResource-panel',
            inputs: ['item', 'ignore', 'options'],
            template: "\n    <resource-panel [item] = \"item\" \n      [ignore] = \"ignore\"\n      [options] =\"options\"\n      (saved)    = \"saved.emit($event)\"\n      (canceled) = \"canceled.emit($event)\"\n      (removed)  = \"removed.emit($event)\"\n      (propertyUpdated) = \"propertyUpdated.emit($event)\" (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n\n      <!--URI-->\n      <div class=\"input-control input-control-lg\" *ngIf=\"includeProperty('uri')\">\n        <label for=\"uri\">{{getPropertyLabel('uri')}}: </label>\n        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.uri\">\n      </div>\n  \n      <!--Type-->\n      <div class=\"input-control input-control-lg\" *ngIf=\"includeProperty('type')\">\n        <label for=\"type\">{{getPropertyLabel('type')}}: </label>\n        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.type\">\n      </div>\n      \n      <!--Locals - TODO: map to categories-->\n      <div class=\"input-control\" *ngIf=\"includeProperty('locals')\">\n        <label for=\"locals\">{{getPropertyLabel('locals')}}: </label>\n        <select-input \n        [items]=\"item.p('locals') | async\" \n        (updated)=\"updateProperty('locals', $event)\" \n        [options]=\"item.fields['locals'].p('possibleValues') | async\"></select-input>\n      </div>\n\n      <ng-content></ng-content>      \n\n    </resource-panel>\n  ",
            directives: [panel_resource_1.ResourcePanel, component_select_1.MultiSelectInput, repo_nested_1.RepoNested]
        }), 
        __metadata('design:paramtypes', [])
    ], ExternalResourcePanel);
    return ExternalResourcePanel;
}(panel_resource_1.ResourcePanel));
exports.ExternalResourcePanel = ExternalResourcePanel;
//# sourceMappingURL=panel.externalResource.js.map