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
 * Created by Natallia on 7/7/2016.
 */
var core_1 = require('@angular/core');
var directive_dynamicLoader_1 = require("../directives/directive.dynamicLoader");
var Node = (function () {
    function Node() {
    }
    Node = __decorate([
        core_1.Component({
            selector: '[node]',
            inputs: ['x', 'y'],
            template: "\n    <svg:circle [attr.r]=\"radius\" [attr.cx]=\"x\" [attr.cy]=\"y\" stroke=\"white\" fill=\"steelblue\"></svg:circle>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], Node);
    return Node;
}());
exports.Node = Node;
var List = (function () {
    function List() {
    }
    __decorate([
        core_1.ContentChild(core_1.TemplateRef), 
        __metadata('design:type', core_1.TemplateRef)
    ], List.prototype, "contentTemplate", void 0);
    List = __decorate([
        core_1.Component({
            selector: 'list',
            inputs: ['items'],
            template: "<template ngFor [ngForOf]=\"items\" [ngForTemplate]=\"contentTemplate\"></template>"
        }), 
        __metadata('design:paramtypes', [])
    ], List);
    return List;
}());
exports.List = List;
var DynamicList = (function () {
    function DynamicList(vc) {
        this.target = vc;
    }
    DynamicList = __decorate([
        core_1.Component({
            selector: 'dynamic-list',
            inputs: ['items', 'renderer'],
            template: "\n      <g *ngFor=\"let item of items; let i = index\" dcl-wrapper [target]=\"target\" [type]=\"renderer[i]\" [input]=\"item\"></g>\n ",
            directives: [directive_dynamicLoader_1.DynamicLoader]
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef])
    ], DynamicList);
    return DynamicList;
}());
exports.DynamicList = DynamicList;
function getListData(item, property, depth) {
    var data = {};
    if (!item)
        return data;
    if (!depth)
        depth = -1;
    traverse(item, property, depth, data);
    return data;
    function traverse(root, property, depth, data) {
        if (!root)
            return;
        if (!root[property])
            return;
        if (depth == 0)
            return root;
        var children = root[property];
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            if (data.indexOf(child) == -1)
                data.push(child);
            traverse(child, property, depth - 1, data);
        }
    }
}
//# sourceMappingURL=component.test.js.map