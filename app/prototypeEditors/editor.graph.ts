import {Component, ElementRef} from '@angular/core';
import {NestedResourceWidget} from '../nestedResource/nestedResource.widget';
import {NestedResourceList} from '../nestedResource/nestedResource.list';
import {WidgetDraw} from '../draw/draw.widget';
import {Subscription}   from 'rxjs/Subscription';
import {SetToArray} from "../common/pipe.general";
import {model} from "../common/utils.model";

import 'rxjs/add/operator/map';

declare var GoldenLayout:any;
declare var $: any;

@Component({
  selector: 'app',
  template: `
    <nested-resource-widget id="repo"
      caption="Resources" 
      [items]="items | setToArray" 
      [options]="{showActive: true}"
      [activeItem]="activeItem"
      (selectedItemChange)="updateSelected($event)"
      (activeItemChange)  ="updateActive($event)"  
      [highlightedItem] = "highlightedItem"
      (highlightedItemChange) = "updateHighlightedRepo($event)"
      >
    </nested-resource-widget>
    <widget-draw id ="graphWidget" 
      [activeItem] = "activeItem" 
      [highlightedItem] = "highlightedItem" 
      [size] = "sizeDraw"
      (highlightedItemChange) = "updateHighlightedWidget($event)"
      (activeItemChange)      = "updateActive($event)"
    ></widget-draw>
    <div id="main"></div>
  `,
  styles: [`#main {width: 100%; height: 100%; border: 0; margin: 0; padding: 0}`],
  directives: [NestedResourceWidget, NestedResourceList, WidgetDraw],
  pipes: [SetToArray]
})
export class GraphEditor {
  items : Array<any>;
  selectedItem : any;
  activeItem   : any;
  highlightedItem : any;

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
          type: 'component',
          componentName: 'GraphWidgetPanel'
        }
      ]
    }]
  };

  mainLayout:any;

  rs: Subscription;
  sizeDraw: any;

  constructor(public el:ElementRef) {

    this.rs = model.Resource.p('all').subscribe(
      (data: any) => {
        this.items = data
      });

    (async function() {
      let extracted = [...await model.Resource.getAll()];
      if (extracted.length > 0){
        this.selectedItem = extracted[0];
      }
    })();
  }

  ngOnDestroy() {
    if (this.rs) { this.rs.unsubscribe();}
  }

  updateSelected(item:any) {
    setTimeout(() => {
      this.selectedItem = null;
    }, 0);
    setTimeout(() => {
      this.selectedItem = item;
    }, 0);
  }

  updateActive(item:any) {
    this.activeItem = item;
  }

  //Repo -> widget
  updateHighlightedRepo(item:any) {
    if (this.highlightedItem !== item) {
      this.highlightedItem = item;
    }
  }

  //Widget -> repo
  updateHighlightedWidget(item:any){
    this.highlightedItem = item;
  }

  ngOnInit() {
    let self = this;
    let main = $('app > #main');
    this.mainLayout = new GoldenLayout(this.layoutConfig, main);

    this.mainLayout.registerComponent('RepoPanel', (container:any, componentState:any) => {
      let panel = container.getElement();
      let content = $('app > #repo');
      content.detach().appendTo(panel);
    });

    this.mainLayout.registerComponent('GraphWidgetPanel', (container:any, componentState:any) => {
      let panel = container.getElement();
      let component = $('app > #graphWidget');
      component.detach().appendTo(panel);
      //Notify components about window resize
      container.on('open', () => {
        this.sizeDraw = {width: container.width, height: container.height};
      });
      container.on('resize', () => {
        this.sizeDraw = {width: container.width, height: container.height};
      });
    });

    this.mainLayout.init();
  }
}


