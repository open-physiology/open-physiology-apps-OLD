/**
 * Created by Natallia on 7/14/2016.
 */
import {Component, Input, Output, ElementRef, Renderer, EventEmitter} from '@angular/core';
import {ResizeService} from '../services/service.resize';
import {Subscription}   from 'rxjs/Subscription';
import {Canvas, SelectTool, DragDropTool, ResizeTool, ZoomTool,
  PanTool, BorderToggleTool, LyphRectangle, NodeGlyph, ProcessLine, DrawingTool} from "lyph-edit-widget";
import {combineLatest} from "rxjs/observable/combineLatest";
import {ResourceName} from '../services/utils.model';

declare var $:any;

@Component({
  selector: 'graph-widget',
  inputs: ['activeItem', 'highlightedItem'],
  template : `
     <div class="panel panel-success">
     <div class="panel-heading">Graph editor</div>
       <div class="panel-body" style="position: relative">
          <svg id="graphSvg" class="svg-widget"></svg>
       </div>
    </div> 
  `
})
export class GraphWidget{
  @Input() activeItem: any;
  @Input() highlightedItem: any;

  @Output() highlightedItemChange = new EventEmitter();

  svg : any;
  root: any;
  drawingTool: any;
  vp: any = {size: {width: 600, height: 600},
    margin: {x: 20, y: 20},
    node: {size: {width: 40, height: 40}}};

  rs: Subscription; //GoldenLayout window resize events

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
      if (this.activeItem) this.createElement();
    }
  }

  createElement(){
    this.createCanvas();
    this.drawingTool.model = this.activeItem;

    /*
    //Creating elements for active item
    if (this.elementExists(this.activeItem)) return;

    if (this.activeItem.class == ResourceName.Lyph){
      let element = new LyphRectangle({
        model:  this.activeItem, x: 100, y: 100, width: 200, height: 150
      });
      element.parent = this.root;
    }
    if (this.activeItem.class == ResourceName.Process){
      let element = new ProcessLine({model:  this.activeItem});
      element.parent = this.root;
    }
    */
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
      //new PanTool         (this.root.context);
      new BorderToggleTool(this.root.context);
      this.drawingTool = new DrawingTool(this.root.context);

      this.root.context.p('selected').subscribe(x => {
        if (x) this.highlightedItemChange.emit(x.model);
      });
    }
  }
}
