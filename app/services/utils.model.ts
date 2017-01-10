import modelFactory from "open-physiology-model";
export const modelRef = modelFactory();
export const model = modelRef.classes;
window.module = modelRef;

declare var d3:any;

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



