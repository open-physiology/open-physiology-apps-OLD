/**
 * Created by Natallia on 7/14/2016.
 */
import {Component, Input, Output, ViewChild, ElementRef, Renderer, EventEmitter} from '@angular/core';
import {Canvas, LyphRectangle} from "lyph-edit-widget";

declare var $:any;

@Component({
  selector: 'lyph',
  inputs: ['item', 'highlightedItem', 'size'],
  template : `
     <div class="panel-body">
       <svg id="lyphSvg" class="svg-widget"></svg>
     </div>
  `,
  directives: []
})
export class LyphWidget{
  @Input() item : any;
  @Input() highlightedItem: any;
  @Input() size: any = {width: 600, height: 300};

  @Output() highlightedItemChange = new EventEmitter();

  svg : any;
  root: any;
  model: any;

  vp: any = {size: {width: 600, height: 300},
    margin: {x: 20, y: 20},
    node: {size: {width: 40, height: 40}}};

  constructor(public el: ElementRef) {}

  setPanelSize(size: any){
    let delta = 10;
    if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)){
      this.vp.size = {width: size.width, height: size.height - 40};
      if (this.svg && this.model){
         this.model.width = this.vp.size.width;
         this.model.height = this.vp.size.height;
      }
    }
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    this.svg = $('#lyphSvg');
    if (!this.root) { this.root = new Canvas({element: this.svg}); }
    if( changes['size'] && this.size) { this.setPanelSize(this.size); }
    if (this.item) {
      this.model = new LyphRectangle({
        model: this.item,
        x: this.vp.margin.x,
        y: this.vp.margin.y,
        width: this.vp.size.width - 2 * this.vp.margin.x,
        height: this.vp.size.height - 2 * this.vp.margin.y});
      this.model.parent = this.root;
      this.svg.append(this.model.element);

      // this.root.context.p('selected').subscribe(x => {
      //   if (x) { this.highlightedItemChange.emit(x.model); }
      // });
    }
  }
}
