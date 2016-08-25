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
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
        
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
          
        <!--ConveyingLyph-->
      <div class="input-control" *ngIf="includeProperty('conveyingLyph')">
        <label for="conveyingLyph">{{getPropertyLabel('conveyingLyph')}}: </label>
        <select-input [items] = "item.p('conveyingLyph') | async"
         (updated) = "updateProperty('conveyingLyph', $event)"    
         [options] = "item.fields['conveyingLyph'].p('possibleValues') | async"></select-input>
      </div>
      
      <!--SourceLyph-->
      <div class="input-control" *ngIf="includeProperty('sourceLyph')">      
        <label for="sourceLyph">{{getPropertyLabel('sourceLyph')}}: </label>
        <select-input-1 [item] = "item.p('sourceLyph') | async" 
          (updated) = "onLyphChange('sourceLyph', $event)"  
          [options] = "item.fields['sourceLyph'].p('possibleValues') | async"></select-input-1>
      </div>
      
      <!--TargetLyph-->
      <div class="input-control" *ngIf="includeProperty('targetLyph')">      
        <label for="targetLyph">{{getPropertyLabel('targetLyph')}}: </label>
        <select-input-1 [item] = "item.p('targetLyph') | async" 
          (updated) = "onLyphChange('targetLyph', $event)"   
          [options] = "item.fields['targetLyph'].p('possibleValues') | async"></select-input-1>
      </div>        
      
      <!--Source-->
      <div class="input-control" *ngIf="includeProperty('source')">      
        <label for="source">{{getPropertyLabel('source')}}: </label>
        <select-input-1 [item] = "item.p('source') | async" 
          (updated) = "updateProperty('source', $event)"   
          [options] = "sourceOptions"></select-input-1>
      </div>
      
      <!--Target-->
      <div class="input-control" *ngIf="includeProperty('target')">      
        <label for="target">{{getPropertyLabel('target')}}: </label>
        <select-input-1 [item] = "item.p('target') | async" 
          (updated) = "updateProperty('target', $event)"  
          [options] = "targetOptions"></select-input-1>
      </div>   
          
       <!--Materials-->
      <div class="input-control" *ngIf="includeProperty('materials')">
        <label for="meterials">{{getPropertyLabel('materials')}}: </label>
        <select-input [items]="item.p('materials') | async" 
        (updated)="updateProperty('materials', $event)" 
         [options]="item.fields['materials'].p('possibleValues') | async"></select-input>
      </div> 
        
       <relationGroup>
        <!--Segments-->
        <div class="input-control" *ngIf="includeProperty('segments')">
          <repo-nested [caption]="getPropertyLabel('segments')" 
          [items]="item.p('segments') | async | setToArray" 
          (updated)="updateProperty('segments', $event)" 
          [types]="[ResourceName.Process]"
          (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>
        
        <!--Channels-->
        <div class="input-control" *ngIf="includeProperty('channels')">
          <repo-nested [caption]="getPropertyLabel('channels')" 
          [items]="item.p('channels') | async | setToArray" 
          (updated)="updateProperty('channels', $event)"           
          [types]="[ResourceName.Process]"
          (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
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

  sourceOptions = {};
  targetOptions = {};

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

  onLyphChange(property: string, lyph: any){
    super.updateProperty(property, lyph);
    if (!lyph) return;
    if (property == "sourceLyph"){
      this.sourceOptions = lyph.nodes;
      if (this.source){
        if (this.sourceOptions.indexOf(this.source) < 0) this.source = null;
      }
    }
    if (property == "targetLyph"){
      this.targetOptions = lyph.nodes;
      if (this.target){
        if (this.targetOptions.indexOf(this.target) < 0) this.target = null;
      }
    }
  }

  onSelectChange(value){
    let newTP = (Array.isArray(value))? value.slice(): value;
    this.propertyUpdated.emit({property: 'transportPhenomenon', values: newTP});
  }

}
