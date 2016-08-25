/**
 * Created by Natallia on 6/19/2016.
 */
import {Component} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {MultiSelectInput} from '../components/component.select';
import {RepoNested} from '../repos/repo.nested';
import {SetToArray} from "../transformations/pipe.general";
import {model} from "../services/utils.model";

@Component({
  selector: 'node-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item]="item" 
      [ignore]   = "ignore"
      [options]  = "options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
      
      <!--Location-->
      <div class="input-control" *ngIf="includeProperty('locations')">
        <label for="location">{{getPropertyLabel('locations')}}: </label>
        <select-input [items]="item.p('locations') | async" 
        (updated)="updateProperty('locations', $event)"     
        [options]="item.fields['locations'].p('possibleValues')"></select-input>
      </div>   

      <relationGroup>
        <!--Locations-->
<!--        <div class="input-control" *ngIf="includeProperty('locations')"> 
        <repo-nested [caption]="getPropertyLabel('locations')" 
          [items] = "item.p('locations') | async | setToArray" 
          (updated)="updateProperty('locations', $event)"    
          [selectionOptions] = "item.fields['locations'].p('possibleValues') | async "
          [types]="[ResourceName.Lyph, ResourceName.Border]"
          (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>-->
      
        <!--Channels-->
        <div class="input-control" *ngIf="includeProperty('channels')"> 
        <repo-nested [caption]="getPropertyLabel('channels')" 
          [items] = "item.p('channels') | async | setToArray" 
          (updated)="updateProperty('channels', $event)"     
          [types]="[ResourceName.Node]"
          (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>
        
        <!--Measurables-->
        <div class="input-control" *ngIf="includeProperty('measurables')">
          <repo-nested [caption]="getPropertyLabel('measurables')" 
          [items]="item.p('measurables') | async | setToArray" 
          (updated)="updateProperty('measurables', $event)" 
          [types]="[ResourceName.Measurable]"
          (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>
        
       <!--Incoming processes-->
         <div class="input-control" *ngIf="includeProperty('incomingProcesses')">
          <repo-nested [caption]="getPropertyLabel('incomingProcesses')" 
           [items]  = "item.p('incomingProcesses') | async | setToArray" 
           [types]  = "[ResourceName.Process]" 
           (updated)= "updateProperty('incomingProcesses', $event)"           
           (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>
        
        <!--Outgoing processes-->
         <div class="input-control" *ngIf="includeProperty('outgoingProcesses')">
          <repo-nested [caption]="getPropertyLabel('outgoingProcesses')" 
           [items]  = "item.p('outgoingProcesses') | async | setToArray" 
           [types]  = "[ResourceName.Process]" 
           (updated)= "updateProperty('outgoingProcesses', $event)"           
           (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>
        
        <ng-content select="relationGroup"></ng-content>
      </relationGroup>   
         
      <ng-content></ng-content>   
    
    </template-panel>
  `,
  directives: [MultiSelectInput, TemplatePanel, RepoNested],
  pipes: [SetToArray]
})
export class NodePanel extends TemplatePanel{
  ngOnInit(){
    super.ngOnInit();
    this.ignore = this.ignore.add('cardinalityBase').add('cardinalityMultipliers');
  }
}
