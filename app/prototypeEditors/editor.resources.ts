import {Component, ElementRef} from '@angular/core';
import {NestedResourceWidget} from '../nestedResource/nestedResource.widget';
import {NestedResourceList} from '../nestedResource/nestedResource.list';
import {RelationshipWidget} from '../hierarchy/hierarchy.widget';
import {ResourceWidget} from '../omniResource/omniResource.widget';
import {ResizeService} from '../common/service.resize';
import {Subscription}   from 'rxjs/Subscription';
import {SetToArray, HideClass} from "../common/pipe.general";
import {model} from "../common/utils.model";

import 'rxjs/add/operator/map';

declare var GoldenLayout:any;
declare var $: any;

@Component({
  selector: 'app',
  providers: [ResizeService],
  template: `
    <nested-resource-widget id="repo"
      [items]="items | setToArray" 
      [caption]="'Resources'" 
      (selectedItemChange)="onItemSelected($event)">
    </nested-resource-widget>
    <hierarchy-widget id = "hierarchy" [item]="selectedItem"></hierarchy-widget>
    <resource-widget id = "resource" [item]="selectedItem"></resource-widget>   
    <div id="main"></div>
  `,
  styles: [`#main {width: 100%; height: 100%; border: 0; margin: 0; padding: 0}`],
  directives: [NestedResourceWidget, NestedResourceList, RelationshipWidget, ResourceWidget],
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

  constructor(private resizeService:ResizeService, public el:ElementRef) {
    this.rs = model.Resource.p('all').subscribe(
      (data: any) => {
        this.items = data;
      });

    let self = this;
    (async function() {

      let extracted = [...await model.Resource.getAll()];
      if (extracted.length > 0){
        this.selectedItem = extracted[0];
      }
    })();
  }
  ngOnDestroy() { this.rs.unsubscribe(); }

  onItemSelected(item:any) {
    setTimeout(() => { this.selectedItem = null; }, 0);
    setTimeout(() => { this.selectedItem = item; }, 0);
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


