/**
 * Created by Natallia on 6/17/2016.
 */
import {Component, ViewChild} from '@angular/core';
import {MaterialPanel} from "./panel.material";
import {MultiSelectInput, SingleSelectInput} from '../components/component.select';
import {RepoNested} from '../repos/repo.nested';
import {SetToArray} from "../transformations/pipe.general";
import {BorderPanel} from "./panel.border";
import {TemplateValue} from '../components/component.templateValue';
import {ResourceName} from '../services/utils.model';
import {model} from "../services/utils.model";
const {Measurable} = model;

import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

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
        
        <!--Thickness, Length-->
        <sizeGroup *ngFor = "let property of ['thickness', 'length']">
          <template-value *ngIf="includeProperty(property)" 
            [caption]="getPropertyLabel(property)" 
            [item]="item.p(property) | async"
            (updated)="updateProperty(property, $event)">
          </template-value>
        </sizeGroup>
        
        <!--Nodes, Measurables, Layers, Segments, Patches, Parts, Processes, 
        Coalescences, IncomingProcesses, OutgoingProcesses-->
        <relationGroup *ngFor="let property of 
          ['nodes', 'measurables', 
          'layers', 'segments', 'patches', 'parts',
          'processes', 'coalescences', 'incomingProcesses', 'outgoingProcesses']">   
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
        
        <fieldset *ngIf="includeProperty('borders')" >  
          <legend>Borders</legend>
          
          <!--Axis-->
          <div class="input-control" *ngIf="item.axis">      
            <label for="axis">{{getPropertyLabel('axis')}}: </label>
            <border-panel [item]="item.p('axis') | async" 
              [options]="borderOptions"
              (propertyUpdated) = "propertyUpdated.emit($event)" 
              (highlightedItemChange)="highlightedItemChange.emit($event)"
              (saved)  = "updateProperty('axis', $event)">
            </border-panel>
          </div>              
        
          <borderGroup *ngFor="let property of ['radialBorders', 'longitudinalBorders']">
            <div class="input-control" *ngIf="item[property]">      
              <repo-nested [caption]="getPropertyLabel(property)" 
                 [items]  = "item.p(property) | async | setToArray" 
                 [types]  = "getTypes(property)" 
                 [options] = "borderOptions"
                 (updated) = "updateProperty(property, $event)"
                 (highlightedItemChange)="highlightedItemChange.emit($event)">
              </repo-nested>
            </div>
          </borderGroup>
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
        
<!--
        <button type="button" class="btn btn-default" (click)="modal.open()">Open me!</button>
-->

        <modal #myModal>
          <modal-header [show-close]="true">
              <h4 class="modal-title">Select supertype measurables to replicate</h4>
          </modal-header>
          <modal-body>
              <li *ngFor="let option of supertypeMeasurables; let i = index">
                <a class="small" href="#">
                <input type="checkbox" 
                  [(ngModel)]="option.selected" 
                  (ngModelChange)="measurablesToReplicateChanged(option)"/>&nbsp;
                {{option.value.name}}</a>
              </li>
          </modal-body>
          <modal-footer>
            <button type="button" class="btn btn-default" data-dismiss="modal" (click)="dismiss()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="close()">Ok</button>
          </modal-footer>
        </modal>
          
    </material-panel>  
    
  `,
  directives: [MaterialPanel, MultiSelectInput, SingleSelectInput,
    RepoNested, BorderPanel, TemplateValue, MODAL_DIRECTIVES],
  pipes: [SetToArray]
})
export class LyphPanel extends MaterialPanel{
  borderOptions = {'readOnly': true, 'hideRemove': true, 'hideCreateType': true};

  layersIgnore  : Set<string> = new Set<string>();
  patchesIgnore : Set<string> = new Set<string>();
  partsIgnore   : Set<string> = new Set<string>();
  segmentsIgnore: Set<string> = new Set<string>();

  //TODO ignore Axis if not set

  getTypes(property: string): any{
    //console.log("fields[property]", this.item.fields[property]);
    //console.log("fields[property].class", this.item.fields[property].class);
    switch (property){
      case "nodes": return [this.ResourceName.Node];
      case "measurables": return [this.ResourceName.Measurable];
      case "incomingProcesses":
      case "outgoingProcesses":
      case "processes": return [this.ResourceName.Process];
      case "coalescences": return [this.ResourceName.Coalescence];
      case "radialBorders":
      case "longitudinalBorders": return [this.ResourceName.Border];
    }
    return [this.item.class];
  }

  ngOnInit(){
    super.ngOnInit();
    this.layersIgnore  = new Set<string>(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
    this.patchesIgnore = new Set<string>(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
    this.partsIgnore   = new Set<string>(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
    this.segmentsIgnore = new Set<string>(['cardinalityBase', 'cardinalityMultipliers', 'treeParent', 'treeChildren']);
 }

  //Measurable replication

  supertypeMeasurables : Array <any> = [];
  measurablesToReplicate: Set<any> = new Set<any>();

  @ViewChild('myModal')
  modal: ModalComponent;

  close() {
    if (this.measurablesToReplicate.size > 0){
      let protoMeasurables = Array.from(this.measurablesToReplicate);
      for (let protoMeasurable of protoMeasurables){
        let newMeasurable = model.Measuarable.new(protoMeasurable);
        newMeasurable.location = this.item;
      }
    }
  }

  open() {
    this.modal.open();
  }

  dismiss() {}

  generateMeasurables() {
    let allSupertypeMeasurables = [];
    for (let type of this.item.types) {
      for (let supertype of type.supertypes) {
        if (supertype.definition && supertype.definition.measurables) {
          let supertypeMeasurables = Array.from(new Set(supertype.definition.measurables.map((item:any) => item.type)));
          for (let supertypeMeasurable of supertypeMeasurables) {
            if (allSupertypeMeasurables.indexOf(supertypeMeasurable) < 0)
              allSupertypeMeasurables.push(supertypeMeasurable);
          }
        }
      }
    }

    //console.log("Supertype measurables", allSupertypeMeasurables);

    this.supertypeMeasurables = Array.from(allSupertypeMeasurables).map(x => {return {value: x, selected: this.measurablesToReplicate.has(x)}});

    this.open();
  }

  measurablesToReplicateChanged(option: any){
    if ( this.measurablesToReplicate.has(option.value) && !option.selected)
      this.measurablesToReplicate.delete(option.value);
    if (!this.measurablesToReplicate.has(option.value) && option.selected)
      this.measurablesToReplicate.add(option.value);
  }
}
