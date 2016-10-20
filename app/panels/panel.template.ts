/**
 * Created by Natallia on 6/17/2016.
 */
import {Component} from '@angular/core';
import {ResourceName} from '../services/utils.model';
import {ResourcePanel} from "./panel.resource";
import {MultiSelectInput} from '../components/component.select';
import {TemplateValue} from '../components/component.templateValue';
import {SetToArray, HideClass} from "../transformations/pipe.general";

@Component({
  selector: 'template-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <resource-panel [item]="item" 
      [ignore]   ="ignore"
      [options]  ="options"
      (saved)    = "onSaved($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
      
      <toolbar *ngIf="!(options && options.hideCreateType)" >
        <ng-content select="toolbar"></ng-content>
        <input type="checkbox" [(ngModel)]="createType">Create type
      </toolbar>
      
      <!--Species-->
      <inputGroup *ngFor="let property of ['species']">
        <div class="input-control input-control-lg" *ngIf="includeProperty(property)">
          <label for="comment">{{getPropertyLabel(property)}}: </label>
          <input type="text" class="form-control" [(ngModel)]="item[property]">
        </div>
        <ng-content select="inputGroup"></ng-content>
      </inputGroup>
      
      <!--Defines type-->
<!--      <selectGroup *ngFor="let property of ['definesType']">
        <div class="input-control" *ngIf="includeProperty(property)">      
          <label>{{getPropertyLabel(property)}}: </label>
          <select-input-1 [item] = "item.p(property) | async" 
            (updated) = "updateProperty(property, $event)"  
            [options] = "item.fields[property].p('possibleValues') | async">
          </select-input-1>
        </div>
        <ng-content select="selectGroup"></ng-content>
      </selectGroup>-->

      <!--Cardinality base-->
      <template-value *ngIf="includeProperty('cardinalityBase')" 
        [caption]="getPropertyLabel('cardinalityBase')" 
        [item]="item.cardinalityBase"
        [step]="0.1"
        (updated)="updateProperty('cardinalityBase', $event)"
      ></template-value>
      
      <!--Cardinality multipliers, Types-->
      <multiSelectGroup *ngFor="let property of ['cardinalityMultipliers', 'types']">
         <div class="input-control" *ngIf="includeProperty(property)">
            <label>{{getPropertyLabel(property)}}: </label>
            <select-input [items] = "item.p(property) | async"
             (updated) = "updateProperty(property, $event)"    
             [options] = "item.fields[property].p('possibleValues') | async">
            </select-input>
        </div>
        <ng-content select="multiSelectGroup"></ng-content>
      </multiSelectGroup>
      
      <ng-content select="relationGroup"></ng-content>
      
      <ng-content></ng-content>      

    </resource-panel>
  `,
  directives: [ResourcePanel, MultiSelectInput, TemplateValue]
})
export class TemplatePanel extends ResourcePanel{
  createType = false;
  cardinalityMultipliers = {};

  ngOnInit(){
    super.ngOnInit();
    if (this.item){
      let setToArray = new SetToArray();
      let hideClass = new HideClass();

      //Options for cardinality multiplieers
      this.item.fields['cardinalityMultipliers'].p('possibleValues').subscribe(
          (data: any) => {
            this.cardinalityMultipliers =
              new Set(hideClass.transform(setToArray.transform(data), [ResourceName.Border, ResourceName.Node]));
          });
    }
  }

  onSaved(event: any){
    this.saved.emit({createType: this.createType});
  }
}
