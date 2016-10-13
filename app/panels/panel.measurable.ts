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
      
      <!--Materials-->
      <div class="input-control" *ngIf="includeProperty('materials')">
        <label for="materials">{{getPropertyLabel('materials')}}: </label>
        <select-input [items]="item.p('materials') | async" 
        (updated)="updateProperty('materials', $event)"     
        [options]="item.fields['materials'].p('possibleValues') | async"></select-input>
      </div> 
        
      <!--Locations-->
      <div class="input-control" *ngIf="includeProperty('locations')">
        <label for="locations">{{getPropertyLabel('locations')}}: </label>
        <select-input [items]="item.p('locations') | async" 
        (updated)="updateProperty('locations', $event)"     
        [options]="item.fields['locations'].p('possibleValues') | async"></select-input>
      </div> 
        
      <!--Locations-->
<!--        <div class="input-control" *ngIf="includeProperty('locations')"> 
        <repo-nested [caption]="getPropertyLabel('locations')" 
          [items] = "item.p('locations') | async | setToArray" 
          (updated)="updateProperty('locations', $event)"    
          [selectionOptions] = "item.fields['locations'].p('possibleValues') | async "
          [types]="[ResourceName.Lyph, ResourceName.Border]"
          (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>-->
      
      <!--Causes-->
      <div class="input-control" *ngIf="includeProperty('causes')">
        <label for="causes">{{getPropertyLabel('causes')}}: </label>
        <select-input [items]="item.p('causes') | async" 
        (updated)="updateProperty('causes', $event)"     
        [options]="item.fields['causes'].p('possibleValues') | async"></select-input>
      </div> 
      
      <!--Effects-->
      <div class="input-control" *ngIf="includeProperty('effects')">
        <label for="effects">{{getPropertyLabel('effects')}}: </label>
        <select-input [items]="item.p('effects') | async" 
        (updated)="updateProperty('effects', $event)"     
        [options]="item.fields['effects'].p('possibleValues') | async"></select-input>
      </div> 
       
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

