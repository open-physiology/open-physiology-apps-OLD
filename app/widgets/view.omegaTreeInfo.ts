/**
 * Created by Natallia on 10/9/2016.
 */
import {Component, Input} from '@angular/core';
import {getTreeData, compareLinkedParts, ResourceName, getOmegaTreeData} from "../services/utils.model";
import {nvD3} from 'ng2-nvd3/lib/ng2-nvd3';

declare var $:any;

@Component({
  selector: 'omega-tree-info',
  inputs: ['item'],
  template : `
     <div class="panel-body">
        <h4>Thickness</h4>
        <nvd3 [options]="options" [data]="thicknessData"></nvd3>
        
        <h4>Length</h4>
        <nvd3 [options]="options" [data]="lengthData"></nvd3>
     </div>
  `,
  directives: [nvD3]
})
export class OmegaTreeInfoWidget{
  @Input() item : any;

  options: any = {
    chart: {
      type: 'boxPlotChart',
      height: 100,
      margin : {top: 20, right: 20, bottom: 20, left: 40},
      color:['darkblue'],
      x: function(d){return d.label;},
      maxBoxWidth: 20,
      yDomain: [0, 10]
    }
  };

  thicknessData =  [];
  lengthData =  [];

  ngOnChanges(changes: { [propName: string]: any }) {
    if (this.item) {
      this.getDistributionData(this.item);
    } else {
      this.thicknessData = [];
      this.lengthData = [];
    }
  }

  getDistributionData(item: any){
    let relations = new Set<string>().add("parts");
    let treeData = getTreeData(item, relations, -1); //creates structure for d3 tree out of item.parts
    let parts = treeData.children;

    this.thicknessData = [];
    this.lengthData = [];

    if (!parts) return;
    parts.sort((a, b) => compareLinkedParts(a.resource, b.resource));

    function getEntry(d: any){
      //Normal distribution
      let mean = d.mean;
      let std = d.std;
      let Z = 0.675;
      if (!mean) {//Uniform distribution
        mean = (d.min + d.max) / 2;
        std = (d.min + d.max) / 4;
        Z = 1;
      }
      let values = {
        Q1: mean - Z * std,
        Q2: mean,
        Q3: mean + Z * std,
        whisker_low: d.min,
        whisker_high: d.max,
        outliers: [0, 10]
      };
      return values;
    }

    for (let i = 0; i < parts.length; i++) {
      if ((parts[i].resource.class == ResourceName.Lyph) || (parts[i].resource.class == ResourceName.LyphWithAxis)) {
        if (parts[i].resource.thickness){
          let d = parts[i].resource.thickness;
          let entry = {
            label: parts[i].name,
            values: getEntry(d)
          };
          this.thicknessData.push(entry);
        }
        if (parts[i].resource.length){
          let d = parts[i].resource.length;
          let entry = {
            label: parts[i].name,
            values: getEntry(d)
          };
          this.lengthData.push(entry);
        }
      }
    }
  }

  getLevelSizeData(item: any){
    let tree = getOmegaTreeData(item);
  }

}
