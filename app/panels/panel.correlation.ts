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
        <div class="input-control input-control-lg" *ngIf="includeProperty('comment')">
          <label for="comment">{{getPropertyLabel('comment')}}: </label>
          <input type="text" [(ngModel)]="item.comment">
        </div>
        
        <!--Publication-->
        <div>
          <label for="publication">{{getPropertyLabel('publication')}}: </label>
          <select-input-1 [item] = "item.p('publication') | async" 
            (updated) = "updateProperty('publication', $event)"  
            [options] = "item.fields['publication'].p('possibleValues') | async"></select-input-1>
        </div>
        
        <!--ClinicalIndex-->
        <div class="input-control" *ngIf="includeProperty('clinicalIndices')">
          <label for="clinicalIndices">{{getPropertyLabel('clinicalIndices')}}: </label>
          <select-input [items]="item.p('clinicalIndices') | async" 
          (updated)="updateProperty('clinicalIndices', $event)"
          [options]="item.fields['clinicalIndices'].p('possibleValues') | async"></select-input>
        </div>
        
        <!--Measurables-->
        <div class="input-control" *ngIf="includeProperty('measurables')">
          <repo-nested [caption]="getPropertyLabel('measurables')" 
          [items]="item.p('measurables') | async | setToArray" 
          (updated)="updateProperty('measurables', $event)"          
          [types]="[ResourceName.Measurable]"
          (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>
        
        <ng-content></ng-content>      
    
    </resource-panel>
  `,
  directives: [ResourcePanel, SingleSelectInput, MultiSelectInput, RepoNested],
  pipes: [SetToArray]
})
export class CorrelationPanel extends ResourcePanel{}
