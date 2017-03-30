/**
 * Created by Natallia on 3/22/2017.
 */
import {Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
  "inputs": ["caption", "clsName"],
  "selector": "distribution-class",
  "template": `
      <div class="input-control input-control-md">
        <label for="caption">{{caption}}:</label>
        
        <div class="btn-group" style="float: left;">
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': clsName === 'Uniform'}" (click)="updateClass('Uniform')">
            <span class="glyphicon square"></span>
          </button>
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': clsName === 'BoundedNormal'}" (click)="updateClass('BoundedNormal')">
            <span class="glyphicon triangle-top"></span>
          </button>
        </div>
      </div>
   `
})
export class DistributionClass{
  @Input() clsName: any;
  @Output() updated = new EventEmitter();

  ngOnInit(){
    if (this.clsName) {}
  }

  updateClass(clsName: string){
    this.clsName = clsName;
    this.updated.emit(this.clsName);
  }
}
