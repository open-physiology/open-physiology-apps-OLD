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
 * Created by Natallia on 6/28/2016.
 */
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var accordion_1 = require('ng2-bootstrap/components/accordion');
var ng2_dnd_1 = require('ng2-dnd/ng2-dnd');
var utils_model_1 = require('../services/utils.model');
var toolbar_add_1 = require('../components/toolbar.add');
var toolbar_filter_1 = require('../components/toolbar.filter');
var toolbar_sort_1 = require('../components/toolbar.sort');
var dispatch_resources_1 = require("../panels/dispatch.resources");
var repo_abstract_1 = require("./repo.abstract");
var pipe_general_1 = require("../transformations/pipe.general");
var component_select_1 = require("../components/component.select");
var ng2_toasty_1 = require('ng2-toasty/ng2-toasty');
var service_highlight_1 = require("../services/service.highlight");
var RepoNested = (function (_super) {
    __extends(RepoNested, _super);
    function RepoNested(toastyService, highlightService) {
        _super.call(this, highlightService);
        this.toastyService = toastyService;
        this.getIcon = utils_model_1.getIcon;
        this.includeExisting = false;
        this.itemToInclude = null;
    }
    RepoNested.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        //If selectionOptions are not provided by parent, subscribe and get all for given types
        if (!this.selectionOptions) {
            if (this.types.length == 1) {
                this.ts = utils_model_1.model[this.types[0]].p('all').subscribe(function (data) {
                    _this.selectionOptions = data;
                });
            }
            else {
                if (this.types.length > 1) {
                    var setToArray_1 = new pipe_general_1.SetToArray();
                    var filterByClass_1 = new pipe_general_1.FilterByClass();
                    this.ts = utils_model_1.model.Template.p('all').subscribe(function (data) { _this.selectionOptions = new Set(filterByClass_1.transform(setToArray_1.transform(data), _this.types)); });
                }
            }
        }
    };
    RepoNested.prototype.ngOnDestroy = function () {
        if (this.ts)
            this.ts.unsubscribe();
    };
    RepoNested.prototype.ngOnChanges = function (changes) {
        //Set correct initial order for linked set]
        if (this.items) {
            if (this.options.linked) {
                this.items.sort(function (a, b) { return utils_model_1.compareLinkedParts(a, b); });
            }
            else if (this.options.ordered) {
                this.items.sort(function (a, b) {
                    return (a['-->HasLayer'].relativePosition - b['-->HasLayer'].relativePosition);
                });
            }
        }
    };
    RepoNested.prototype.onDragStart = function (index) { };
    RepoNested.prototype.onDragEnd = function (index) {
        if (this.options.linked) {
            this.items[0].treeParent = null;
            for (var i = 1; i < this.items.length; i++) {
                this.items[i].treeParent = this.items[i - 1];
            }
            this.updated.emit(this.items);
        }
        else if (this.options.ordered) {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i]['-->HasLayer'].relativePosition = i;
            }
            this.updated.emit(this.items);
        }
    };
    RepoNested.prototype.onAdded = function (Class) {
        _super.prototype.onAdded.call(this, Class);
        if (this.options.linked)
            this.linkAdded();
    };
    RepoNested.prototype.onIncluded = function (newItem) {
        if (newItem) {
            if (this.items.indexOf(newItem) < 0) {
                if (this.options.linked)
                    this.linkAdded();
                this.items.push(newItem);
                this.updated.emit(this.items);
                this.added.emit(newItem);
                this.selectedItem = newItem;
            }
            else {
                this.toastyService.error("Selected resource is already included to the set!");
            }
        }
    };
    RepoNested.prototype.linkAdded = function () {
        if (this.selectedItem) {
            var index = this.items.indexOf(this.selectedItem);
            if (index > 0) {
                this.selectedItem.treeParent = this.items[index - 1];
            }
        }
    };
    RepoNested = __decorate([
        core_1.Component({
            selector: 'repo-nested',
            inputs: ['items', 'caption', 'ignore', 'types', 'selectedItem', 'options', 'selectionOptions'],
            providers: [ng2_toasty_1.ToastyService],
            template: "\n    <div class=\"panel panel-warning repo-nested\">\n      <div class=\"panel-heading\">{{caption}}</div>\n      <div class=\"panel-body\" >\n        <span  *ngIf = \"!(options?.readOnly || options?.headersOnly)\">\n          <select-input-1\n            style=\"float: left;\" [item] = \"itemToInclude\"\n           (updated) = \"itemToInclude = $event\"    \n           [options] = \"selectionOptions\">\n          </select-input-1>\n          <button type=\"button\" class=\"btn btn-default btn-icon\" (click)=\"onIncluded(itemToInclude)\">\n            <span class=\"glyphicon glyphicon-save\"></span>\n          </button>\n        </span>\n        \n        <sort-toolbar   *ngIf =  \"options?.sortToolbar\"  [options]=\"['Name', 'ID', 'Class']\" (sorted)=\"onSorted($event)\"></sort-toolbar>\n        <add-toolbar    *ngIf = \"!(options?.readOnly || options?.headersOnly)\"  [options]=\"types\" [transform]=\"getClassLabel\" (added)=\"onAdded($event)\"></add-toolbar>\n        <filter-toolbar *ngIf =  \"options?.filterToolbar\" [options]=\"['Name', 'ID', 'Class']\" [filter]=\"searchString\" (applied)=\"onFiltered($event)\"></filter-toolbar>\n          \n        <accordion class=\"list-group\" [closeOthers]=\"true\"\n          dnd-sortable-container [dropZones]=\"zones\" [sortableData]=\"items\">\n          <accordion-group *ngFor=\"let item of items \n            | orderBy : sortByMode \n            | filterBy: [searchString, filterByMode]; let i = index\" \n            class=\"list-group-item\" dnd-sortable (onDragStart)=\"onDragStart()\" (onDragEnd)=\"onDragEnd()\"\n           [sortableIndex]=\"i\">\n            <div accordion-heading \n              (click)=\"updateSelected(item)\" \n              (mouseover)=\"updateHighlighted(item)\" (mouseout)=\"cleanHighlighted(item)\"\n              [ngClass]=\"{highlighted: _highlightedItem == item}\">\n              <item-header [item]=\"item\" \n                [selectedItem]=\"selectedItem\" \n                [isSelectedOpen]=\"isSelectedOpen\" \n                [icon]=\"getIcon(item.class)\">\n              </item-header>\n            </div>\n\n            <div *ngIf=\"!options?.headersOnly\">\n              <panel-general *ngIf=\"item == selectedItem\" \n                [item]    =\"item\" \n                [ignore]  =\"ignore\"\n                [options] =\"options\"\n                (saved)   =\"onSaved(item, $event)\" \n                (removed) =\"onRemoved(item)\"\n                (highlightedItemChange)=\"highlightedItemChange.emit($event)\"\n                ></panel-general>            \n            </div>\n          </accordion-group>        \n        </accordion>       \n      </div>\n    </div>\n    <ng2-toasty></ng2-toasty>\n  ",
            directives: [repo_abstract_1.ItemHeader, toolbar_sort_1.SortToolbar, toolbar_add_1.AddToolbar, toolbar_filter_1.FilterToolbar, component_select_1.SingleSelectInput,
                core_1.forwardRef(function () { return dispatch_resources_1.PanelDispatchResources; }),
                accordion_1.ACCORDION_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, ng2_dnd_1.DND_DIRECTIVES,
                ng2_toasty_1.Toasty],
            pipes: [pipe_general_1.OrderBy, pipe_general_1.FilterBy, pipe_general_1.SetToArray]
        }), 
        __metadata('design:paramtypes', [ng2_toasty_1.ToastyService, service_highlight_1.HighlightService])
    ], RepoNested);
    return RepoNested;
}(repo_abstract_1.RepoAbstract));
exports.RepoNested = RepoNested;
//# sourceMappingURL=repo.nested.js.map