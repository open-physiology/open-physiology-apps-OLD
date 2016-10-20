/**
 * Created by Natallia on 6/19/2016.
 */
import {Component} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {MultiSelectInput, SingleSelectInput} from '../components/component.select';
import {SetToArray} from "../transformations/pipe.general";
import {RepoNested} from '../repos/repo.nested';

@Component({
  selector: 'measurable-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item]="item" 
      [ignore]="ignore" 
      [options] ="options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
      
       <!--Quality-->
      <div class="input-control input-control-lg" *ngIf="includeProperty('quality')">
        <label for="quality">{{getPropertyLabel('quality')}}: </label>
        <input type="text" class="form-control" required [(ngModel)]="item.quality">
      </div>
      
       <!--Causes, Effects, Locations, Materials-->
       <multiSelectGroup *ngFor="let property of ['materials', 'locations', 'causes','effects']">
         <div class="input-control" *ngIf="includeProperty(property)">
            <label>{{getPropertyLabel(property)}}: </label>
            <select-input [items] = "item.p(property) | async"
             (updated) = "updateProperty(property, $event)"    
             [options] = "item.fields[property].p('possibleValues') | async">
            </select-input>
         </div>
         <ng-content select="multiSelectGroup"></ng-content>
       </multiSelectGroup>     
       
      <ng-content></ng-content>   
         
    </template-panel>
  `,
  directives: [TemplatePanel,  MultiSelectInput, SingleSelectInput, RepoNested],
  pipes: [SetToArray]
})
export class MeasurablePanel extends TemplatePanel{


  ngOnInit(){
    super.ngOnInit();
    this.ignore = this.ignore.add('cardinalityBase').add('cardinalityMultipliers');
  }
}

