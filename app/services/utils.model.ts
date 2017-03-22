"use strict";

import modelFactory from "open-physiology-model";

declare var $:any;
declare var d3:any;

function ajaxBackend() {
  /* a way for test suites to register the environment to these mock-handlers */
  let environment, ajax, baseURL;
  function register({environment: e, ajax: ajx, baseURL: burl}) {
    environment = e;
    ajax        = (...args) => Promise.resolve(ajx(...args));
    baseURL     = burl;
  }

  /* the interface to hand to the library when instantiating a module */
  const backend = {
    commit_new({values}) {
      let cls = model[values.class];
      let classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
      console.log("Committing value", JSON.stringify(values));
      return ajax({
        url:    `${baseURL}/${classPath}`,
        method: 'POST',
        contentType: 'application/json',
        data:   JSON.stringify(values)
      });
    },
    commit_edit({entity, newValues}) {
      let cls = entity.constructor;
      let classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
      return ajax({
        url:    entity.href ||
        `${baseURL}/${classPath}/${entity.id}`,
        method: 'POST',
        contentType: 'application/json',
        data:   JSON.stringify(newValues)
      });
    },
    commit_delete({entity}) {
      let cls = entity.constructor;
      let classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
      return ajax({
        url:    entity.href ||
        `${baseURL}/${classPath}/${entity.id}`,
        method: 'DELETE',
        contentType: 'application/json'
      });
    },
    load(addresses, options = {}) {
      //TODO: this is a quick implementation for testing, needs rewriting to stack requests for the same entity class
      (async function() {
        let responses = [];
        await Promise.all(Object.values(addresses).map(address => {
          let cls = address.class;
          let classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
          const href2Id = (href) => Number.parseInt(href.substring(href.lastIndexOf("/") + 1));
          let id = href2Id(address.href);
          ajax({
            url:    `${baseURL}/${classPath}/${id}`,
            method: 'GET',
            contentType: 'application/json'
          }).then((res) => {
            responses.push(res);
          }).catch((e) => {
            console.log("Error in load ", address);
            throw e;
          });
        }));
        return responses;
      })();
    },
    loadAll(cls, options = {}) {
      return ajax({
        url:    `${baseURL}/${cls.isResource ? cls.plural : cls.name}`,
        method: 'GET',
        contentType: 'application/json'
      })
    }
  };

  return { backend, register };
}

let {backend, register} = ajaxBackend();

export const modelRef = modelFactory(backend);
register({
  environment: modelRef,
  baseURL:     'http://localhost:8888',
  ajax:        $.ajax
});


export const model = modelRef.classes;
window.module = modelRef;


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

function getResourceClass(item: any){
  if (item.class === ResourceName.Lyph){
    if (item.axis) return ResourceName.LyphWithAxis;
  }
  return item.class;
}

function setsEqual(S, T){
  for (let x of S) if (!T.has(x)) return false;
  for (let x of T) if (!S.has(x)) return false;
  return true;
}

/////////////////////////////////////////////
//Interface labels and graphical appearance
/////////////////////////////////////////////

export const getColor = d3.scale.category20();

export enum ResourceName {
  ExternalResource    = <any>"ExternalResource",

  Material            = <any>"Material",
  Lyph                = <any>"Lyph",
  LyphWithAxis        = <any>"LyphWithAxis", //= Lyph + options

  Process             = <any>"Process",
  Measurable          = <any>"Measurable",
  Causality           = <any>"Causality",
  Node                = <any>"Node",
  Border              = <any>"Border",

  Group               = <any>"Group",
  CanonicalTree       = <any>"CanonicalTree",
  CanonicalTreeBranch = <any>"CanonicalTreeBranch",

  Publication         = <any>"Publication",
  Correlation         = <any>"Correlation",
  ClinicalIndex       = <any>"ClinicalIndex",

  Coalescence         = <any>"Coalescence",
  CoalescenceScenario = <any>"CoalescenceScenario"
}

export function getPropertyLabel(option: string): string{
  let custom = {
    "href": "Reference",
    "externals": "Annotations",
    "locals": "Local resources"
  };
  if (custom[option]) return custom[option];

  if (["id", "uri"].includes(option)) return option.toUpperCase();

  let label = option.replace(/([a-z])([A-Z])/g, '$1 $2');
  label = label[0].toUpperCase() + label.substring(1).toLowerCase();
  return label;
}

export function getClassLabel(option: string): string{
  if (!option) return "";
  let label = option;
  label = label.replace(/([a-z])([A-Z])/g, '$1 $2');
  label = label[0].toUpperCase() + label.substring(1).toLowerCase();
  return label;
}

export function getIcon(clsName: any): string{
  return "images/" + toCamelCase(clsName) + ".png";
}

export function getResourceIcon(item: any): string{
  let clsName = getResourceClass(item);
  if (clsName === "Type"){ clsName = item.definition.class; }
  return "images/" + toCamelCase(clsName) + ".png";
}


//////////////////////////////////////////////
//Derivation of hierarchies
//////////////////////////////////////////////

export function getCanonicalTreeData(item: any, depth: number = -1){
  //Format: {id: 1, name: "Parent", children: [{id: 2, name: "Child"},...]};
  if (!item) { return {} }
  let data:any = {id: item.id, name: item.name, resource: item, children: []};
  let i = 0;
  traverse(item, 0, data);
  return data;

  function traverse(root:any, level:number, data:any) {
    if (!root || !root.childBranches || (depth === level)) { return; }
    if (!data.children) data.children = [];

    for (let branch of Array.from(root.childBranches)) {
      let item = branch.childTree;
      if (!item) { continue; }
      var child = {id: "#" + ++i, name: item.name, parentBranch: branch, depth: level};
      data.children.push(child);
      traverse(item, level + 1, child);
    }
  }
}

export function getTreeData(item: any, relations: Set<string>, depth: number = -1) {
  //Format: {id: 1, name: "Parent", children: [{id: 2, name: "Child"},...]};
  if (!item) { return {} }
  let data:any = {id: item.id, name: item.name, resource: item, children: []};
  let i = 0;
  traverse(item, 0, data);
  return data;

  function traverse(root:any, level:number, data:any) {
    if (!root) return;
    for (let fieldName of Array.from(relations)){
      if (!root[fieldName]) { continue; }
      if (depth === level) { return; }
      if (!data.children) data.children = [];

      let objects = (root[fieldName] instanceof Set)? Array.from(root[fieldName]): [root[fieldName]];

      for (let obj of objects) {
        var child = {id: "#" + ++i, name: obj.name, resource: obj, depth: level, relation: fieldName};
        data.children.push(child);
        traverse(obj, level + 1, child);
      }
    }
  }
}

export function getGraphData(item: any, relations: Set<string>, depth: number = -1) {
  let data:any = {nodes: [], links  : []};
  if (!item) return data;
  data.nodes.push(item);
  traverse(item, depth, data);
  return data;

  function traverse(root: any, depth: number, data: any) {
    if (!root) return;
    if (depth === 0) return;
    for (let fieldName of Array.from(relations)) {
      if (!root[fieldName]) continue;
      let children = Array.from(root[fieldName]);

      for (let child of children) {
        data.links.push({source: root, target: child, relation: fieldName});
        if (data.nodes.indexOf(child) === -1) {
          data.nodes.push(child);
          traverse(child, depth - 1, data);
        }
      }
    }
  }
}



