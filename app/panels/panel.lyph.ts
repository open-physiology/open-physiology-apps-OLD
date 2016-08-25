/**
 * Created by Natallia on 6/17/2016.
 */
import {Component} from '@angular/core';
import {MaterialPanel} from "./panel.material";
import {MultiSelectInput, SingleSelectInput} from '../components/component.select';
import {RepoNested} from '../repos/repo.nested';
import {SetToArray} from "../transformations/pipe.general";
import {BorderPanel} from "./panel.border";
import {TemplateValue} from '../components/component.templateValue';
import {ResourceName} from '../services/utils.model';
import {model} from "../services/utils.model";
const {Measurable} = model;

@Component({
  selector: 'lyph-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <material-panel [item]="item" 
        [ignore]  = "ignore"
        [options] = "options"
        (saved)   = "saved.emit($event)"
        (canceled)= "canceled.emit($event)"
        (removed) = "removed.emit($event)"
        (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
        
        <toolbar>
          <button type="button" class="btn btn-default btn-icon" 
            (click)="generateMeasurables()">
            <span class="glyphicon glyphicon-cog"></span>
          </button>
        </toolbar>
        
        <!--Thickness-->
        <template-value *ngIf="includeProperty('thickness')" 
          [caption]="getPropertyLabel('thickness')" 
          [item]="item.thickness"
          (updated)="updateProperty('thickness', $event)"
        ></template-value>
        
        <!--Length-->
        <template-value *ngIf="includeProperty('length')" 
            [caption]="getPropertyLabel('length')" 
            [item]="item.length"
            (updated)="updateProperty('length', $event)">
        </template-value>
        
        <!--Auxilliary field: measurables to generate-->
        <!--TODO: replace with modal-->
        <!--<generateFromSupertype>-->
          <!--<div class="generate-control">-->
            <!--<label for="measurablesToReplicate"><img class="icon" src="images/measurable.png"/> Measurables to generate </label>-->
            <!--<select-input [items]="measurablesToReplicate" -->
              <!--(updated)="measurablesToReplicate = $event"-->
              <!--[options]="supertypeMeasurables">-->
            <!--</select-input>-->
          <!--</div>-->
        <!--</generateFromSupertype>-->
        
        <relationGroup>   
          <!--Nodes-->
          <div class="input-control" *ngIf="includeProperty('nodes')">
            <repo-nested [caption]="getPropertyLabel('nodes')" 
            [items]  = "item.p('nodes') | async | setToArray" 
            (updated) = "updateProperty('nodes', $event)"
            [selectionOptions] = "item.fields['nodes'].p('possibleValues') | async "
            [types]  = "[ResourceName.Node]"
            (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div> 
        
           <!--Measurables-->
          <div class="input-control" *ngIf="includeProperty('measurables')">
            <repo-nested [caption]="getPropertyLabel('measurables')" 
            [items]  = "item.p('measurables') | async | setToArray" 
            (updated) = "updateProperty('measurables', $event)"
            [selectionOptions] = "item.fields['measurables'].p('possibleValues') | async"
            [types]  = "[ResourceName.Measurable]"
            (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div> 
           
          <!--Layers-->
          <div class="input-control" *ngIf="includeProperty('layers')">
            <repo-nested [caption]="getPropertyLabel('layers')" 
            [items]  = "item.p('layers') | async | setToArray" 
            [ignore] = "layersIgnore"
            [options]="{ordered: true}"
            (updated)= "updateProperty('layers', $event)" 
            [types]  = "[item.class]"
            (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>     
               
          <!--Segments-->
          <div class="input-control" *ngIf="includeProperty('segments')">
            <repo-nested [caption]="getPropertyLabel('segments')" 
            [items] = "item.p('segments') | async | setToArray" 
            [ignore]="segmentsIgnore"
            [options]="{ordered: true}"
            (updated)= "updateProperty('segments', $event)" 
            [types]="[item.class]"
            (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>     
  
          <!--Patches-->
          <div class="input-control" *ngIf="includeProperty('patches')">
            <repo-nested [caption]="getPropertyLabel('patches')" 
            [items]  = "item.p('patches') | async | setToArray" 
            [ignore] = "patchesIgnore"
            [types]  = "[item.class]"
            (updated)= "updateProperty('patches', $event)" 
            (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>
                  
          <!--Parts-->
          <div class="input-control" *ngIf="includeProperty('parts')">
            <repo-nested [caption]="getPropertyLabel('parts')" 
            [items]  = "item.p('parts') | async | setToArray" 
            [ignore] = "partsIgnore"
            [types]  = "[item.class]"
            (updated)= "updateProperty('parts', $event)" 
            (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>
          
          <!--Processes-->
          <div class="input-control" *ngIf="includeProperty('processes')">
            <repo-nested [caption]="getPropertyLabel('processes')" 
             [items]  = "item.p('processes') | async | setToArray" 
             [types]  = "[ResourceName.Process]" 
             (updated)= "updateProperty('processes', $event)" 
             (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>
          
           <!--Coalescences-->
           <div class="input-control" *ngIf="includeProperty('coalescences')">
            <repo-nested [caption]="getPropertyLabel('coalescences')" 
             [items]  = "item.p('coalescences') | async | setToArray" 
             [types]  = "[ResourceName.Coalescence]" 
             (updated) = "updateProperty('coalescences', $event)" 
             (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>
            
          <!--Incoming processes-->
           <div class="input-control" *ngIf="includeProperty('incomingProcesses')">
            <repo-nested [caption]="getPropertyLabel('incomingProcesses')" 
             [items]  = "item.p('incomingProcesses') | async | setToArray" 
             [types]  = "[ResourceName.Process]" 
             (updated) = "updateProperty('incomingProcesses', $event)" 
             (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>
          
          <!--Outgoing processes-->
           <div class="input-control" *ngIf="includeProperty('outgoingProcesses')">
            <repo-nested [caption]="getPropertyLabel('outgoingProcesses')" 
             [items]  = "item.p('outgoingProcesses') | async | setToArray" 
             [types]  = "[ResourceName.Process]" 
             (updated) = "updateProperty('outgoingProcesses', $event)" 
             (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>
          
          <ng-content select="relationGroup"></ng-content>
        </relationGroup>     
        
        <fieldset *ngIf="includeProperty('borders')" >  
          <legend>Borders</legend>
          
          <!--Axis-->
          <div class="input-control" *ngIf="item.axis">      
            <label for="axis">{{getPropertyLabel('axis')}}: </label>
            <border-panel [item]="item.p('axis') | async" 
              [options]="borderOptions"
              (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"
              (saved)  = "updateProperty('axis', $event)">
            </border-panel>
          </div>              
        
          <!--RadialBorders-->        
          <div class="input-control" *ngIf="item.radialBorders">      
            <label for="radialBorders">{{getPropertyLabel('radialBorders')}}: </label>
             <repo-nested [caption]="getPropertyLabel('radialBorders')" 
               [items]  = "item.p('radialBorders') | async | setToArray" 
               [types]  = "[ResourceName.Border]" 
               [options] = "borderOptions"
               (updated) = "updateProperty('radialBorders', $event)"
               (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>
          
          <!--LongitudinalBorders-->        
          <div class="input-control"  *ngIf="item.longitudinalBorders">      
            <label for="longitudinalBorders">{{getPropertyLabel('longitudinalBorders')}}: </label>
             <repo-nested [caption]="getPropertyLabel('longitudinalBorders')" 
               [items]  = "item.p('longitudinalBorders') | async | setToArray" 
               [types]  = "[ResourceName.Border]" 
               [options] = "borderOptions"
               (updated) = "updateProperty('longitudinalBorders', $event)"
               (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
          </div>
          
          <ng-content select="borderGroup"></ng-content>
        </fieldset>
        
        <!--TreeParent-->
        <div *ngIf="includeProperty('treeParent')" class="input-control">
          <label for="treeParent">{{getPropertyLabel('treeParent')}}: </label>
          <select-input-1 [item] = "item.p('treeParent') | async"
           (updated) = "updateProperty('treeParent', $event)"    
           [options] = "item.fields['treeParent'].p('possibleValues') | async"></select-input-1>
        </div>
        
        <!--TreeChildren-->
        <div class="input-control" *ngIf="includeProperty('treeChildren')">
          <label for="treeChildren">{{getPropertyLabel('treeChildren')}}: </label>
          <select-input 
            [items]="item.p('treeChildren') | async" 
            (updated)="updateProperty('treeChildren', $event)" 
            [options]="item.fields['treeChildren'].p('possibleValues') | async"></select-input>
        </div> 
       
        <ng-content></ng-content>  
        
    </material-panel>
  `,
  directives: [MaterialPanel, MultiSelectInput, SingleSelectInput,
    RepoNested, BorderPanel, TemplateValue],
  pipes: [SetToArray]
})
export class LyphPanel extends MaterialPanel{
  borderOptions = {'readOnly': true, 'hideRemove': true, 'hideCreateType': true};

  layersIgnore  : Set<string> = new Set<string>();
  patchesIgnore : Set<string> = new Set<string>();
  partsIgnore   : Set<string> = new Set<string>();
  segmentsIgnore: Set<string> = new Set<string>();

  ngOnInit(){
    super.ngOnInit();
    this.layersIgnore  = new Set<string>(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
    this.patchesIgnore = new Set<string>(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
    this.partsIgnore   = new Set<string>(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
    this.segmentsIgnore = new Set<string>(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);

/*  if (this.item){
      this.item.p('layers').subscribe(x => {
        console.log("Layers updated", x);
      });
      this.item.p('parts').subscribe(x => {
        console.log("Parts updated", x);
      })
    }*/
  }

  supertypeMeasurables  : Array <any> = [];
  measurablesToReplicate: Array <any> = [];

  generateMeasurables() {
    this.supertypeMeasurables = [];
    for (let type of this.item.types) {
      for (let supertype of type.supertypes) {
        if (supertype.measurables) {
          let supertypeMeasurables = Array.from(new Set(supertype.measurables.map((item:any) => item.type)));
          for (let supertypeMeasurable of supertypeMeasurables) {
            if (this.supertypeMeasurables.indexOf(supertypeMeasurable) < 0)
              this.supertypeMeasurables.push(supertypeMeasurable);
          }
        }
      }
    }
    console.log("Supertype measurables", this.supertypeMeasurables);

    this.measurablesToReplicate = Array.from(this.supertypeMeasurables);
    for (let measurable of this.measurablesToReplicate) {
      delete measurable["id"];
      let newMeasurable = Measurable.new(measurable);
      newMeasurable.locations.add(this.item);
    }
  }
}
