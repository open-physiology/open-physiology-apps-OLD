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
      
       <!--Cause-->
      <div class="input-control" *ngIf="includeProperty('cause')">      
        <label for="cause">{{getPropertyLabel('cause')}}: </label>
        <select-input-1 [item] = "item.p('cause') | async" 
          (updated)="updateProperty('cause', $event)"    
          [options] = "item.fields['cause'].p('possibleValues') | async"></select-input-1>
      </div>
      
      <!--Effect-->
      <div class="input-control" *ngIf="includeProperty('effect')">      
        <label for="effect">{{getPropertyLabel('effect')}}: </label>
        <select-input-1 [item] = "item.p('effect') | async" 
          (updated) = "updateProperty('effect', $event)"    
          [options] = "item.fields['effect'].p('possibleValues') | async"></select-input-1>
      </div>
      
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
