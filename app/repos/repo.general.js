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
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var accordion_1 = require('ng2-bootstrap/components/accordion');
var ng2_dnd_1 = require('ng2-dnd/ng2-dnd');
var toolbar_add_1 = require('../components/toolbar.add');
var toolbar_filter_1 = require('../components/toolbar.filter');
var toolbar_sort_1 = require('../components/toolbar.sort');
var utils_model_1 = require("../services/utils.model");
var pipe_general_1 = require("../transformations/pipe.general");
var dispatch_resources_1 = require("../panels/dispatch.resources");
var repo_abstract_1 = require("./repo.abstract");
var repo_itemHeader_1 = require("./repo.itemHeader");
var service_highlight_1 = require("../services/service.highlight");
var toolbar_propertySettings_1 = require('../components/toolbar.propertySettings');
var RepoGeneral = (function (_super) {
    __extends(RepoGeneral, _super);
    function RepoGeneral(highlightService) {
        _super.call(this, highlightService);
        this.ignoreTypes = new Set([utils_model_1.ResourceName.Border, utils_model_1.ResourceName.Node]);
        this.typeOptions = [];
    }
    RepoGeneral.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.typeOptions = this.types.filter(function (x) { return x.class !== utils_model_1.ResourceName.LyphWithAxis; }).map(function (x) { return ({ selected: !_this.ignoreTypes.has(x), value: x }); });
        this.typeOptions.push({ selected: !this.ignoreTypes.has("Type"), value: "Type" });
    };
    RepoGeneral.prototype.hiddenTypesChanged = function (option) {
        if (this.ignoreTypes.has(option.value) && option.selected)
            this.ignoreTypes.delete(option.value);
        if (!this.ignoreTypes.has(option.value) && !option.selected)
            this.ignoreTypes.add(option.value);
    };
    Object.defineProperty(RepoGeneral.prototype, "hiddenTypes", {
        get: function () {
            return Array.from(this.ignoreTypes);
        },
        enumerable: true,
        configurable: true
    });
    RepoGeneral = __decorate([
        core_1.Component({
            selector: 'repo-general',
            inputs: ['items', 'caption', 'ignore', 'types', 'selectedItem', 'activeItem', 'options'],
            template: "\n     <div class=\"panel panel-info repo\">\n        <div class=\"panel-heading\">{{caption}}\n          <span class=\"pull-right\" *ngIf=\"options?.showActive\">\n            <button type=\"button\" class=\"btn btn-default btn-header\" \n              [ngClass]=\"{'active': activeItem === null}\" (click)=\"updateActive(null)\">\n              <span class = \"glyphicon\" [ngClass]=\"{'glyphicon-pencil': activeItem === null}\"></span>\n            </button>\n          </span>\n        </div>\n        <div class=\"panel-body\">\n          <sort-toolbar  [options]=\"['Name', 'ID', 'Class']\" (sorted)=\"onSorted($event)\"></sort-toolbar>\n          <add-toolbar   [options]=\"types\" [transform]=\"getClassLabel\" (added)=\"onAdded($event)\"></add-toolbar>\n          <property-toolbar  [options] = \"typeOptions\" [transform] = \"getClassLabel\" \n            (selectionChanged) = \"hiddenTypesChanged($event)\">\n          </property-toolbar>\n\n          <filter-toolbar [filter]=\"searchString\" [options]=\"['Name', 'ID', 'Class']\" (applied)=\"onFiltered($event)\"></filter-toolbar>\n                    \n          <accordion class=\"list-group\" [closeOthers]=\"true\"> \n            <!--dnd-sortable-container [dropZones]=\"zones\" [sortableData]=\"items\">-->\n          <accordion-group *ngFor=\"let item of items           \n          | hideClass : hiddenTypes\n          | orderBy : sortByMode \n          | filterBy: [searchString, filterByMode]; let i = index\">\n            <!--class=\"list-group-item\" dnd-sortable [sortableIndex]=\"i\"> -->\n            <div accordion-heading \n              (click)=\"updateSelected(item)\" \n              (mouseover)=\"updateHighlighted(item)\" (mouseout)=\"cleanHighlighted(item)\"\n              [ngClass]=\"{highlighted: _highlightedItem === item}\"\n              >\n              <item-header [item]=\"item\" \n                [selectedItem]  =\"selectedItem\" \n                [isSelectedOpen]=\"isSelectedOpen\" \n                [icon]          =\"getResourceIcon(item)\">   \n                <extra *ngIf=\"options?.showActive\">\n                  <button type=\"button\" class=\"btn btn-default btn-header\" \n                    [ngClass]=\"{'active': activeItem === item}\" (click)=\"updateActive(item)\">\n                    <span class = \"glyphicon\" [ngClass]=\"{'glyphicon-pencil': activeItem === item}\"></span>\n                  </button>\n                </extra>\n              </item-header>\n            </div>\n\n            <div *ngIf=\"!options?.headersOnly\">\n              <panel-general *ngIf=\"item === selectedItem\" [item]=\"item\"\n                [ignore]=\"ignore\"\n                (saved)=\"onSaved(item, $event)\" \n                (canceled)=\"onCanceled($event)\"\n                (removed)=\"onRemoved(item)\"\n                (highlightedItemChange)=\"highlightedItemChange.emit($event)\">\n               </panel-general>   \n            </div>\n                \n          </accordion-group>        \n          </accordion>       \n        </div>\n      </div>\n  ",
            styles: ['.repo{ width: 100%}'],
            directives: [
                toolbar_sort_1.SortToolbar, toolbar_add_1.AddToolbar, toolbar_filter_1.FilterToolbar,
                repo_itemHeader_1.ItemHeader,
                dispatch_resources_1.PanelDispatchResources, toolbar_propertySettings_1.PropertyToolbar,
                accordion_1.ACCORDION_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, ng2_dnd_1.DND_DIRECTIVES],
            pipes: [pipe_general_1.OrderBy, pipe_general_1.FilterBy, pipe_general_1.HideClass]
        }), 
        __metadata('design:paramtypes', [service_highlight_1.HighlightService])
    ], RepoGeneral);
    return RepoGeneral;
}(repo_abstract_1.RepoAbstract));
exports.RepoGeneral = RepoGeneral;
//# sourceMappingURL=repo.general.js.map