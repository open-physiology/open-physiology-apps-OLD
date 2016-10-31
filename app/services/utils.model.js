"use strict";
var open_physiology_model_1 = require("open-physiology-model");
exports.modelRef = open_physiology_model_1.default();
exports.model = exports.modelRef.classes;
window.module = exports.modelRef;
exports.getColor = d3.scale.category20();
(function (ResourceName) {
    ResourceName[ResourceName["ExternalResource"] = "ExternalResource"] = "ExternalResource";
    ResourceName[ResourceName["Material"] = "Material"] = "Material";
    ResourceName[ResourceName["Lyph"] = "Lyph"] = "Lyph";
    ResourceName[ResourceName["LyphWithAxis"] = "LyphWithAxis"] = "LyphWithAxis";
    ResourceName[ResourceName["Process"] = "Process"] = "Process";
    ResourceName[ResourceName["Measurable"] = "Measurable"] = "Measurable";
    ResourceName[ResourceName["Causality"] = "Causality"] = "Causality";
    ResourceName[ResourceName["Node"] = "Node"] = "Node";
    ResourceName[ResourceName["Border"] = "Border"] = "Border";
    ResourceName[ResourceName["Group"] = "Group"] = "Group";
    ResourceName[ResourceName["OmegaTree"] = "OmegaTree"] = "OmegaTree";
    ResourceName[ResourceName["Publication"] = "Publication"] = "Publication";
    ResourceName[ResourceName["Correlation"] = "Correlation"] = "Correlation";
    ResourceName[ResourceName["ClinicalIndex"] = "ClinicalIndex"] = "ClinicalIndex";
    ResourceName[ResourceName["Coalescence"] = "Coalescence"] = "Coalescence";
    ResourceName[ResourceName["CoalescenceScenario"] = "CoalescenceScenario"] = "CoalescenceScenario";
})(exports.ResourceName || (exports.ResourceName = {}));
var ResourceName = exports.ResourceName;
function getPropertyLabel(option) {
    var toUpperCase = new Set(["id", "uri"]);
    if (toUpperCase.has(option))
        return option.toUpperCase();
    if (option == "href")
        return "Reference";
    if (option == "externals")
        return "Annotations";
    if (option == "locals")
        return "Local resources";
    var label = option;
    label = label.replace(/([a-z])([A-Z])/g, '$1 $2');
    label = label[0].toUpperCase() + label.substring(1).toLowerCase();
    return label;
}
exports.getPropertyLabel = getPropertyLabel;
function getClassLabel(option) {
    if (!option)
        return "";
    var label = option;
    label = label.replace(/([a-z])([A-Z])/g, '$1 $2');
    label = label[0].toUpperCase() + label.substring(1).toLowerCase();
    return label;
}
exports.getClassLabel = getClassLabel;
function getIcon(Class) {
    if (Class) {
        var index = Class.indexOf('Type');
        if (index >= 0)
            Class = Class.substring(0, index);
    }
    switch (Class) {
        case ResourceName.ExternalResource: return "images/external.png";
        case ResourceName.Publication: return "images/publication.png";
        case ResourceName.Correlation: return "images/correlation.png";
        case ResourceName.ClinicalIndex: return "images/clinicalIndex.png";
        case ResourceName.Coalescence: return "images/coalescence.png";
        case ResourceName.Material: return "images/material.png";
        case ResourceName.Lyph: return "images/lyph.png";
        case ResourceName.LyphWithAxis: return "images/lyphWithAxis.png";
        case ResourceName.Process: return "images/process.png";
        case ResourceName.Measurable: return "images/measurable.png";
        case ResourceName.Causality: return "images/causality.png";
        case ResourceName.Node: return "images/node.png";
        case ResourceName.Border: return "images/border.png";
        case ResourceName.CoalescenceScenario: return "images/coalescenceScenario.png";
        case ResourceName.Group: return "images/group.png";
        case ResourceName.OmegaTree: return "images/omegaTree.png";
    }
    return "images/resource.png";
}
exports.getIcon = getIcon;
function getItemClass(item) {
    if (item.class == ResourceName.Lyph) {
        if (item.axis)
            return ResourceName.LyphWithAxis;
    }
    return item.class;
}
exports.getItemClass = getItemClass;
function getTreeData(item, relations, depth) {
    //Format: {id: 1, name: "Parent", children: [{id: 2, name: "Child"},...]};
    var data = {};
    if (!item)
        return data;
    data = { id: item.id, name: item.name, resource: item, children: [] };
    if (!depth)
        depth = -1;
    var i = 0;
    traverse(item, 0, data);
    return data;
    function traverse(root, level, data) {
        if (!root)
            return;
        for (var _i = 0, _a = Array.from(relations); _i < _a.length; _i++) {
            var fieldName = _a[_i];
            if (!root[fieldName])
                continue;
            if ((depth - level) == 0)
                return;
            if (!data.children)
                data.children = [];
            var objects = [];
            if (root[fieldName] instanceof Set) {
                objects = Array.from(root[fieldName]);
            }
            else {
                objects.push(root[fieldName]);
            }
            for (var _b = 0, objects_1 = objects; _b < objects_1.length; _b++) {
                var obj = objects_1[_b];
                var child = { id: "#" + ++i, name: obj.name, resource: obj, depth: level, relation: fieldName };
                data.children.push(child);
                traverse(obj, level + 1, child);
            }
        }
    }
}
exports.getTreeData = getTreeData;
function getGraphData(item, relations, depth) {
    var data = { nodes: [], links: [] };
    if (!item)
        return data;
    data.nodes.push(item);
    if (!depth)
        depth = -1;
    traverse(item, depth, data);
    return data;
    function traverse(root, depth, data) {
        if (!root)
            return;
        if (depth == 0)
            return;
        for (var _i = 0, _a = Array.from(relations); _i < _a.length; _i++) {
            var fieldName = _a[_i];
            if (!root[fieldName])
                continue;
            var children = Array.from(root[fieldName]);
            for (var _b = 0, children_1 = children; _b < children_1.length; _b++) {
                var child = children_1[_b];
                data.links.push({ source: root, target: child, relation: fieldName });
                if (data.nodes.indexOf(child) == -1) {
                    data.nodes.push(child);
                    traverse(child, depth - 1, data);
                }
            }
        }
    }
}
exports.getGraphData = getGraphData;
function setsEqual(S, T) {
    for (var _i = 0, S_1 = S; _i < S_1.length; _i++) {
        var x = S_1[_i];
        if (!T.has(x))
            return false;
    }
    for (var _a = 0, T_1 = T; _a < T_1.length; _a++) {
        var x = T_1[_a];
        if (!S.has(x))
            return false;
    }
    return true;
}
exports.setsEqual = setsEqual;
function compareLinkedParts(a, b) {
    var res = 0;
    if (!a.treeParent) {
        if (!b.treeParent)
            res = 0;
        else
            res = -1;
    }
    if (!b.treeParent)
        res = 1;
    if (b.treeParent == a)
        res = -1;
    if (a.treeParent == b)
        res = 1;
    return res;
}
exports.compareLinkedParts = compareLinkedParts;
function getOmegaTreeData(item) {
    if (!item)
        return {};
    function linkParts(root, item) {
        var relations = new Set().add("parts");
        var treeData = getTreeData(item, relations, -1); //creates structure for d3 tree out of item.parts
        var parts = treeData.children;
        var queue = [root];
        if (!parts)
            return queue;
        parts.sort(function (a, b) { return compareLinkedParts(a.resource, b.resource); });
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
    var subtrees = tree.filter(function (x) { return (x.resource && (x.resource.class == ResourceName.OmegaTree)); });
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
                            }
                        }
                    }
                }
            }
        }
        subtrees = tree.filter(function (x) { return (x.resource && (x.resource.class == ResourceName.OmegaTree)); });
    }
    return tree[0];
}
exports.getOmegaTreeData = getOmegaTreeData;
//# sourceMappingURL=utils.model.js.map