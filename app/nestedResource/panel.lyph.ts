/**
 * Created by Natallia on 6/17/2016.
 */
import {Component, ViewChild, EventEmitter, Input, Output} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {SingleSelectInput, MultiSelectInput} from './component.select';
import {SetToArray} from "../common/pipe.general";
import {BorderPanel} from "./panel.border";
import {TemplateValue} from './component.templateValue';
import {NestedResourceList} from "./nestedResource.list";
import {model} from "../common/utils.model";
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'lyph-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item]="item" 
        [ignore]  = "ignore"
        [options] = "options"
        [custom]  = "custom" 
        (saved)   = "saved.emit($event)"
        (canceled)= "canceled.emit($event)"
        (removed) = "removed.emit($event)"
        (propertyUpdated) = "propertyUpdated.emit($event)" 
        (highlightedItemChange)="highlightedItemChange.emit($event)">
        
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
              <nested-resource-list [caption]="getPropertyLabel(property)" 
                 [items]  = "item.p(property) | async | setToArray" 
                 [types]  = "getTypes(property)" 
                 [options] = "borderOptions"
                 (updated) = "updateProperty(property, $event)"
                 (highlightedItemChange)="highlightedItemChange.emit($event)">
              </nested-resource-list>
            </div>
          </borderGroup>
        </fieldset>
        
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
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="close()">Ok</button>
          </modal-footer>
        </modal>
        
        <ng-content></ng-content>  

    </template-panel>  
    
  `,
  directives: [TemplatePanel,
    BorderPanel, TemplateValue,  SingleSelectInput, MultiSelectInput, NestedResourceList, MODAL_DIRECTIVES],
  pipes: [SetToArray]
})
export class LyphPanel extends TemplatePanel{
  @Output() saved = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() propertyUpdated = new EventEmitter();
  @Output() highlightedItemChange = new EventEmitter();

  borderOptions = {'readOnly': true, 'hideRemove': true, 'hideCreateType': true};

  layersIgnore  : Set<string> = new Set<string>();
  patchesIgnore : Set<string> = new Set<string>();
  partsIgnore   : Set<string> = new Set<string>();
  segmentsIgnore: Set<string> = new Set<string>();

  ngOnInit(){
    this.custom = new Set<string>([
      'thickness', 'length',
      'axis', 'radialBorders', 'longitudinalBorders']);
    super.ngOnInit();
    if (!this.item.axis) {
      this.ignore.add('axis');
    }

    this.layersIgnore   = new Set<string>(['cardinalityBase', 'cardinalityMultipliers']);
    this.patchesIgnore  = new Set<string>(['cardinalityBase', 'cardinalityMultipliers']);
    this.partsIgnore    = new Set<string>(['cardinalityBase', 'cardinalityMultipliers']);
    this.segmentsIgnore = new Set<string>(['cardinalityBase', 'cardinalityMultipliers']);
 }

  //Measurable replication
  supertypeMeasurables : Array <any> = [];
  measurablesToReplicate: Set<any> = new Set<any>();

  @ViewChild('myModal')
  modal: ModalComponent;

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
    this.supertypeMeasurables = allSupertypeMeasurables.map(x =>
      {return {value: x, selected: this.measurablesToReplicate.has(x)}});
    this.modal.open();
  }

  close() {
    if (this.measurablesToReplicate.size > 0){
      let protoMeasurables = Array.from(this.measurablesToReplicate);
      for (let protoMeasurable of protoMeasurables){
        let newMeasurable = model.Measuarable.new(protoMeasurable);
        newMeasurable.location = this.item;
      }
    }
  }

  measurablesToReplicateChanged(option: any){
    if ( this.measurablesToReplicate.has(option.value) && !option.selected)
      this.measurablesToReplicate.delete(option.value);
    if (!this.measurablesToReplicate.has(option.value) && option.selected)
      this.measurablesToReplicate.add(option.value);
  }

}
