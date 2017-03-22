"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var open_physiology_model_1 = require("open-physiology-model");
function ajaxBackend() {
    /* a way for test suites to register the environment to these mock-handlers */
    var environment, ajax, baseURL;
    function register(_a) {
        var e = _a.environment, ajx = _a.ajax, burl = _a.baseURL;
        environment = e;
        ajax = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return Promise.resolve(ajx.apply(void 0, args));
        };
        baseURL = burl;
    }
    /* the interface to hand to the library when instantiating a module */
    var backend = {
        commit_new: function (_a) {
            var values = _a.values;
            var cls = exports.model[values.class];
            var classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
            console.log("Committing value", JSON.stringify(values));
            return ajax({
                url: baseURL + "/" + classPath,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(values)
            });
        },
        commit_edit: function (_a) {
            var entity = _a.entity, newValues = _a.newValues;
            var cls = entity.constructor;
            var classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
            return ajax({
                url: entity.href ||
                    baseURL + "/" + classPath + "/" + entity.id,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newValues)
            });
        },
        commit_delete: function (_a) {
            var entity = _a.entity;
            var cls = entity.constructor;
            var classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
            return ajax({
                url: entity.href ||
                    baseURL + "/" + classPath + "/" + entity.id,
                method: 'DELETE',
                contentType: 'application/json'
            });
        },
        load: function (addresses, options) {
            if (options === void 0) { options = {}; }
            //TODO: this is a quick implementation for testing, needs rewriting to stack requests for the same entity class
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    var responses = [];
                    yield Promise.all(Object.values(addresses).map(function (address) {
                        var cls = address.class;
                        var classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
                        var href2Id = function (href) { return Number.parseInt(href.substring(href.lastIndexOf("/") + 1)); };
                        var id = href2Id(address.href);
                        ajax({
                            url: baseURL + "/" + classPath + "/" + id,
                            method: 'GET',
                            contentType: 'application/json'
                        }).then(function (res) {
                            responses.push(res);
                        }).catch(function (e) {
                            console.log("Error in load ", address);
                            throw e;
                        });
                    }));
                    return responses;
                });
            })();
        },
        loadAll: function (cls, options) {
            if (options === void 0) { options = {}; }
            return ajax({
                url: baseURL + "/" + (cls.isResource ? cls.plural : cls.name),
                method: 'GET',
                contentType: 'application/json'
            });
        }
    };
    return { backend: backend, register: register };
}
var _a = ajaxBackend(), backend = _a.backend, register = _a.register;
exports.modelRef = open_physiology_model_1.default(backend);
register({
    environment: exports.modelRef,
    baseURL: 'http://localhost:8888',
    ajax: $.ajax
});
exports.model = exports.modelRef.classes;
window.module = exports.modelRef;
///////////////////////////////////////////////////
//Helpers
//////////////////////////////////////////////////
function toCamelCase(str) {
    return str.replace(/\s(.)/g, function (l) {
        return l.toUpperCase();
    }).replace(/\s/g, '').replace(/^(.)/, function (l) {
        return l.toLowerCase();
    });
}
function getResourceClass(item) {
    if (item.class === ResourceName.Lyph) {
        if (item.axis)
            return ResourceName.LyphWithAxis;
    }
    return item.class;
}
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
/////////////////////////////////////////////
//Interface labels and graphical appearance
/////////////////////////////////////////////
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
    ResourceName[ResourceName["CanonicalTree"] = "CanonicalTree"] = "CanonicalTree";
    ResourceName[ResourceName["CanonicalTreeBranch"] = "CanonicalTreeBranch"] = "CanonicalTreeBranch";
    ResourceName[ResourceName["Publication"] = "Publication"] = "Publication";
    ResourceName[ResourceName["Correlation"] = "Correlation"] = "Correlation";
    ResourceName[ResourceName["ClinicalIndex"] = "ClinicalIndex"] = "ClinicalIndex";
    ResourceName[ResourceName["Coalescence"] = "Coalescence"] = "Coalescence";
    ResourceName[ResourceName["CoalescenceScenario"] = "CoalescenceScenario"] = "CoalescenceScenario";
})(exports.ResourceName || (exports.ResourceName = {}));
var ResourceName = exports.ResourceName;
function getPropertyLabel(option) {
    var custom = {
        "href": "Reference",
        "externals": "Annotations",
        "locals": "Local resources"
    };
    if (custom[option])
        return custom[option];
    if (["id", "uri"].includes(option))
        return option.toUpperCase();
    var label = option.replace(/([a-z])([A-Z])/g, '$1 $2');
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
function getIcon(clsName) {
    return "images/" + toCamelCase(clsName) + ".png";
}
exports.getIcon = getIcon;
function getResourceIcon(item) {
    var clsName = getResourceClass(item);
    if (clsName === "Type") {
        clsName = item.definition.class;
    }
    return "images/" + toCamelCase(clsName) + ".png";
}
exports.getResourceIcon = getResourceIcon;
//////////////////////////////////////////////
//Derivation of hierarchies
//////////////////////////////////////////////
function getCanonicalTreeData(item, depth) {
    if (depth === void 0) { depth = -1; }
    //Format: {id: 1, name: "Parent", children: [{id: 2, name: "Child"},...]};
    if (!item) {
        return {};
    }
    var data = { id: item.id, name: item.name, resource: item, children: [] };
    var i = 0;
    traverse(item, 0, data);
    return data;
    function traverse(root, level, data) {
        if (!root || !root.childBranches || (depth === level)) {
            return;
        }
        if (!data.children)
            data.children = [];
        for (var _i = 0, _a = Array.from(root.childBranches); _i < _a.length; _i++) {
            var branch = _a[_i];
            var item_1 = branch.childTree;
            if (!item_1) {
                continue;
            }
            var child = { id: "#" + ++i, name: item_1.name, parentBranch: branch, depth: level };
            data.children.push(child);
            traverse(item_1, level + 1, child);
        }
    }
}
exports.getCanonicalTreeData = getCanonicalTreeData;
function getTreeData(item, relations, depth) {
    if (depth === void 0) { depth = -1; }
    //Format: {id: 1, name: "Parent", children: [{id: 2, name: "Child"},...]};
    if (!item) {
        return {};
    }
    var data = { id: item.id, name: item.name, resource: item, children: [] };
    var i = 0;
    traverse(item, 0, data);
    return data;
    function traverse(root, level, data) {
        if (!root)
            return;
        for (var _i = 0, _a = Array.from(relations); _i < _a.length; _i++) {
            var fieldName = _a[_i];
            if (!root[fieldName]) {
                continue;
            }
            if (depth === level) {
                return;
            }
            if (!data.children)
                data.children = [];
            var objects = (root[fieldName] instanceof Set) ? Array.from(root[fieldName]) : [root[fieldName]];
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
    if (depth === void 0) { depth = -1; }
    var data = { nodes: [], links: [] };
    if (!item)
        return data;
    data.nodes.push(item);
    traverse(item, depth, data);
    return data;
    function traverse(root, depth, data) {
        if (!root)
            return;
        if (depth === 0)
            return;
        for (var _i = 0, _a = Array.from(relations); _i < _a.length; _i++) {
            var fieldName = _a[_i];
            if (!root[fieldName])
                continue;
            var children = Array.from(root[fieldName]);
            for (var _b = 0, children_1 = children; _b < children_1.length; _b++) {
                var child = children_1[_b];
                data.links.push({ source: root, target: child, relation: fieldName });
                if (data.nodes.indexOf(child) === -1) {
                    data.nodes.push(child);
                    traverse(child, depth - 1, data);
                }
            }
        }
    }
}
exports.getGraphData = getGraphData;
//# sourceMappingURL=utils.model.js.map