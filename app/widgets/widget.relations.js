"use strict";
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
 * Created by Natallia on 7/15/2016.
 */
var core_1 = require('@angular/core');
var view_relationGraph_1 = require("./view.relationGraph");
var view_relationTree_1 = require("./view.relationTree");
var common_1 = require('@angular/common');
var dropdown_1 = require('ng2-bootstrap/components/dropdown');
var service_resize_1 = require('../services/service.resize');
var toolbar_propertySettings_1 = require('../components/toolbar.propertySettings');
var utils_model_1 = require("../services/utils.model");
var RelationshipWidget = (function () {
    function RelationshipWidget(resizeService) {
        var _this = this;
        this.resizeService = resizeService;
        this.relations = new Set();
        this.depth = 2;
        this.relationOptions = [];
        this.propertyOptions = [];
        this.getPropertyLabel = utils_model_1.getPropertyLabel;
        this.layout = "tree";
        this.subscription = resizeService.resize$.subscribe(function (event) {
            if (event.target == "hierarchy-widget") {
                _this.onSetPanelSize(event);
            }
        });
    }
    RelationshipWidget.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    RelationshipWidget.prototype.onSetPanelSize = function (event) {
        this.resizeService.announceResize({ target: "hierarchy-tree", size: event.size });
        this.resizeService.announceResize({ target: "hierarchy-graph", size: event.size });
    };
    RelationshipWidget.prototype.ngOnInit = function () {
        if (this.item) {
            this.Class = this.item.class;
            this.updateRelations();
        }
    };
    RelationshipWidget.prototype.ngOnChanges = function (changes) {
        if (this.item && (this.item.class != this.Class)) {
            this.Class = this.item.class;
            this.updateRelations();
        }
    };
    RelationshipWidget.prototype.updateRelations = function () {
        var privateRelations = new Set(["themes"]);
        this.relationOptions = [];
        if (this.item) {
            var relations = Object.assign({}, this.item.constructor.relationshipShortcuts);
            for (var relation in relations) {
                if (privateRelations.has(relation))
                    continue;
                this.relationOptions.push({ value: relation, selected: false, color: utils_model_1.getColor(relation) });
            }
            if (this.relationOptions.length > 0)
                this.relationOptions[0].selected = true;
        }
        this.relations = new Set(this.relationOptions.filter(function (x) { return x.selected; }).map(function (x) { return x.value; }));
    };
    RelationshipWidget.prototype.selectedRelationsChanged = function (option) {
        var _this = this;
        if (!this.relations.has(option.value) && option.selected)
            this.relations.add(option.value);
        if (this.relations.has(option.value) && !option.selected)
            this.relations.delete(option.value);
        var copy = this.relations; //TODO: use an observable
        setTimeout(function () { _this.relations = new Set(); }, 0);
        setTimeout(function () { _this.relations = copy; }, 0);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RelationshipWidget.prototype, "item", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Set)
    ], RelationshipWidget.prototype, "relations", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RelationshipWidget.prototype, "depth", void 0);
    RelationshipWidget = __decorate([
        core_1.Component({
            selector: 'hierarchy-widget',
            inputs: ['item', 'relations', 'depth'],
            template: "\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        Relations of <strong>{{item?.id}}{{(item)? ': ' + item.name : ''}}</strong>\n      </div>\n      <div class=\"panel-body\">\n          <!--Relations-->\n          <property-toolbar  \n            [options] = \"relationOptions\"\n            [transform] = \"getPropertyLabel\"\n            (selectionChanged) = \"selectedRelationsChanged($event)\">\n          </property-toolbar>\n          \n          <!--Depth-->\n          <div class=\"input-group input-group-sm\" style=\"width: 150px; float: left;\">\n            <span class=\"input-group-addon\" id=\"basic-addon1\">Depth</span>\n            <input type=\"number\" class=\"form-control\" aria-describedby=\"basic-addon1\"\n              min=\"0\" max=\"50\" [(ngModel)]=\"depth\" >\n          </div>\n          \n          <!--Layout-->\n          <div class=\"btn-group\">\n            <button type=\"button\" class=\"btn btn-default btn-icon\" \n              [ngClass]=\"{'active': layout == 'tree'}\" (click)=\"layout = 'tree'\">\n              <img class=\"icon\" src=\"images/tree.png\"/>\n            </button>\n            <button type=\"button\" class=\"btn btn-default btn-icon\" \n              [ngClass]=\"{'active': layout == 'graph'}\" (click)=\"layout = 'graph'\">\n              <img class=\"icon\" src=\"images/graph.png\"/>\n            </button>\n          </div>\n\n        <hierarchy-tree *ngIf=\"layout == 'tree'\" \n          [item]=\"item\" [relations]=\"relations\" [depth]=\"depth\"></hierarchy-tree>\n        <hierarchy-graph *ngIf=\"layout == 'graph'\" \n          [item]=\"item\" [relations]=\"relations\" [depth]=\"depth\"></hierarchy-graph>\n      </div>     \n    </div>\n  ",
            directives: [view_relationGraph_1.RelationshipGraph, view_relationTree_1.RelationshipTree,
                dropdown_1.DROPDOWN_DIRECTIVES, common_1.CORE_DIRECTIVES, toolbar_propertySettings_1.PropertyToolbar]
        }), 
        __metadata('design:paramtypes', [service_resize_1.ResizeService])
    ], RelationshipWidget);
    return RelationshipWidget;
}());
exports.RelationshipWidget = RelationshipWidget;
//# sourceMappingURL=widget.relations.js.map