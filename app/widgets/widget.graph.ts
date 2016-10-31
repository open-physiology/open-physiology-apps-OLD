/**
 * Created by Natallia on 7/14/2016.
 */
import {Component, Input, Output, ElementRef, Renderer, EventEmitter} from '@angular/core';
import {ResizeService} from '../services/service.resize';
import {Subscription}   from 'rxjs/Subscription';
import {Canvas, SelectTool, DragDropTool, ResizeTool, ZoomTool,
  PanTool, BorderToggleTool, LyphRectangle, NodeGlyph, ProcessLine, DrawingTool} from "lyph-edit-widget";
import {combineLatest} from "rxjs/observable/combineLatest";
import {ResourceName, getClassLabel, getIcon, model} from '../services/utils.model';
import {PalleteToolbar} from '../components/toolbar.pallete';

declare var $:any;

@Component({
  selector: 'graph-widget',
  inputs: ['activeItem', 'highlightedItem'],
  template : `
     <div class="panel panel-success">
       <div class="panel-body" style="position: relative">
          <pallete-toolbar [items]="types" [activeItem]="activeItem" [imageProvider]="getIcon" [transfrom]="getClassLabel"
          style="position: absolute;" (activeItemChange)="onActiveItemChange($event)"></pallete-toolbar>
          <svg id="graphSvg" class="svg-widget"></svg>
       </div>
    </div> 
  `,
  directives: [PalleteToolbar]
})
export class GraphWidget{
  @Input() activeItem: any;
  @Input() highlightedItem: any;

  @Output() highlightedItemChange = new EventEmitter();
  @Output() activeItemChange = new EventEmitter();


  types = [
    ResourceName.Material,
    ResourceName.Lyph,
    ResourceName.LyphWithAxis,
    ResourceName.Process,
    ResourceName.Measurable,
    ResourceName.Causality,
    ResourceName.Node,
    ResourceName.OmegaTree,
    ResourceName.CoalescenceScenario];

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
      if (event.target == "graph-widget") {
        this.setPanelSize(event.size);
      }
    });
  }

  onActiveItemChange(Class: any){
    let options: any = {};
    if (Class == ResourceName.LyphWithAxis) {
      Class = ResourceName.Lyph;
      options.createAxis = true;
    }
    if (Class == ResourceName.Lyph) {
      options.createRadialBorders = true;
    }

    let newItem = model[Class].new({name: "New " + Class}, options);
    let newType = model.Type.new({name: newItem.name, definition: newItem});
    newItem.p('name').subscribe(newType.p('name'));

    if (Class == ResourceName.CoalescenceScenario) {
      let layer1 = model.Lyph.new({name: "Layer 1"});
      let layer2 = model.Lyph.new({name: "Layer 2"});
      let layer3 = model.Lyph.new({name: "Layer 3"});

      let lyph1 = model.Lyph.new({name: "Lyph 1", layers: [layer1, layer2]}, {createAxis: true, createRadialBorders: true});
      let lyph2 = model.Lyph.new({name: "Lyph 2", layers: [layer3, layer2]}, {createAxis: true, createRadialBorders: true});
      newItem.lyphs = [lyph1, lyph2];
    }

    this.activeItemChange.emit(newItem);
  }

  setPanelSize(size: any){
    let delta = 10;
    if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)){
      this.vp.size = {width: size.width, height: size.height - 40};
      if (this.svg){}
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.rs) this.rs.unsubscribe();
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
        if (x.model == model) return true;
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
        if (x) this.highlightedItemChange.emit(x.model);
      });
    }
  }
}
