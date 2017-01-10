/**
 * Created by Natallia on 10/18/2016.
 */
import {Component, OnChanges, ElementRef, Input} from '@angular/core';
import * as cytoscape from "cytoscape";

declare var $: any;

@Component({
  selector: 'ng2-cytoscape',
  template: '<div id="cy"></div>',
  styles: [`#cy {
        height: 300;
        width: 600;
    }`]
})

export class NgCytoscape{

  @Input() public elements: any;
  @Input() public style: any;
  @Input() public layout: any;
  @Input() public zoom: any;

  public constructor(private el: ElementRef) {

    this.elements = this.elements || {
      nodes: [
        {data: {id: 'j', name: 'Jerry', faveColor: '#6FB1FC', faveShape: 'triangle'}},
        {data: {id: 'e', name: 'Elaine', faveColor: '#EDA1ED', faveShape: 'ellipse'}},
        {data: {id: 'k', name: 'Kramer', faveColor: '#86B342', faveShape: 'octagon'}},
        {data: {id: 'g', name: 'George', faveColor: '#F5A45D', faveShape: 'rectangle'}}
      ],
      edges: [
        {data: {source: 'j', target: 'e', faveColor: '#6FB1FC'}},
        {data: {source: 'j', target: 'k', faveColor: '#6FB1FC'}},
        {data: {source: 'j', target: 'g', faveColor: '#6FB1FC'}},

        {data: {source: 'e', target: 'j', faveColor: '#EDA1ED'}},
        {data: {source: 'e', target: 'k', faveColor: '#EDA1ED'}},

        {data: {source: 'k', target: 'j', faveColor: '#86B342'}},
        {data: {source: 'k', target: 'e', faveColor: '#86B342'}},
        {data: {source: 'k', target: 'g', faveColor: '#86B342'}},

        {data: {source: 'g', target: 'j', faveColor: '#F5A45D'}}
      ]
    };

    this.layout = this.layout || {
        name: 'grid',
        directed: true,
        padding: 0
      };

    this.zoom = this.zoom || {
        min: 0.1,
        max: 1.5
      };

    this.style = this.style || [
      {
        selector: 'node',
        css: {
          'content': 'data(name)',
          'shape': 'rectangle',
          'text-valign': 'center',
          'background-color': 'data(faveColor)',
          'width': '200px',
          'height': '100px',
          'color': 'black'
        }
      },
      {
        selector: ':selected',
        css: {
          'border-width': 3,
          'border-color': '#333'
        }
      },
      {
        selector: 'edge',
        css: {
          'label': 'data(label)',
          'color': 'black',
          'curve-style': 'bezier',
          'opacity': 0.666,
          'width': 'mapData(strength, 70, 100, 2, 6)',
          'target-arrow-shape': 'triangle',
          'line-color': 'data(faveColor)',
          'source-arrow-color': 'data(faveColor)',
          'target-arrow-color': 'data(faveColor)'
        }
      },
      {
        selector: 'edge.questionable',
        css: {
          'line-style': 'dotted',
          'target-arrow-shape': 'diamond'
        }
      },
      {
        selector: '.faded',
        css: {
          'opacity': 0.25,
          'text-opacity': 0
        }
      }
    ]

  }

  ngOnInit(){
    this.render();
  }

  ngOnChanges(){
    this.render();
  }

  render() {
    var cy = cytoscape({
      container: $(this.el.nativeElement).select('#cy'),
      layout: this.layout,
      minZoom: this.zoom.min,
      maxZoom: this.zoom.max,
      style: this.style,
      elements: this.elements,
    });
  }

}
