/**
 * Created by Natallia on 7/14/2016.
 */
import {Component, Input, Output, ViewChild, ElementRef, Renderer, EventEmitter} from '@angular/core';
import {ResizeService} from '../services/service.resize';
import {Subscription}   from 'rxjs/Subscription';
import {Canvas, LyphRectangle} from "lyph-edit-widget";

declare var $:any;

@Component({
  selector: 'lyph',
  inputs: ['item'],
  template : `
     <div class="panel-body">
       <svg id="lyphSvg" class="svg-widget"></svg>
     </div>
  `,
  directives: []
})
export class LyphWidget{
  @Input() item : any;

  svg : any;
  canvas: any;
  model: any;

  vp: any = {size: {width: 600, height: 300},
    margin: {x: 20, y: 20},
    node: {size: {width: 40, height: 40}}};
  subscription: Subscription;

  constructor(public renderer: Renderer,
              public el: ElementRef,
              private resizeService: ResizeService) {
    this.subscription = resizeService.resize$.subscribe(
    (event:any) => {
      if (event.target === "lyph") {
        this.setPanelSize(event.size);
      }
    });
  }

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    this.svg = $('#lyphSvg');
    if (!this.canvas) { this.canvas = new Canvas({element: this.svg}); }

    if (this.item) {
      this.model = new LyphRectangle({
        model: this.item,
        x: this.vp.margin.x,
        y: this.vp.margin.y,
        width: this.vp.size.width - 2 * this.vp.margin.x,
        height: this.vp.size.height - 2 * this.vp.margin.y});
      this.model.parent = this.canvas;
      this.svg.append(this.model.element);
    }
  }
}
