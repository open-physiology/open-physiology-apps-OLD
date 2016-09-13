/**
 * Created by Natallia on 6/21/2016.
 */
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormToolbar} from "./toolbar.form";

@Component({
  "inputs": ["caption", "item", "min", "max", "step"],
  "selector": "template-value",
  "template": `
      <div class="input-control">
        <label for="caption">{{caption}}:</label>
        
        <div class="btn-group" style="float: left;">
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': valueType == 'Value'}" (click)="updateType('Value')">
            <span class="glyphicon glyphicon-th"></span>
          </button>
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': valueType == 'Range'}" (click)="updateType('Range')">
            <span class="glyphicon glyphicon-transfer"></span>
          </button>
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': valueType == 'Distribution'}" (click)="updateType('Distribution')">
            <span class="glyphicon glyphicon-random"></span>
          </button>
        </div>
        
        <input *ngIf="valueType == 'Value'" 
          type="number" class="form-control" 
           [min] ="min? min: 0" 
           [max] ="max? max: 10" 
           [step]="step? step: 1" 
           [(ngModel)]="value" 
           (ngModelChange)="updated.emit(value)"/>
        
        <fieldset *ngIf="(valueType == 'Range') || (valueType == 'Distribution')">
          <!--Min--> 
          <div class="input-control">
            <label for="min">Min: </label>
            <input type="number" class="form-control" 
              [min] ="min? min: 0" 
              [max] ="max? max: 10" 
              [step]="step? step: 1" 
              [(ngModel)]="valueSet.min"
              (ngModelChange)="updated.emit(valueSet)">
          </div>
          <!--Max-->
          <div class="input-control">
            <label for="max">Max: </label>
            <input type="number" class="form-control" 
              [min] ="min? min: 0" 
              [max] ="max? max: 10" 
              [step]="step? step: 1" 
              [(ngModel)]="valueSet.max"
              (ngModelChange)="updated.emit(valueSet)">
          </div>
          <div *ngIf="valueType == 'Distribution'">
            <!--Mean-->
            <div class="input-control">
              <label for="mean">Mean: </label>
              <input type="number" class="form-control" 
              [min] ="min? min: 0" 
              [max] ="max? max: 10" 
              [step]="step? step: 1" 
              [(ngModel)]="valueSet.mean"
              (ngModelChange)="updated.emit(valueSet)">
            </div>
            <!--Std-->
            <div class="input-control">
              <label for="std">Std: </label>
              <input type="number" class="form-control" 
              [min] ="min? min: 0" 
              [max] ="max? max: 10" 
              [step]="step? step: 1" 
              [(ngModel)]="valueSet.std"
              (ngModelChange)="updated.emit(valueSet)">
            </div>
          </div>
        </fieldset>
        
       </div>
   `,
  "styles": [`input {width: 60px;}`],
  "directives": [FormToolbar]
})
export class TemplateValue{
  @Input() item: any;
  value: number = 0;
  valueSet: any = {min: 0, max: 0, std: 0, mean: 0};
  valueType: string = "Value";
  @Output() updated = new EventEmitter();

  ngOnInit(){
    if (this.item) {
      if (this.item instanceof Object) {
        this.valueSet = this.item;
        if (this.item.distribution){
          this.valueType = "Distribution";
        }
        else {
          this.valueType = "Range";
        }
      } else {
        this.value = this.item;
      }
    }
  }

  updateType(type: string){
    this.valueType = type;
    if (type == "Value"){
      this.item = this.value;
    } else {
      this.item = this.valueSet;
      this.valueSet.distribution = (this.valueType == 'Distribution')? "Normal": undefined;
    }

    this.updated.emit(this.item);
  }
}
