/**
 * Created by Natallia on 6/19/2016.
 */
import {Component, Output, EventEmitter} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {MultiSelectInput, SingleSelectInput} from '../components/component.select';
import {RADIO_GROUP_DIRECTIVES} from "ng2-radio-group";
import {SetToArray} from "../transformations/pipe.general";
import {model} from "../services/utils.model";
import {RepoNested} from "../repos/repo.nested";

@Component({
  selector: 'process-panel',
  inputs: ['item', 'ignore', "options"],
  template:`
    <template-panel [item]="item" 
      [ignore]  ="ignore"
      [options] ="options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" 
      (highlightedItemChange)="highlightedItemChange.emit($event)">
        
      <!--TransportPhenomenon-->
        <div class="input-control" *ngIf="includeProperty('transportPhenomenon')">
          <fieldset>
            <legend>{{getPropertyLabel('transportPhenomenon')}}:</legend>
            <checkbox-group [(ngModel)]="item.transportPhenomenon" (ngModelChange)="onSelectChange(item.transportPhenomenon)">
               <input type="checkbox" value="diffusion">diffusion&nbsp;
               <input type="checkbox" value="advection">advection<br/>
             </checkbox-group>
          </fieldset>
        </div>
          
      <!--ConveyingLyph, Materials-->
      <multiSelectGroup *ngFor="let property of ['conveyingLyph','materials']">
         <div class="input-control" *ngIf="includeProperty(property)">
            <label>{{getPropertyLabel(property)}}: </label>
            <select-input [items] = "item.p(property) | async"
             (updated) = "updateProperty(property, $event)"    
             [options] = "item.fields[property].p('possibleValues') | async">
            </select-input>
        </div>
        <ng-content select="multiSelectGroup"></ng-content>
      </multiSelectGroup>

      <!--SourceLyph, TargetLyph, Source, Target-->
      <selectGroup *ngFor="let property of ['sourceLyph','targetLyph', 'source', 'target']">
        <div class="input-control" *ngIf="includeProperty(property)">      
          <label>{{getPropertyLabel(property)}}: </label>
          <select-input-1 [item] = "item.p(property) | async" 
            (updated) = "updateProperty(property, $event)"  
            [options] = "item.fields[property].p('possibleValues') | async">
          </select-input-1>
        </div>
        <ng-content select="selectGroup"></ng-content>
      </selectGroup>
           
      <!--Channels, Segments, Measurables-->  
      <relationGroup *ngFor="let property of ['segments', 'channels', 'measurables']">
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
   
    </template-panel>
  `,
  directives: [TemplatePanel, MultiSelectInput, SingleSelectInput, RepoNested, RADIO_GROUP_DIRECTIVES],
  pipes: [SetToArray]
})
export class ProcessPanel extends TemplatePanel{
  sourceOptions = [];
  targetOptions = [];

  getTypes(property: string): any{
    switch (property){
      case "measurables": return [this.ResourceName.Measurable];
    }
    return [this.item.class];
  }

  ngOnInit(){
    super.ngOnInit();
    if (!this.item.transportPhenomenon) this.item.transportPhenomenon = [];
    this.ignore = this.ignore.add('cardinalityBase').add('cardinalityMultipliers');

    this.item.fields['source'].p('possibleValues').subscribe(
      (data: any) => {
        if (this.item.sourceLyph){
          this.sourceOptions = this.item.sourceLyph.nodes;
        }
        else {
          this.sourceOptions = data;
        }
      });

    this.item.fields['target'].p('possibleValues').subscribe(
      (data: any) => {
        if (this.item.targetLyph){
          this.targetOptions = this.item.targetLyph.nodes;
        }
        else {
          this.targetOptions = data;
        }
      });
  }

  updateProperty(property: string, lyph: any){
    super.updateProperty(property, lyph);
    if (!lyph) return;
    if (property == "sourceLyph"){
      this.sourceOptions = lyph.nodes;
      if (this.item.source){
        if (this.sourceOptions.indexOf(this.item.source) < 0) this.item.source = null;
      }
    }
    if (property == "targetLyph"){
      this.targetOptions = lyph.nodes;
      if (this.item.target){
        if (this.targetOptions.indexOf(this.item.target) < 0) this.item.target = null;
      }
    }
  }

  onSelectChange(value){
    let newTP = (Array.isArray(value))? value.slice(): value;
    this.propertyUpdated.emit({property: 'transportPhenomenon', values: newTP});
  }

}
