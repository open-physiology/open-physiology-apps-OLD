import {Component, Input, Output, OnChanges, OnDestroy, ElementRef, Renderer, EventEmitter} from '@angular/core';
import {nvD3} from 'ng2-nvd3/lib/ng2-nvd3';
import {ResizeService} from '../common/service.resize';
import {Subscription} from 'rxjs/Subscription';

import {getIcon, getColor} from "../common/utils.model";
import {getGraphData} from "./hierarchy.utils";

declare let d3: any;

@Component({
  selector: 'hierarchy-graph',
  inputs: ['item', 'relations', 'depth'],
  template : `
     <nvd3 *ngIf="active" [options]="graphOptions" [data]="data"></nvd3>
  `,
  directives: [nvD3]
})
export class RelationGraph implements OnChanges, OnDestroy{
  @Input() item       : any;
  @Input() relations  : Set<string> = new Set<string>();
  @Input() depth      : number = -1;

  active   : boolean = true;

  data: any;
  vp: any = {size  : {width: 600, height: 300},
             margin: {x: 20, y: 20},
             node  : {size: {width: 40, height: 20}}};

  graphOptions: any;
  subscription: Subscription;

  constructor(public renderer: Renderer,
              public el: ElementRef,
              private resizeService: ResizeService){
    let self = this;
    this.subscription = resizeService.resize$.subscribe(
      (event: any) => {
        if (event.target === "hierarchy-graph"){
          self.setPanelSize(event.size);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(){
    if (this.item)
      this.setGraphOptions();
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    if (this.item) {
      this.data = getGraphData(this.item, this.relations, this.depth);
    } else {
      this.data = {};
    }
  }

  setPanelSize(size: any){
    let delta = 10;
    if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)){
      this.vp.size = size;
      if (this.graphOptions){
        this.graphOptions.chart.width = this.vp.size.width;
        this.graphOptions.chart.height = this.vp.size.height;
        setTimeout(() => {this.active = false}, 0);
        setTimeout(() => {this.active = true}, 0);
      }
    }
  }

  setGraphOptions(){
    let properties = Object.assign({}, this.item.constructor.properties);

    function formatValue(value: any){
      let res = "[";
      for (let i = 0; i < value.length; i++){
        res += "{" + ((value[i].id)? value[i].id: "?") + ": " + value[i].name + "}" + ",";
      }
      res = res.replace(/,\s*$/, "");
      res += "]";
      return res;
    }

    this.graphOptions = {
      chart: {
        type: 'forceDirectedGraph',
        width: this.vp.size.width,
        height: this.vp.size.height,
        margin:{top: 20, right: 20, bottom: 20, left: 20},
        radius: 0,
        nodeExtras: function(node: any) {
          node && node
            .append("text")
            .attr("dx", 10)
            .attr("dy", ".35em")
            .text(function(d: any) { return d.name })
            .attr("class", "nodeLabel");

          node && node
            .append("image")
            .attr("xlink:href", function (d: any) {return getIcon(d.class);})
            .attr("x", -8).attr("y", -8)
            .attr("width", 16).attr("height", 16);
        },
        linkExtras: function(link: any) {
          link.attr("class", "link").attr("stroke", function(d){return getColor(d.relation)});
        }
      }
    };
  }
}



