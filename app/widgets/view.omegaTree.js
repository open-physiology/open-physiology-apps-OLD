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
 * Created by Natallia on 7/14/2016.
 */
var core_1 = require('@angular/core');
var service_resize_1 = require('../services/service.resize');
var utils_model_1 = require("../services/utils.model");
var lyph_edit_widget_1 = require("lyph-edit-widget");
var OmegaTreeWidget = (function () {
    function OmegaTreeWidget(renderer, el, resizeService) {
        var _this = this;
        this.renderer = renderer;
        this.el = el;
        this.resizeService = resizeService;
        this.vp = { size: { width: 600, height: 400 },
            margin: { x: 20, y: 20 },
            node: { size: { width: 40, height: 40 } } };
        this.subscription = resizeService.resize$.subscribe(function (event) {
            if (event.target == "omega-tree") {
                _this.setPanelSize(event.size);
            }
        });
    }
    OmegaTreeWidget.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    OmegaTreeWidget.prototype.setPanelSize = function (size) {
        var delta = 10;
        if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)) {
            this.vp.size = { width: size.width, height: size.height - 40 };
            if (this.svg) {
                this.draw(this.svg, this.vp, this.data);
            }
        }
    };
    OmegaTreeWidget.prototype.ngOnChanges = function (changes) {
        this.svg = d3.select(this.el.nativeElement).select('svg');
        if (this.item) {
            this.data = this.getOmegaTreeData(this.item);
            this.draw(this.svg, this.vp, this.data);
        }
        else {
            this.data = {};
            this.svg.selectAll(".tree").remove();
        }
    };
    OmegaTreeWidget.prototype.draw = function (svg, vp, data) {
        var w = vp.size.width - 2 * vp.margin.x;
        var h = vp.size.height - 2 * vp.margin.y;
        svg.selectAll(".tree").remove();
        var tree = d3.layout.tree().size([w, h]);
        var diagonal = d3.svg.diagonal().projection(function (d) { return [d.x, d.y]; });
        var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 2])
            .on("zoom", zoomed);
        var drag = d3.behavior.drag()
            .origin(function (d) { return d; })
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended);
        function zoomed() {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);
        }
        function dragged(d) {
            d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        }
        function dragended(d) {
            d3.select(this).classed("dragging", false);
        }
        var treeSvg = svg.append("g").attr("class", "tree").attr("width", vp.size.width).attr("height", vp.size.height)
            .attr("transform", "translate(" + vp.margin.x + "," + vp.margin.y + ")")
            .call(zoom);
        var svgGroup = treeSvg.append("g");
        var nodes = tree.nodes(data);
        var links = tree.links(nodes);
        var link = svgGroup.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("stroke", function (d) { return utils_model_1.getColor(d.relation); })
            .attr("d", diagonal);
        var node = svgGroup.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 4.5)
            .style("fill", function (d) { return utils_model_1.getColor(d.class); })
            .attr("transform", transform);
        var dx = vp.node.size.width / 2;
        var dy = vp.node.size.height / 2;
        var icon = svgGroup.selectAll(".icon")
            .data(links)
            .enter()
            .append("g")
            .attr("class", "icon")
            .each(function (d) {
            if (d.target) {
                var position = { x: (d.source.x + d.target.x) / 2 - dx, y: (d.source.y + d.target.y) / 2 - dy };
                if (d.target.resource.class == utils_model_1.ResourceName.OmegaTree) {
                    svgGroup.append("image")
                        .attr("xlink:href", utils_model_1.getIcon(utils_model_1.ResourceName.OmegaTree))
                        .attr("x", position.x + dx - 12).attr("y", position.y + dy - 12)
                        .attr("width", 24).attr("height", 24);
                }
                else {
                    var model_1 = new lyph_edit_widget_1.LyphRectangle({ model: d.target.resource,
                        x: position.x, y: position.y, width: vp.node.size.width, height: vp.node.size.height });
                    $(svgGroup.node()).append(model_1.element);
                    var lyph = d3.select(model_1.element).attr("transform", "rotate(" + 90 + ',' + (position.x + dx) + ',' + (position.y + dy) + ")");
                }
            }
        });
        var text = svgGroup.selectAll("nodeLabel")
            .data(links)
            .enter()
            .append("g")
            .attr("class", "nodeLabel")
            .append("text")
            .attr("dx", -5)
            .style("text-anchor", "end")
            .attr("x", function (d) { return (d.source.x + d.target.x) / 2 - dx; })
            .attr("y", function (d) { return (d.source.y + d.target.y) / 2; })
            .text(function (d) { return ("level " + (d.target.depth) + ": " + d.target.name); });
        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }
    };
    OmegaTreeWidget.prototype.getOmegaTreeData = function (item) {
        if (!item)
            return {};
        function linkParts(root, item) {
            var relations = new Set().add("parts");
            var treeData = utils_model_1.getTreeData(item, relations, -1); //creates structure for d3 tree out of item.parts
            var parts = treeData.children;
            var queue = [root];
            if (!parts)
                return queue;
            parts.sort(function (a, b) { return utils_model_1.compareLinkedParts(a.resource, b.resource); });
            var _loop_1 = function(i) {
                var child = { id: parts[i].id, name: parts[i].name, resource: parts[i].resource };
                var link = parts[i].resource.treeParent;
                if (!link) {
                    root.children.push(child);
                    child.parent = root;
                }
                else {
                    var parent_1 = queue.find(function (x) { return (x.resource == link); });
                    if (parent_1) {
                        if (!parent_1.children)
                            parent_1.children = [];
                        parent_1.children.push(child);
                        child.parent = parent_1;
                    }
                }
                if (!queue.find(function (x) { return (x.resource === parts[i].resource); })) {
                    queue.push(child);
                }
            };
            for (var i = 0; i < parts.length; i++) {
                _loop_1(i);
            }
            return queue;
        }
        var root = { id: "#0", name: item.name, children: [] };
        var tree = linkParts(root, item);
        var subtrees = tree.filter(function (x) { return (x.resource && (x.resource.class === utils_model_1.ResourceName.OmegaTree)); });
        while (subtrees.length > 0) {
            for (var _i = 0, subtrees_1 = subtrees; _i < subtrees_1.length; _i++) {
                var subtree = subtrees_1[_i];
                var subtreeRoot = subtree.parent;
                if (subtreeRoot) {
                    var i = subtreeRoot.children.indexOf(subtree);
                    if (i > -1)
                        subtreeRoot.children.splice(i, 1);
                }
                if (subtree.resource.type) {
                    var expandedTree = linkParts(subtreeRoot, subtree.resource.type);
                    //replace subtree in the main tree with expanded view
                    if (expandedTree) {
                        if (subtree.children) {
                            //relink items following the expanded tree to its leaves
                            for (var _a = 0, _b = subtree.children; _a < _b.length; _a++) {
                                var next = _b[_a];
                                var leaves = expandedTree.filter(function (x) { return !x.children; });
                                if (leaves.length > 0) {
                                    next.parent = leaves[0];
                                    for (var j = 1; j < leaves.length; j++) {
                                    }
                                }
                            }
                        }
                    }
                }
            }
            subtrees = tree.filter(function (x) { return (x.resource && (x.resource.class === utils_model_1.ResourceName.OmegaTree)); });
        }
        return tree[0];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], OmegaTreeWidget.prototype, "item", void 0);
    OmegaTreeWidget = __decorate([
        core_1.Component({
            selector: 'omega-tree',
            inputs: ['item'],
            template: "\n     <div class=\"panel-body\">\n        <svg #treeSvg class=\"svg-widget\"></svg>\n     </div>\n  ",
            directives: []
        }), 
        __metadata('design:paramtypes', [core_1.Renderer, core_1.ElementRef, service_resize_1.ResizeService])
    ], OmegaTreeWidget);
    return OmegaTreeWidget;
}());
exports.OmegaTreeWidget = OmegaTreeWidget;
//# sourceMappingURL=view.omegaTree.js.map