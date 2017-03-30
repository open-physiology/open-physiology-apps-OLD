/**
 * Created by Natallia on 3/30/2017.
 */
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
