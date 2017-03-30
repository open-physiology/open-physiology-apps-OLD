/**
 * Created by Natallia on 7/14/2016.
 */
import {Component, Input, Output, ElementRef, Renderer, EventEmitter} from '@angular/core';
import {ResizeService} from '../common/service.resize';
import {Subscription}   from 'rxjs/Subscription';
import {Canvas, SelectTool, DragDropTool, ResizeTool, ZoomTool,
  PanTool, BorderToggleTool, LyphRectangle, NodeGlyph, ProcessLine, DrawingTool} from "lyph-edit-widget";
import {resourceClassNames, getClassLabel, getIcon, model} from '../common/utils.model';
import {ToolbarPalette} from './toolbar.palette';

declare var $:any;

@Component({
  selector: 'widget-draw',
  inputs: ['activeItem', 'highlightedItem'],
  template : `
     <div class="panel panel-success">
       <div class="panel-body" style="position: relative">
          <toolbar-palette [items]="types" [activeItem]="activeItem" [imageProvider]="getIcon" [transfrom]="getClassLabel"
          style="position: absolute;" (activeItemChange)="onActiveItemChange($event)"></toolbar-palette>
          <svg id="graphSvg" class="svg-widget"></svg>
       </div>
    </div> 
  `,
  directives: [ToolbarPalette]
})
export class WidgetDraw{
  @Input() activeItem: any;
  @Input() highlightedItem: any;

  @Output() highlightedItemChange = new EventEmitter();
  @Output() activeItemChange = new EventEmitter();


  types = [
    resourceClassNames.Material,
    resourceClassNames.Lyph,
    resourceClassNames.LyphWithAxis,
    resourceClassNames.Process,
    resourceClassNames.Measurable,
    resourceClassNames.Causality,
    resourceClassNames.Node,
    resourceClassNames.CanonicalTree,
    resourceClassNames.CoalescenceScenario];

  svg : any;
  root: any;
  drawingTool: any;
  vp: any = {size: {width: 600, height: 600},
    margin: {x: 20, y: 20},
    node:   {size: {width: 40, height: 40}}};

  rs: Subscription; //GoldenLayout window resize events

  getIcon = getIcon;
  getClassLabel = getClassLabel;

  constructor(public renderer: Renderer,
              public el: ElementRef,
              private resizeService: ResizeService) {
    this.rs = resizeService.resize$.subscribe(
    (event:any) => {
      if (event.target === "graph-widget") {
        this.setPanelSize(event.size);
      }
    });
  }

  onActiveItemChange(clsName: any){
    let options: any = {};
    if (clsName === resourceClassNames.LyphWithAxis) {
      clsName = resourceClassNames.Lyph;
      options.createAxis = true;
    }
    if (clsName === resourceClassNames.Lyph) {
      options.createRadialBorders = true;
    }

    let newItem = model[clsName].new({name: "New " + clsName}, options);
    let newType = model.Type.new({name: newItem.name, definition: newItem});
    newItem.p('name').subscribe(newType.p('name'));
    this.activeItemChange.emit(newItem);
  }

  setPanelSize(size: any){
    let delta = 10;
    if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)){
      this.vp.size = {width: size.width, height: size.height - 40};
      if (this.svg){}
    }
  }


  ngOnDestroy() {
    if (this.rs) { this.rs.unsubscribe(); }
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    if (changes['activeItem']){
      this.createElement();
    }
  }

  createElement(){
    this.createCanvas();
    this.drawingTool.model = this.activeItem;
  }

  elementExists(model: any){
    if (this.root && this.root.children){
      for (let x of this.root.children){
        if (x.model === model) return true;
      }
    }
    return false;
  }

  createCanvas(){
    if (!this.root) {
      this.svg = $('#graphSvg');
      this.root = new Canvas({element: this.svg});
      new SelectTool      (this.root.context);
      new DragDropTool    (this.root.context);
      new ResizeTool      (this.root.context);
      new ZoomTool        (this.root.context);
      new PanTool         (this.root.context);
      new BorderToggleTool(this.root.context);
      this.drawingTool = new DrawingTool(this.root.context);

      this.root.context.p('selected').subscribe(x => {
        if (x) { this.highlightedItemChange.emit(x.model); }
      });
    }
  }
}
