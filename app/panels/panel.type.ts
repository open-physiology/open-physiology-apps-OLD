/**
 * Created by Natallia on 6/17/2016.
 */
import {Component} from '@angular/core';
import {ResourcePanel} from "./panel.resource";
import {SingleSelectInput, MultiSelectInput} from '../components/component.select';
import {TemplateValue} from '../components/component.templateValue';

@Component({
  selector: 'type-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <resource-panel [item]="item" 
      [ignore]   ="ignore"
      [options]  ="options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
      
      <!--Supertypes, SubTypes -->
      <multiSelectGroup *ngFor="let property of ['supertypes', 'subtypes']">
         <div class="input-control" *ngIf="includeProperty(property)">
            <label>{{getPropertyLabel(property)}}: </label>
            <select-input [items] = "item.p(property) | async"
             (updated) = "updateProperty(property, $event)"    
             [options] = "item.fields[property].p('possibleValues') | async">
            </select-input>
        </div>
        <ng-content select="multiSelectGroup"></ng-content>
      </multiSelectGroup>
      
      <!--Definition-->
      <selectGroup *ngFor="let property of ['definition']">
        <div class="input-control" *ngIf="includeProperty(property)">      
          <label>{{getPropertyLabel(property)}}: </label>
          <select-input-1 [item] = "item.p(property) | async" 
            (updated) = "updateProperty(property, $event)"  
            [options] = "item.fields[property].p('possibleValues') | async">
          </select-input-1>
        </div>
        <ng-content select="selectGroup"></ng-content>
      </selectGroup>
      
      <ng-content></ng-content>      

    </resource-panel>
  `,
  directives: [ResourcePanel, SingleSelectInput, MultiSelectInput, TemplateValue]
})
export class TypePanel extends ResourcePanel{
  //return this.item.constructor.relationships['-->HasType'].codomain.resourceClass.p('all');

}
