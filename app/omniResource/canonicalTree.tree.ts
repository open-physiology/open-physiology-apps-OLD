/**
 * Created by Natallia on 7/14/2016.
 */
import {Component, Input, ElementRef, Renderer} from '@angular/core';
import {getResourceIcon, getColor} from "../common/utils.model";
import {Canvas, LyphRectangle} from "lyph-edit-widget";
import {getCanonicalTreeData} from "./canonicalTree.utils";

declare var d3:any;
declare var $:any;

@Component({
  selector: 'canonical-tree',
  inputs: ['item', 'size'],
  template : `
     <div class="panel-body">
        <svg #treeSvg class="svg-widget"></svg>
     </div>
  `,
  directives: []
})
export class CanonicalTreeWidget{
  @Input() item : any;
  @Input() size: any = {width: 600, height: 300};

  svg : any;
  rootSvg: any;
  data: any;

  vp: any = {
    size: {width: 600, height: 300},
    margin: {x: 20, y: 20},
    node: {size: {width: 40, height: 40}}};


  constructor(public el: ElementRef) {}

  setPanelSize(size: any){
    let delta = 10;
    if ((Math.abs(this.vp.size.width - size.width) > delta) || (Math.abs(this.vp.size.height - size.height) > delta)){
      this.vp.size = {width: size.width, height: size.height - 40};
      if (this.svg){
        this.draw(this.svg, this.vp, this.data);
      }
    }
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    this.svg = d3.select(this.el.nativeElement).select('svg');
    this.rootSvg = $('#treeSvg');
    if( changes['size'] && this.size) { this.setPanelSize(this.size); }
    if (this.item) {
      this.data = getCanonicalTreeData(this.item, -1);
      this.draw(this.svg, this.vp, this.data);
    } else {
      this.data = {};
      this.svg.selectAll(".tree").remove();
    }
  }

  draw(svg: any, vp: any, data: any): void{
    let w = vp.size.width - 2 * vp.margin.x;
    let h = vp.size.height - 2 * vp.margin.y;
    svg.selectAll(".tree").remove();

    let tree = d3.layout.tree().size([w, h]);
    let diagonal = d3.svg.diagonal().projection((d: any) => [d.x, d.y]);

    var zoom = d3.behavior.zoom()
      .scaleExtent([0.5, 2])
      .on("zoom", zoomed);

    var drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", dragstarted)
      .on("drag", dragged)
      .on("dragend", dragended);

    function zoomed() {
      svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
    }

    function dragged(d) { d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y); }

    function dragended(d) { d3.select(this).classed("dragging", false); }

    let treeSvg = svg.append("g").attr("class", "tree").attr("width",
      vp.size.width).attr("height", vp.size.height)
      .attr("transform", "translate(" + vp.margin.x + "," + vp.margin.y + ")")
      .call(zoom);

    let svgGroup = treeSvg.append("g");

    let nodes = tree.nodes(data);
    let links = tree.links(nodes);

    let link = svgGroup.selectAll(".link")
     .data(links)
     .enter().append("path")
     .attr("class", "link")
     .attr("stroke", d => getColor('childBranches'))
     .attr("d", diagonal);

    let node = svgGroup.selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 4.5)
      .style("fill", d => getColor(d.class))
      .attr("transform", transform);

    let dx = vp.node.size.width / 2;
    let dy = vp.node.size.height / 2;

    let icon = svgGroup.selectAll(".icon")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "icon")
      .each((d: any) => {
        if (d.target && d.target.parentBranch){
          let position = {x: (d.source.x + d.target.x) / 2 - dx, y: (d.source.y + d.target.y) / 2 - dy};

          svgGroup.append("image")
            .attr("xlink:href", getResourceIcon(d.target.parentBranch))
            .attr("x", position.x + dx - 12).attr("y", position.y + dy - 12)
            .attr("width", 24).attr("height", 24);

            let lyphType = d.target.parentBranch.conveyingLyphType;
            if (lyphType){
              let lyph = lyphType.definition;
              let model = new LyphRectangle({model: lyph,
                x: position.x,
                y: position.y,
                width: vp.node.size.width,
                height: vp.node.size.height});
              let lyphSvg = $(svgGroup.node());
              let canvas = new Canvas({element: lyphSvg});
              model.parent = canvas;
              d3.select(model.element).attr("transform",
                "rotate(" + 90 + ',' + (position.x + dx) + ',' + (position.y + dy) + ")")
            }
         }
      });

    let text = svgGroup.selectAll("nodeLabel")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "nodeLabel")
      .append("text")
      .attr("dx", -5)
      .style("text-anchor", "end")
      .attr("x", d => (d.source.x + d.target.x) / 2 - dx)
      .attr("y", d => (d.source.y + d.target.y) / 2)
      .text((d: any) => ("level " + (d.target.depth) + ": " + d.target.parentBranch.name));

    function transform(d: any): string {
      return "translate(" + d.x + "," + d.y + ")";
    }
  }
}
