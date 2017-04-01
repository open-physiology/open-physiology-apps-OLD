import {Component, ElementRef} from '@angular/core';
import {NestedResourceWidget} from '../nestedResource/nestedResource.widget';
import {NestedResourceList} from '../nestedResource/nestedResource.list';
import {HierarchyWidget} from '../hierarchy/hierarchy.widget';
import {ResourceWidget} from '../omniResource/omniResource.widget';
import {Subscription}   from 'rxjs/Subscription';
import {SetToArray, HideClass} from "../common/pipe.general";
import {model} from "../common/utils.model";

import 'rxjs/add/operator/map';

declare var GoldenLayout:any;
declare var $: any;

@Component({
  selector: 'app',
  template: `
    <nested-resource-widget id="repo"
      [items]="items | setToArray" 
      [caption]="'Resources'" 
      (selectedItemChange)="onItemSelected($event)">
    </nested-resource-widget>
    <hierarchy-widget id = "hierarchy" [item]="selectedItem" [size]="sizeHierarchy"></hierarchy-widget>
    <resource-widget id = "resource" [item]="selectedItem" [size]="sizeResource"></resource-widget>   
    <div id="main"></div>
  `,
  styles: [`#main {width: 100%; height: 100%; border: 0; margin: 0; padding: 0}`],
  directives: [NestedResourceWidget, NestedResourceList, HierarchyWidget, ResourceWidget],
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

  sizeHierarchy: any;
  sizeResource: any;

  constructor(public el:ElementRef) {
    this.rs = model.Resource.p('all').subscribe(
      (data: any) => {
        this.items = data;
      });

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
    let main = $('app > #main');
    this.mainLayout = new GoldenLayout(this.layoutConfig, main);

    this.mainLayout.registerComponent('RepoPanel', (container:any, componentState:any) => {
      let panel = container.getElement();
      let content = $('app > #repo');
      content.detach().appendTo(panel);
    });

    this.mainLayout.registerComponent('HierarchyPanel', (container:any, componentState:any) => {
      let panel = container.getElement();
      let component = $('app > #hierarchy');
      component.detach().appendTo(panel);
      //Notify components about window resize
      container.on('open', () => {
        this.sizeHierarchy = {width: container.width, height: container.height};
      });
      container.on('resize', () => {
        this.sizeHierarchy = {width: container.width, height: container.height};
      });
    });

    this.mainLayout.registerComponent('ResourcePanel', (container:any, componentState:any) => {
      let panel = container.getElement();
      let component = $('app > #resource');
      component.detach().appendTo(panel);

      //Notify components about window resize
      container.on('open', () => {
        this.sizeResource = {width: container.width, height: container.height};
      });
      container.on('resize', () => {
        this.sizeResource = {width: container.width, height: container.height};
      });
    });
    this.mainLayout.init();
  }
}


