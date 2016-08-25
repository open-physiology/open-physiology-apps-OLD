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
var core_1 = require('@angular/core');
var ng2_nvd3_1 = require('ng2-nvd3/lib/ng2-nvd3');
var service_resize_1 = require('../services/service.resize');
var utils_model_1 = require("../services/utils.model");
var RelationshipGraph = (function () {
    function RelationshipGraph(renderer, el, resizeService) {
        this.renderer = renderer;
        this.el = el;
        this.resizeService = resizeService;
        this.relations = new Set();
        this.depth = -1;
        this.active = true;
        this.vp = { size: { width: 600, height: 400 },
            margin: { x: 20, y: 20 },
            node: { size: { width: 40, height: 20 } } };
        var self = this;
        this.subscription = resizeService.resize$.subscribe(function (event) {
            if (event.target == "hierarchy-graph") {
                self.setPanelSize(event.size);
            }
        });
    }
    RelationshipGraph.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    RelationshipGraph.prototype.ngOnInit = function () {
        if (this.item)
            this.setGraphOptions();
    };
    RelationshipGraph.prototype.ngOnChanges = function (changes) {
        if (this.item) {
            this.data = utils_model_1.getGraphData(this.item, this.relations, this.depth);
        }
        else {
            this.data = {};
        }
    };
    RelationshipGraph.prototype.setPanelSize = function (size) {
        var _this = this;
        var delta = 10;
        if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)) {
            this.vp.size = size;
            if (this.graphOptions) {
                this.graphOptions.width = this.vp.size.width;
                this.graphOptions.height = this.vp.size.height;
                setTimeout(function () { _this.active = false; }, 0);
                setTimeout(function () { _this.active = true; }, 0);
            }
        }
    };
    RelationshipGraph.prototype.setGraphOptions = function () {
        var properties = Object.assign({}, this.item.constructor.properties);
        function formatValue(value) {
            var res = "[";
            for (var i = 0; i < value.length; i++) {
                res += "{" + ((value[i].id) ? value[i].id : "?") + ": " + value[i].name + "}" + ",";
            }
            res = res.replace(/,\s*$/, "");
            res += "]";
            return res;
        }
        this.graphOptions = {
            chart: {
                type: 'forceDirectedGraph',
                width: this.vp.size.width,
                height: this.vp.size.height,
                margin: { top: 20, right: 20, bottom: 20, left: 20 },
                radius: 0,
                nodeExtras: function (node) {
                    node && node
                        .append("text")
                        .attr("dx", 10)
                        .attr("dy", ".35em")
                        .text(function (d) { return d.name; })
                        .attr("class", "nodeLabel");
                    node && node
                        .append("image")
                        .attr("xlink:href", function (d) { return utils_model_1.getIcon(d.class); })
                        .attr("x", -8).attr("y", -8)
                        .attr("width", 16).attr("height", 16);
                },
                linkExtras: function (link) {
                    link.attr("class", "link").attr("stroke", function (d) { return utils_model_1.getColor(d.relation); });
                }
            }
        };
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RelationshipGraph.prototype, "item", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Set)
    ], RelationshipGraph.prototype, "relations", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RelationshipGraph.prototype, "depth", void 0);
    RelationshipGraph = __decorate([
        core_1.Component({
            selector: 'hierarchy-graph',
            inputs: ['item', 'relations', 'depth'],
            template: "\n    <div class=\"panel-body\">\n      <nvd3 *ngIf=\"active\" [options]=\"graphOptions\" [data]=\"data\"></nvd3>\n    </div>\n  ",
            directives: [ng2_nvd3_1.nvD3],
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, service_resize_1.ResizeService])
    ], RelationshipGraph);
    return RelationshipGraph;
}());
exports.RelationshipGraph = RelationshipGraph;
//# sourceMappingURL=view.relationGraph.js.map