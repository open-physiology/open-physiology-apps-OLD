/**
 * Created by Natallia on 6/14/2016.
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SingleSelectInput, MultiSelectInput} from '../components/component.select';
import {FormToolbar} from '../components/toolbar.form';
import {MapToCategories} from "../transformations/pipe.general";
import {PropertyToolbar} from '../components/toolbar.propertySettings';
import {ResourceName} from "../services/utils.model";
import {getPropertyLabel as generalPropertyLabel} from "../services/utils.model";
import {RepoNested} from "../repos/repo.nested";
import {SetToArray} from "../transformations/pipe.general";

@Component({
  selector: 'resource-panel',
  inputs: ['item', 'ignore', 'options', 'custom'],
  template:`
    <div class="panel">
        <div class="panel-body">
          <form-toolbar  
            [options]  = "options"
            (saved)    = "saved.emit(item)"
            (canceled) = "canceled.emit(item)"
            (removed)  = "removed.emit(item)">            
          </form-toolbar>
          <property-toolbar  
            [options] = "properties"
            [transform] = "getPropertyLabel"
            (selectionChanged) = "selectionChanged($event)">
          </property-toolbar>
          
          <ng-content select="toolbar"></ng-content>
                    
          <div class="panel-content">
            <!--INPUT-->
            <inputGroup *ngFor="let property of inputGroup">
              <div class="input-control input-control-lg" *ngIf="includeProperty(property)">
                <label for="comment">{{getPropertyLabel(property)}}: </label>
                <input class="form-control" 
                  [type]="inputGroupParams[property].type" 
                  [(ngModel)]="item[property]">
              </div>
              <ng-content select="inputGroup"></ng-content>
            </inputGroup>
            
            <!--SINGLE SELECT-->
            <selectGroup *ngFor="let property of selectGroup">
              <div class="input-control" *ngIf="includeProperty(property)">      
                <label>{{getPropertyLabel(property)}}: </label>
                <select-input-1 [item] = "item.p(property) | async" 
                  (updated) = "updateProperty(property, $event)"  
                  [options] = "item.fields[property].p('possibleValues') | async">
                </select-input-1>
              </div>
              <ng-content select="selectGroup"></ng-content>
            </selectGroup>

            <!--MULTI SELECT-->
            <multiSelectGroup *ngFor="let property of multiSelectGroup">
               <div class="input-control" *ngIf="includeProperty(property)">
                  <label>{{getPropertyLabel(property)}}: </label>
                  <select-input [items] = "item.p(property) | async"
                   (updated) = "updateProperty(property, $event)"    
                   [options] = "item.fields[property].p('possibleValues') | async">
                  </select-input>
              </div>
              <ng-content select="multiSelectGroup"></ng-content>
            </multiSelectGroup>
            
            <!--NESTED RESOURCES-->
            <relationGroup *ngFor="let property of relationGroup">
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
              
          </div>
        </div>
    </div>
  `,
  directives: [FormToolbar, PropertyToolbar, SingleSelectInput, MultiSelectInput, RepoNested],
  pipes: [MapToCategories, SetToArray]
})
export class ResourcePanel {
  @Input() item: any;
  @Input() ignore: Set<string> = new Set<string>();
  @Input() options: any;
  @Input() custom: Set<string> = new Set<string>();

  @Output() saved = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() propertyUpdated = new EventEmitter();
  @Output() highlightedItemChange = new EventEmitter();

  protected ResourceName = ResourceName;
  protected privateProperties: Set<string> = new Set([
    "class", "themes", "parents", "children"
  ]);
  protected multiSelectProperties: Set<string> = new Set([
    'externals',
    'subtypes', 'supertypes',
    'clinicalIndices', 'correlations',
    'cardinalityMultipliers', 'types',
    'materials', 'locations',
    'causes','effects']);

  protected properties       = [];
  protected multiSelectGroup = [];
  protected inputGroup       = [];
  protected selectGroup      = [];
  protected relationGroup    = [];

  protected inputGroupParams  = {};

  protected getPropertyLabel(option: string){
    if (this.item)
      if ((this.item.class === ResourceName.Lyph) ||
        (this.item.class === ResourceName.CanonicalTree)) {
        if (option === "cardinalityBase") return "Branching factor";
      }
    return generalPropertyLabel(option);
  }

  getTypes(property: string): any{
    let partnerClass = this.item.constructor.relationshipShortcuts[property].codomain.resourceClass;
    let subClasses = /*(partnerClass.allSubclasses)?
      Object.keys(partnerClass.allSubclasses()).filter(x => !x.abstract).map(x => x.name):*/
      [partnerClass.name];
    return subClasses;
  }

  //TODO: input fields - choose type
  //TODO: disable readOnly fields

  ngOnInit(){
    this.ignore.add("id").add("href");
    this.setPropertySettings();

    /*Auto-generated visual groups*/

    //Properties
    let properties = Object.entries(this.item.constructor.properties)
      .filter(x => !this.privateProperties.has(x[0]) && !this.custom.has(x[0]));
    //Relations
    let relations = Object.entries(this.item.constructor.relationshipShortcuts)
      .filter(x => !x[1].abstract && !this.privateProperties.has(x[0]) && !this.custom.has(x[0]));

    //console.log("Properties", properties);
    //console.log("Relations", relations);

    //Input fields
    this.inputGroup = properties.map(x => x[0]);
    for (let x of properties){
      this.inputGroupParams[x[0]] = {
          type: ((x[1].type === "integer") || (x[1].type === "number"))? "number": "text",
          step: (x[1].type === "number")? 0.1: 1
        }
    }

    //Nested resources
    this.relationGroup = relations.filter(x =>
      ((x[1].cardinality.max !== 1) && !this.multiSelectProperties.has(x[0]))).map(x => x[0]);
    //Multi-select combo box
    this.multiSelectGroup = relations.filter(x =>
      ((x[1].cardinality.max !== 1) && this.multiSelectProperties.has(x[0]))).map(x => x[0]);
    //Single-select combo-box
    this.selectGroup = relations.filter(x => (x[1].cardinality.max === 1)).map(x => x[0]);
  }

  setPropertySettings(){
    if (this.item && this.item.constructor) {
      let properties = Object.assign({}, this.item.constructor.properties, this.item.constructor.relationshipShortcuts);

      for (let property of Object.keys(properties)) {
        if (this.privateProperties.has(property)) { continue; }

        if ((property === 'radialBorders') || (property === 'longitudinalBorders')) {
          if (!this.properties.find(x => (x.value === "borders")))
            this.properties.push({value: "borders", selected: !this.ignore.has("borders")});
          continue;
        }
        this.properties.push({value: property, selected: !this.ignore.has(property)});
      }
    }
  }

  selectionChanged(option: any){
    if ( this.ignore.has(option.value) &&  option.selected) this.ignore.delete(option.value);
    if (!this.ignore.has(option.value) && !option.selected) this.ignore.add(option.value);
  }

  includeProperty(prop: string){
    return !this.ignore.has(prop);
  }

  updateProperty(property: string, item: any){
    if (this.item.constructor &&
      this.item.constructor.properties &&
      this.item.constructor.properties[property]
      && this.item.constructor.properties[property].readonly) return;

      this.item[property] = item;
      this.propertyUpdated.emit({property: property, values: item});
  }

  addItem(parent: any, property: string, item: any){
    if (parent && (parent[property])){
      parent[property].add(item);
      this.propertyUpdated.emit({property: property, values: parent[property]});
    }
  }

  removeItem(parent: any, property: string, item: any){
    item.delete();
    this.updateProperty(property, parent[property]);
  }

}
