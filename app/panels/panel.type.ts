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
      
      <!--Supertypes-->
      <div class="input-control" *ngIf="includeProperty('supertypes')">
        <label for="supertypes">{{getPropertyLabel('supertypes')}}: </label>
        <select-input [items]="item.p('supertypes') | async" 
        (updated)="updateProperty('supertypes', $event)" 
        [options]="item.constructor.p('all') | async"></select-input>
      </div>
      
      <!--Subtypes-->
      <div class="input-control" *ngIf="includeProperty('subtypes')">
        <label for="subtypes">{{getPropertyLabel('subtypes')}}: </label>
        <select-input [items]="item.p('subtypes') | async" 
          (updated)="updateProperty('subtypes', $event)" 
        [options]="item.constructor.p('all') | async"></select-input>
      </div>
      
      <!--Definition-->
      <div class="input-control" *ngIf="includeProperty('definition')">      
        <label for="target">{{getPropertyLabel('definition')}}: </label>
         <select-input-1 [item] = "item.p('definition') | async"
         (updated) = "updateProperty('definition', $event)"    
         [options] = "item.fields['definition'].p('possibleValues') | async"></select-input-1>
      </div>  
      <ng-content></ng-content>      

    </resource-panel>
  `,
  directives: [ResourcePanel, SingleSelectInput, MultiSelectInput, TemplateValue]
})
export class TypePanel extends ResourcePanel{
  //return this.item.constructor.relationships['-->HasType'].codomain.resourceClass.p('all');
  
}
