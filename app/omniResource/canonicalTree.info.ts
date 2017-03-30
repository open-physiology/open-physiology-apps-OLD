/**
 * Created by Natallia on 10/9/2016.
 */
import {Component, Input} from '@angular/core';
import {getCanonicalTreeData} from "./canonicalTree.utils";
import {nvD3} from 'ng2-nvd3/lib/ng2-nvd3';

declare var $:any;

@Component({
  selector: 'canonical-tree-info',
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
export class CanonicalTreeInfoWidget{
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
    let treeData = getCanonicalTreeData(item, -1);

    this.thicknessData = [];
    this.lengthData = [];

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
      return {
        Q1: mean - Z * std, Q2: mean, Q3: mean + Z * std,
        whisker_low: d.min, whisker_high: d.max,
        outliers: [0, 10]
      };
    }

    for (let child of treeData.children) {
      let lyphType = child.parentBranch.conveyingLyphType;
      if (lyphType && lyphType.definition) {
        let lyph = lyphType.definition;
        if (lyph.thickness) {
          this.thicknessData.push({ label: lyph.name, values: getEntry(lyph.thickness) });
        }
        if (lyph.length) {
          this.lengthData.push({ label: lyph.name, values: getEntry(lyph.length) });
        }
      }
    }
  }
}
