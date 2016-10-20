/**
 * Created by Natallia on 6/19/2016.
 */
import {Component} from "@angular/core";
import {ResourcePanel} from "./panel.resource";
import {SingleSelectInput, MultiSelectInput} from "../components/component.select";
import {RepoNested} from "../repos/repo.nested";
import {SetToArray} from "../transformations/pipe.general";
import {model} from "../services/utils.model";

@Component({
  selector: 'correlation-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <resource-panel [item]="item" 
      [ignore]="ignore" 
      [options] ="options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
      
      <!--Comment-->
      <inputGroup *ngFor="let property of ['comment']">
        <div class="input-control input-control-lg" *ngIf="includeProperty(property)">
          <label for="comment">{{getPropertyLabel(property)}}: </label>
          <input type="text" class="form-control" [(ngModel)]="item[property]">
        </div>
        <ng-content select="inputGroup"></ng-content>
      </inputGroup>
        
      <!--Publication-->
      <selectGroup *ngFor="let property of ['publication']">
        <div class="input-control" *ngIf="includeProperty(property)">      
          <label>{{getPropertyLabel(property)}}: </label>
          <select-input-1 [item] = "item.p(property) | async" 
            (updated) = "updateProperty(property, $event)"  
            [options] = "item.fields[property].p('possibleValues') | async">
          </select-input-1>
        </div>
        <ng-content select="selectGroup"></ng-content>
      </selectGroup>
      
      <!--ClinicalIndices-->
      <multiSelectGroup *ngFor="let property of ['clinicalIndices']">
         <div class="input-control" *ngIf="includeProperty(property)">
            <label>{{getPropertyLabel(property)}}: </label>
            <select-input [items] = "item.p(property) | async"
             (updated) = "updateProperty(property, $event)"    
             [options] = "item.fields[property].p('possibleValues') | async">
            </select-input>
         </div>
        <ng-content select="multiSelectGroup"></ng-content>
      </multiSelectGroup>
           
      <!--Measurables-->  
      <relationGroup *ngFor="let property of ['measurables']">
        <div class="input-control" *ngIf="includeProperty(property)">
          <repo-nested 
            [caption]="getPropertyLabel(property)" 
            [items]  ="item.p(property) | async | setToArray" 
            [types]  ="getTypes(property)"
            (updated)="updateProperty(property, $event)" 
            (highlightedItemChange)="highlightedItemChange.emit($event)">
          </repo-nested>
        </div>
        <ng-content select="relationGroup"></ng-content>
      </relationGroup>
        
      <ng-content></ng-content>      
    
    </resource-panel>
  `,
  directives: [ResourcePanel, SingleSelectInput, MultiSelectInput, RepoNested],
  pipes: [SetToArray]
})
export class CorrelationPanel extends ResourcePanel{
  getTypes(property: string): any{
    switch (property){
      case "measurables": return [this.ResourceName.Measurable];
    }
    return [this.item.class];
  }

  selectTemplate = `


`
}
