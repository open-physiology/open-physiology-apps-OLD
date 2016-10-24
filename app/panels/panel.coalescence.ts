/**
 * Created by Natallia on 6/19/2016.
 */
import {Component} from '@angular/core';
import {ResourcePanel} from "./panel.resource";
import {MultiSelectInput} from '../components/component.select';
import {RepoNested} from '../repos/repo.nested';
import {SetToArray} from '../transformations/pipe.general';

@Component({
  selector: 'coalescence-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <resource-panel [item] = "item" 
      [ignore] = "ignore"
      [options] ="options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">

      <!--Scenarios-->
       <selectGroup *ngFor="let property of ['scenarios']">
         <div class="input-control" *ngIf="includeProperty(property)">
            <label>{{getPropertyLabel(property)}}: </label>
            <select-input [items] = "item.p(property) | async"
             (updated) = "updateProperty(property, $event)"    
             [options] = "item.fields[property].p('possibleValues') | async">
            </select-input>
        </div>
        <ng-content select="selectGroup"></ng-content>
       </selectGroup>
                  
      <!--Lyphs-->  
      <relationGroup *ngFor="let property of ['lyphs']">
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
  directives: [ResourcePanel, MultiSelectInput, RepoNested],
  pipes: [SetToArray]
})
export class CoalescencePanel extends ResourcePanel{
}
