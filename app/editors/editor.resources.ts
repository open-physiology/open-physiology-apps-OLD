import {Component, ElementRef} from '@angular/core';
import {RepoGeneral} from '../repos/repo.general';
import {RepoNested} from '../repos/repo.nested';
import {RelationshipWidget} from '../widgets/widget.relations';
import {ResourceWidget} from '../widgets/widget.resource';
import {ResizeService} from '../services/service.resize';
import {Subscription}   from 'rxjs/Subscription';
import {SetToArray, HideClass} from "../transformations/pipe.general";
import {model} from "../services/utils.model";
import {HighlightService} from "../services/service.highlight";
//import {NgCytoscape} from '../components/component.cytoscape';

import 'rxjs/add/operator/map';

declare var GoldenLayout:any;
declare var $: any;

@Component({
  selector: 'app',
  providers: [ResizeService, HighlightService],
  template: `
     <!--<ng2-cytoscape></ng2-cytoscape>-->

    <repo-general id="repo"
      [items]="items | setToArray" 
      [caption]="'Resources'" 
      (selectedItemChange)="onItemSelected($event)">
    </repo-general>
    <hierarchy-widget id = "hierarchy" [item]="selectedItem"></hierarchy-widget>
    <resource-widget id = "resource" [item]="selectedItem"></resource-widget>   
    <div id="main"></div>
  `,
  styles: [`#main {width: 100%; height: 100%; border: 0; margin: 0; padding: 0}`],
  directives: [RepoGeneral, RepoNested, RelationshipWidget, ResourceWidget/*, NgCytoscape*/],
  pipes: [SetToArray]
})
export class ResourceEditor {
  items:Array<any>;
  selectedItem:any;

  layoutConfig = {
    settings: {
      hasHeaders: false,
      constrainDragToContainer: true,
      reorderEnabled: true,
      showMaximiseIcon: true,
      showCloseIcon: true,
      selectionEnabled: false,
      popoutWholeStack: false,
      showPopoutIcon: false
    },
    dimensions: {
      borderWidth: 2
    },
    content: [{
      type: 'row',
      content: [
        {
          type: 'component',
          componentName: 'RepoPanel'
        },
        {
          type: 'column',
          content: [
            {
              type: 'component',
              componentName: 'HierarchyPanel'
            },
            {
              type: 'component',
              componentName: 'ResourcePanel'
            }
          ],
          width: 50
        }
      ]
    }]
  };

  mainLayout:any;

  rs: Subscription;
  ts: Subscription;

  constructor(private resizeService:ResizeService, private highlightService: HighlightService, public el:ElementRef) {
    this.rs = model.Resource.p('all').subscribe(
      (data: any) => {
        this.items = data;
      });

    let self = this;
    (async function() {

      // /*Lyphs*/
      // let renalH = model.Lyph.new({name: "Renal hilum"});
      // let renalP = model.Lyph.new({name: "Renal parenchyma"});
      // let renalC = model.Lyph.new({name: "Renal capsule"});
      // let cLyphsGroup = [renalH, renalP, renalC];
      // await Promise.all(cLyphsGroup.map(p => p.commit()));
      //
      // let kidney = model.Lyph.new({name: "Kidney", layers: cLyphsGroup});
      // await kidney.commit();
      //
      // let kidneyLobus = model.Lyph.new({name: "Kidney lobus"});
      // await kidneyLobus.commit();
      //
      // let cytosol = model.Lyph.new({name: "Cytosol"});
      // await cytosol.commit();
      //
      // let plasmaM = model.Lyph.new({name: "Plasma membrain"});
      // await plasmaM.commit();
      //
      // let cell = model.Lyph.new({name: "Cell", layers: [cytosol, plasmaM]});
      // await cell.commit();
      //
      // let plasmaMType = model.Type.new({name: "Plasma membrain type", definition: plasmaM});
      // await plasmaMType.commit();
      //
      // let cellType = model.Type.new({name: "Cell type", definition: cell});
      // await cellType.commit();
      //
      // let sln = model.CanonicalTree.new({name: "Short Looped Nephrone"});
      // await sln.commit();
      //
      // let sln1 = model.CanonicalTree.new({name: "SLN tail 1"});
      // await sln1.commit();
      //
      // let sln2 = model.CanonicalTree.new({name: "SLN tail 2"});
      // await sln2.commit();
      //
      // let branch1 = model.CanonicalTreeBranch.new({name: "SLN level 1",
      //   parentTree: sln, childTree: sln1, conveyingLyphType: cellType});
      // await branch1.commit();
      //
      // let branch2 = model.CanonicalTreeBranch.new({name: "SLN level 2",
      //   parentTree: sln1, childTree: sln2, conveyingLyphType: plasmaMType});
      // await branch2.commit();

      let extracted = await model.Lyph.getAll();

      const resources = {};
      const relationships = {};

      for (let [key, value] of Object.entries(model)){
        if (value.isResource) {resources[key] = value;}
        if (value.isRelationship) {relationships[key] = value;}
      }

      console.log("Resources", resources);
      console.log("Relationships", relationships);

    })();

  }
  ngOnDestroy() {
    this.rs.unsubscribe();
  }

  onItemSelected(item:any) {
    setTimeout(() => {
      this.selectedItem = null;
    }, 0);
    setTimeout(() => {
      this.selectedItem = item;
    }, 0);
  }

  ngOnInit() {
    let self = this;
    let main = $('app > #main');
    this.mainLayout = new GoldenLayout(this.layoutConfig, main);

    this.mainLayout.registerComponent('RepoPanel', function (container:any, componentState:any) {
      let panel = container.getElement();
      let content = $('app > #repo');
      content.detach().appendTo(panel);
    });

    this.mainLayout.registerComponent('HierarchyPanel', function (container:any, componentState:any) {
      let panel = container.getElement();
      let component = $('app > #hierarchy');
      component.detach().appendTo(panel);
      //Notify components about window resize
      container.on('open', function() {
        let size = {width: container.width, height: container.height};
        self.resizeService.announceResize({target: "hierarchy-widget", size: size});
      });
      container.on('resize', function() {
        let size = {width: container.width, height: container.height};
        self.resizeService.announceResize({target: "hierarchy-widget", size: size});
      });
    });

    this.mainLayout.registerComponent('ResourcePanel', function (container:any, componentState:any) {
      let panel = container.getElement();
      let component = $('app > #resource');
      component.detach().appendTo(panel);

      //Notify components about window resize
      container.on('open', function(){
        let size = {width: container.width, height: container.height};
        self.resizeService.announceResize({target: "resource-widget", size: size}) ;
      });
      container.on('resize', function(){
        let size = {width: container.width, height: container.height};
        self.resizeService.announceResize({target: "resource-widget", size: size}) ;
      });
    });
    this.mainLayout.init();
  }
}


