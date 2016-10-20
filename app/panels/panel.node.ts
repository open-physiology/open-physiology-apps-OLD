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
      
      <!--Locations-->
      <multiSelectGroup *ngFor="let property of ['locations']">
         <div class="input-control" *ngIf="includeProperty(property)">
            <label>{{getPropertyLabel(property)}}: </label>
            <select-input [items] = "item.p(property) | async"
             (updated) = "updateProperty(property, $event)"    
             [options] = "item.fields[property].p('possibleValues') | async">
            </select-input>
         </div>
         <ng-content select="multiSelectGroup"></ng-content>
       </multiSelectGroup>       
      
      <!--Channels, Measurables, IncomingProcesses, OutgoingProcesses-->
        <relationGroup *ngFor="let property of 
          ['channels', 'measurables', 
          'incomingProcesses', 'outgoingProcesses']">   
          <div class="input-control" *ngIf="includeProperty(property)">
            <repo-nested [caption]="getPropertyLabel(property)" 
            [items]  = "item.p(property) | async | setToArray" 
            [types]  = "getTypes(property)"
            [selectionOptions] = "item.fields[property].p('possibleValues') | async "
            (updated) = "updateProperty(property, $event)"
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

  getTypes(property: string): any{
    switch (property){
      case "measurables": return [this.ResourceName.Measurable];
      case "incomingProcesses":
      case "outgoingProcesses": return [this.ResourceName.Process];
    }
    return [this.item.class];
  }

  ngOnInit(){
    super.ngOnInit();
    this.ignore = this.ignore.add('cardinalityBase').add('cardinalityMultipliers');
  }
}
