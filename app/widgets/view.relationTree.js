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
var service_resize_1 = require('../services/service.resize');
var utils_model_1 = require("../services/utils.model");
var RelationshipTree = (function () {
    function RelationshipTree(el, resizeService) {
        var _this = this;
        this.el = el;
        this.resizeService = resizeService;
        this.relations = new Set();
        this.depth = -1;
        this.vp = { size: { width: 600, height: 400 }, margin: { x: 20, y: 20 }, node: { size: { width: 40, height: 20 } } };
        this.selected = new core_1.EventEmitter();
        this.subscription = resizeService.resize$.subscribe(function (event) {
            if (event.target == "hierarchy-tree") {
                _this.setPanelSize(event.size);
            }
        });
    }
    RelationshipTree.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    RelationshipTree.prototype.setPanelSize = function (size) {
        var delta = 10;
        if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)) {
            this.vp.size = { width: size.width, height: size.height - 40 };
            if (this.svg) {
                this.draw(this.svg, this.vp, this.data);
            }
        }
    };
    RelationshipTree.prototype.ngOnChanges = function (changes) {
        this.svg = d3.select(this.el.nativeElement).select('svg');
        if (this.item) {
            this.data = utils_model_1.getTreeData(this.item, this.relations, this.depth);
            this.draw(this.svg, this.vp, this.data);
        }
        else {
            this.data = {};
            this.svg.selectAll(".tree").remove();
        }
    };
    RelationshipTree.prototype.draw = function (svg, vp, data) {
        var w = vp.size.width - 2 * vp.margin.x;
        var h = vp.size.height - 2 * vp.margin.y;
        svg.selectAll(".tree").remove();
        var i = 0;
        var duration = 750;
        var root;
        var nodes = [];
        var links = [];
        var tree = d3.layout.tree().size([h, w]);
        var diagonal = d3.svg.diagonal().projection(function (d) {
            return [d.y, d.x];
        });
        var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 2])
            .on("zoom", zoomed);
        var drag = d3.behavior.drag()
            .origin(function (d) { return d; })
            .on("dragstart", dragStarted)
            .on("drag", dragged)
            .on("dragend", dragEnded);
        function zoomed() {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
        function dragStarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);
        }
        function dragged(d) {
            d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        }
        function dragEnded(d) {
            d3.select(this).classed("dragging", false);
        }
        var treeSvg = svg.append("g").attr("class", "tree")
            .attr("width", vp.size.width).attr("height", vp.size.height)
            .attr("transform", "translate(" + vp.margin.x + "," + vp.margin.y + ")")
            .call(zoom);
        var svgGroup = treeSvg.append("g");
        root = data;
        root.x0 = h / 2;
        root.y0 = 0;
        update(root);
        centerNode(root);
        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
        function expand(d) {
            if (d._children) {
                d.children = d._children;
                d.children.forEach(expand);
                d._children = null;
            }
        }
        function centerNode(source) {
            var x = -source.y0 + vp.size.width / 2;
            var y = -source.x0 + vp.size.height / 2;
            d3.select('g').transition()
                .duration(duration).attr("transform", "translate(" + x + "," + y + ")");
        }
        function toggleChildren(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            return d;
        }
        function click(d) {
            if (d3.event.defaultPrevented)
                return;
            d = toggleChildren(d);
            update(d);
            centerNode(d);
        }
        function update(source) {
            var levelWidth = [1];
            function countChildren(level, node) {
                if (node.children && node.children.length > 0) {
                    if (levelWidth.length <= level + 1)
                        levelWidth.push(0);
                    levelWidth[level + 1] += node.children.length;
                    node.children.forEach(function (d) {
                        countChildren(level + 1, d);
                    });
                }
            }
            countChildren(0, root);
            var newHeight = d3.max(levelWidth) * 40; // 25 pixels per line
            tree = tree.size([newHeight, w]);
            nodes = tree.nodes(root).reverse();
            links = tree.links(nodes);
            nodes.forEach(function (d) { d.y = (d.depth * 80); });
            var node = svgGroup.selectAll("g.node").data(nodes, function (d) { return d.id; });
            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on('click', click);
            nodeEnter.append("image")
                .attr("xlink:href", function (d) { return (d.resource) ? utils_model_1.getIcon(d.resource.class) : "images/resource.png"; })
                .attr("x", 0).attr("y", 0)
                .attr("width", 0).attr("height", 0);
            nodeEnter.append("text")
                .attr("x", function (d) { return d.children || d._children ? -15 : 15; })
                .attr("dy", ".35em")
                .attr('class', 'nodeLabel')
                .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
                .text(function (d) { return d.name; });
            node.select('text')
                .attr("x", function (d) { return d.children || d._children ? -15 : 15; })
                .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
                .text(function (d) { return d.name; });
            node.select("image")
                .attr("x", function (d) { return d._children ? -12 : -8; })
                .attr("y", function (d) { return d._children ? -12 : -8; })
                .attr("width", function (d) { return d._children ? 24 : 16; })
                .attr("height", function (d) { return d._children ? 24 : 16; });
            // Transition nodes to their new position.
            node.transition().duration(duration).attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });
            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition().duration(duration)
                .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            }).remove();
            var link = svgGroup.selectAll("path.link").data(links);
            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("stroke", function (d) { return utils_model_1.getColor(d.target.relation); })
                .attr("d", function () { var o = { x: source.x0, y: source.y0 }; return diagonal({ source: o, target: o }); });
            link.transition().duration(duration).attr("d", diagonal);
            link.exit().transition().duration(duration)
                .attr("d", function () { var o = { x: source.x, y: source.y }; return diagonal({ source: o, target: o }); }).remove();
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RelationshipTree.prototype, "item", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Set)
    ], RelationshipTree.prototype, "relations", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RelationshipTree.prototype, "depth", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], RelationshipTree.prototype, "selected", void 0);
    RelationshipTree = __decorate([
        core_1.Component({
            selector: 'hierarchy-tree',
            inputs: ['item', 'relations', 'depth'],
            template: "\n    <div class=\"panel-content\">\n      <svg #treeSvg class=\"svg-widget\"></svg>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, service_resize_1.ResizeService])
    ], RelationshipTree);
    return RelationshipTree;
}());
exports.RelationshipTree = RelationshipTree;
//# sourceMappingURL=view.relationTree.js.map