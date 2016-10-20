/**
 * Created by Natallia on 6/19/2016.
 */
import {Component, Output} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {TemplateValue} from '../components/component.templateValue';
import {SingleSelectInput} from '../components/component.select';
import {model} from "../services/utils.model";

@Component({
  selector: 'causality-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item]="item" 
      [ignore]   = "ignore"
      [options]  = "options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
      
      <!--Cause, Effect-->
      <selectGroup *ngFor="let property of ['cause', 'effect']">
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
    
    </template-panel>
  `,
  directives: [TemplatePanel, TemplateValue, SingleSelectInput],
})
export class CausalityPanel extends TemplatePanel{

  ngOnInit(){
    super.ngOnInit();
    this.ignore = this.ignore.add('cardinalityBase').add('cardinalityMultipliers')
  }

}
