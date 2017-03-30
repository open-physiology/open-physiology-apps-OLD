/**
 * Created by Natallia on 6/21/2016.
 */
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {DistributionClass} from 'component.distributionType';

@Component({
  "inputs": ["caption", "item", "min", "max", "step"],
  "selector": "template-value",
  "template": `
      <div class="input-control input-control-md">
        <label for="caption">{{caption}}:</label>
        
        <div class="btn-group" style="float: left;">
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': valueType === 'Value'}" (click)="updateType('Value')">
            <span class="glyphicon glyphicon-th"></span>
          </button>
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': valueType === 'Range'}" (click)="updateType('Range')">
            <span class="glyphicon glyphicon-transfer"></span>
          </button>
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': valueType === 'Distribution'}" (click)="updateType('Distribution')">
            <span class="glyphicon glyphicon-random"></span>
          </button>
        </div>
      </div>
      
      <div class="input-control input-control-sm" *ngIf="valueType === 'Value'">
        <label>Value:</label>
        <input type="number" class="form-control" 
           [min] ="min" 
           [max] ="max" 
           [step]="step" 
           [(ngModel)]="value" 
           (ngModelChange)="updated.emit(value)"/>
      </div>

      <div class="input-control" *ngIf="(valueType === 'Range') || (valueType === 'Distribution')">
        <label>{{(valueType === 'Range')? "Range": "Distribution"}}:</label>
        <fieldset >
          <!--<distribution-class caption="Class" [clsName] = "valueSet.distributionClass"></distribution-class> -->
          <!--Min--> 
          <div class="input-control input-control-sm">
            <label for="min">Min: </label>
            <input type="number" class="form-control" 
              [min] ="min" 
              [max] ="max" 
              [step]="step" 
              [(ngModel)]="valueSet.min"
              (ngModelChange)="updated.emit(valueSet)">
          </div>
          <!--Max-->
          <div class="input-control input-control-sm">
            <label for="max">Max: </label>
            <input type="number" class="form-control" 
              [min] ="min" 
              [max] ="max" 
              [step]="step" 
              [(ngModel)]="valueSet.max"
              (ngModelChange)="updated.emit(valueSet)">
          </div>
          <div *ngIf="valueType === 'Distribution'" style="display: inline-block">
            <!--Mean-->
            <div class="input-control input-control-sm">
              <label for="mean">Mean: </label>
              <input type="number" class="form-control" 
              [min] ="min" 
              [max] ="max" 
              [step]="step" 
              [(ngModel)]="valueSet.mean"
              (ngModelChange)="updated.emit(valueSet)">
            </div>
            <!--Std-->
            <div class="input-control input-control-sm">
              <label for="std">Std: </label>
              <input type="number" class="form-control" 
              [min] ="min" 
              [max] ="max" 
              [step]="step" 
              [(ngModel)]="valueSet.std"
              (ngModelChange)="updated.emit(valueSet)">
            </div>
          </div>
        </fieldset>
      </div>
   `,
  "styles": [`input {width: 60px;}`]
  // "directives": [DistributionClass]
})
export class TemplateValue{
  @Input() item: any;
  @Input() min: number = 0;
  @Input() max: number = 10;
  @Input() step: number = 1;

  value: number = 0;
  valueSet: any = {};
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
    if (type === "Value"){
      this.item = this.value;
    } else {
      this.item = this.valueSet;
      this.valueSet.distribution = (this.valueType === 'Distribution')? "Normal": undefined;
    }

    this.updated.emit(this.item);
  }
}
