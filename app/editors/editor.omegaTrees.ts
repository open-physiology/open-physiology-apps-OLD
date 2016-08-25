import {Component, Inject, ElementRef, Renderer, Output, EventEmitter} from '@angular/core';
import {RepoGeneral} from '../repos/repo.general';
import {RepoNested} from '../repos/repo.nested';
import {RelationshipWidget} from '../widgets/widget.relations';
import {ResourceWidget} from '../widgets/widget.resource';
import {ResizeService} from '../services/service.resize';
import {Subscription}   from 'rxjs/Subscription';
import {ResourceName} from '../services/utils.model';
import {SetToArray} from "../transformations/pipe.general";
import {model} from "../services/utils.model";
import {HighlightService} from "../services/service.highlight";

declare var GoldenLayout:any;
declare var $: any;

@Component({
  selector: 'app',
  providers: [ResizeService, HighlightService],
  template: `
    <repo-general id="omegaTreeRepo"
      [items]="trees | setToArray" 
      [caption]="'Omega trees'"
      [types]="[ResourceName.OmegaTree]"
      (selectedItemChange)="onItemSelected($event)"
      >
    </repo-general>         
    
    <repo-general id="lyphRepo"
      [items]="lyphs | setToArray" 
      [caption]="'Lyphs'" 
      [types]="[ResourceName.Lyph]"
      (selected)="onItemSelected($event)">
    </repo-general>
    
    <hierarchy-widget id = "hierarchy" [item]="selectedItem"></hierarchy-widget>
    <resource-widget id = "resource" [item]="selectedItem"></resource-widget>   
    
    <div id="main"></div>
  `,
  styles: [`#main {width: 100%; height: 100%; border: 0; margin: 0; padding: 0}`],
  directives: [RepoGeneral, RepoNested, RelationshipWidget, ResourceWidget],
  pipes: [SetToArray]
})
export class OmegaTreeEditor {
  protected ResourceName = ResourceName;

  trees        :Array<any> = [];
  lyphs        :Array<any> = [];
  selectedItem :any        = {};

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
          type: 'column',
          content: [
            {
              type: 'component',
              componentName: 'OmegaTreePanel'
            },
            {
              type: 'component',
              componentName: 'LyphPanel'
            }
          ]
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
          ]
        }
      ]
    }]
  };

  mainLayout:any;
  sLyphs: Subscription;
  sOmegaTrees: Subscription;

  constructor(private resizeService:ResizeService, private highlightService: HighlightService, public el:ElementRef) {

    this.sLyphs = model.Lyph.p('all').subscribe(
      (data:any) => {this.lyphs = data;});

    this.sOmegaTrees = model.OmegaTree.p('all').subscribe(
      (data:any) => {this.trees = data;});

    let self = this;
    (async function() {

      /*External resources*/
      let fma7203  = model.ExternalResource.new({name: "FMA:7203", uri: ""});
      let fma15610 = model.ExternalResource.new({name: "FMA:15610", uri: ""});
      let fma66610 = model.ExternalResource.new({name: "FMA:66610", uri: ""});
      let fma17881 = model.ExternalResource.new({name: "FMA:17881", uri: ""});

      var externals = [fma7203, fma15610, fma66610, fma17881];
      await Promise.all(externals.map(p => p.commit()));

      /*Lyphs*/
      let renalH = model.Lyph.new({name: "Renal hilum", externals: [fma15610]});
      let renalP = model.Lyph.new({name: "Renal parenchyma"});
      let renalC = model.Lyph.new({name: "Renal capsule", externals: [fma66610]});

      var cLyphsGroup = [renalH, renalP, renalC];
      await Promise.all(cLyphsGroup.map(p => p.commit()));

      let kidney = model.Lyph.new({name: "Kidney", externals: [fma7203]});
      await kidney.commit();

      let kidneyLobus = model.Lyph.new({name: "Kidney lobus", externals: [fma17881]});
      await kidneyLobus.commit();

      self.selectedItem = kidney;

    })();
  }

  ngOnDestroy() {
    this.sLyphs.unsubscribe();
    this.sOmegaTrees.unsubscribe();
  }

  onItemSelected(item:any) {
    setTimeout(() => {this.selectedItem = null;}, 0);
    setTimeout(() => {this.selectedItem = item;}, 0);
  }

  ngOnInit() {
    let self = this;
    let main = $('app > #main');
    this.mainLayout = new GoldenLayout(this.layoutConfig, main);

    this.mainLayout.registerComponent('OmegaTreePanel', function (container:any, componentState:any) {
      let panel = container.getElement();
      let content = $('app > #omegaTreeRepo');
      content.detach().appendTo(panel);
    });

    this.mainLayout.registerComponent('LyphPanel', function (container:any, componentState:any) {
      let panel = container.getElement();
      let content = $('app > #lyphRepo');
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

    this.mainLayout.registerComponent('Repo2Panel', function (container:any, componentState:any) {
      let panel = container.getElement();
      let component = $('app > #repo2');
      component.detach().appendTo(panel);
    });
    this.mainLayout.init();
  }
}


