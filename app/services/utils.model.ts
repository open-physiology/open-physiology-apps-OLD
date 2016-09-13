import modelFactory from "open-physiology-model";
export const modelRef = modelFactory();
export const model = modelRef.classes;
window.module = modelRef;

declare var d3:any;
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
  OmegaTree           = <any>"OmegaTree",

  Publication         = <any>"Publication",
  Correlation         = <any>"Correlation",
  ClinicalIndex       = <any>"ClinicalIndex",

  Coalescence         = <any>"Coalescence",
  CoalescenceScenario = <any>"CoalescenceScenario"

}

export function getPropertyLabel(option: string): string{
  let toUpperCase = new Set(["id", "uri"]);
  if (toUpperCase.has(option)) return option.toUpperCase();

  if (option == "href") return "Reference";
  if (option == "externals") return "Annotations";
  if (option == "locals") return "Local resources";

  let label = option;
  label = label.replace(/([a-z])([A-Z])/g, '$1 $2');
  label = label[0].toUpperCase() + label.substring(1).toLowerCase();
  return label;
}

export function getIcon(Class: any): string{
  if (Class){
    let index = Class.indexOf('Type');
    if (index >= 0) Class = Class.substring(0, index);
  }

  switch (Class){
    case ResourceName.ExternalResource : return "images/external.png";
    case ResourceName.Material         : return "images/material.png";
    case ResourceName.Lyph             : //return "images/lyph.png";
    case ResourceName.LyphWithAxis     : return "images/cylindricalLyph.png";

    case ResourceName.Process          : return "images/process.png";
    case ResourceName.Measurable       : return "images/measurable.png";
    case ResourceName.Causality        : return "images/causality.png";
    case ResourceName.Node             : return "images/node.png";
    case ResourceName.Border           : return "images/border.png";
    case ResourceName.Coalescence      : return "images/coalescence.png";
    case ResourceName.CoalescenceScenario      : return "images/coalescenceScenario.png";

    case ResourceName.Group            : return "images/group.png";
    case ResourceName.OmegaTree        : return "images/omegaTree.png";

    case ResourceName.Publication      : return "images/publication.png";
    case ResourceName.Correlation      : return "images/correlation.png";
    case ResourceName.ClinicalIndex    : return "images/clinicalIndex.png";
  }
  return "images/resource.png";
}

export function getTreeData(item: any, relations: Set<string>, depth: number) {//Format: {id: 1, name: "Parent", children: [{id: 2, name: "Child"},...]};
  let data:any = {};
  if (!item) return data;
  data = {id: item.id, name: item.name, resource: item, children: []};
  if (!depth) depth = -1;
  let i = 0;
  traverse(item, 0, data);
  return data;

  function traverse(root:any, level:number, data:any) {
    if (!root) return;
    for (let fieldName of Array.from(relations)){
      if (!root[fieldName]) continue;
      if ((depth - level) == 0) return;
      if (!data.children) data.children = [];


      let objects = [];
      if (root[fieldName] instanceof Set){
        objects = Array.from(root[fieldName]);
      }
      else {
        objects.push(root[fieldName]);
      }

      for (let obj of objects) {
        var child = {id: "#" + ++i, name: obj.name, resource: obj, depth: level, relation: fieldName};
        data.children.push(child);
        traverse(obj, level + 1, child);
      }
    }
  }
}

export function getGraphData(item: any, relations: Set<string>, depth: number) {
  let data:any = {nodes: [], links  : []};
  if (!item) return data;
  data.nodes.push(item);
  if (!depth) depth = -1;
  traverse(item, depth, data);
  return data;

  function traverse(root: any, depth: number, data: any) {
    if (!root) return;
    if (depth == 0) return;
    for (let fieldName of Array.from(relations)) {
      if (!root[fieldName]) continue;
      let children = Array.from(root[fieldName]);

      for (let child of children) {
        data.links.push({source: root, target: child, relation: fieldName});
        if (data.nodes.indexOf(child) == -1) {
          data.nodes.push(child);
          traverse(child, depth - 1, data);
        }
      }
    }
  }
}

export function setsEqual(S, T){
  for (let x of S) if (!T.has(x)) return false;
  for (let x of T) if (!S.has(x)) return false;
  return true;
}

export function compareLinkedParts(a, b){
  let res = 0;
  if (!a.treeParent) {
    if (!b.treeParent) res = 0;
    else res = -1;
  }
  if (!b.treeParent) res = 1;
  if (b.treeParent == a) res = -1;
  if (a.treeParent == b) res = 1;
  return res;
}

