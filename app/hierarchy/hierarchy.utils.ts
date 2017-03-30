/**
 * Created by Natallia on 3/30/2017.
 */

/* Generates a tree of related items with the given depth in the format:
   {id: 1, name: parentName, children: [{id: 2, name: childName},...]};
*/
export function getTreeData(item: any, relations: Set<string>, depth: number = -1) {
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

/* Generates a subgraph of related items with the given depth in the format:
 {nodes: [], links: [{source: sourceItem, target: targetItem, relation: relationType}]};
 */
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
