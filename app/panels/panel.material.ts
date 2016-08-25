/**
 * Created by Natallia on 6/17/2016.
 */
import {Component} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {MultiSelectInput} from '../components/component.select';
import {model} from "../services/utils.model";

@Component({
  selector: 'material-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item]="item" 
      [ignore]="ignore"
      [options] ="options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">        
      
      <toolbar>
        <ng-content select="toolbar"></ng-content>  
      </toolbar>
        
        <!--Materials-->
        <div class="input-control" *ngIf="includeProperty('materials')">
          <label for="materials">{{getPropertyLabel('materials')}}: </label>
          <select-input 
            [items]="item.p('materials') | async" 
            (updated)="updateProperty('materials', $event)" 
            [options]="item.fields['materials'].p('possibleValues') | async">
          </select-input>
        </div>
       
        <ng-content></ng-content>
        
    </template-panel>
  `,
  directives: [TemplatePanel, MultiSelectInput]
})
export class MaterialPanel extends TemplatePanel{}
