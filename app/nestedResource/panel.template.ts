/**
 * Created by Natallia on 6/17/2016.
 */
import {Component} from '@angular/core';
import {resourceClassNames} from '../common/utils.model';
import {ResourcePanel} from "./panel.resource";
import {TemplateValue} from './component.templateValue';
import {SetToArray, HideClass} from "../common/pipe.general";

@Component({
  selector: 'template-panel',
  inputs: ['item', 'ignore', 'options', 'custom'],
  template:`
    <resource-panel [item]="item" 
      [ignore]   = "ignore"
      [options]  = "options"
      [custom]   = "custom"
      (saved)    = "onSaved($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" 
      (highlightedItemChange)="highlightedItemChange.emit($event)">
      
      <toolbar *ngIf="!options?.hideCreateType" >
        <ng-content select="toolbar"></ng-content>
        <input type="checkbox" [disabled]="typeCreated" [(ngModel)]="createType">Create type
      </toolbar>
      
      <!--Cardinality base-->
      <templateGroup *ngFor = "let property of ['cardinalityBase']">
        <template-value *ngIf="includeProperty(property)" 
          [caption]="getPropertyLabel(property)" 
          [item]="item.p(property) | async"
          [step]="0.1"
          (updated)="updateProperty(property, $event)">
        </template-value>
      </templateGroup>   
    
      <ng-content></ng-content>      

    </resource-panel>
  `,
  directives: [ResourcePanel, TemplateValue]
})
export class TemplatePanel extends ResourcePanel{
  createType = false;
  typeCreated = false;
  cardinalityMultipliers = {};

  ngOnInit(){
    if (!this.ignore) {
      this.ignore = new Set<string>(["cardinalityBase", "cardinalityMultipliers", "definedType"]);
    }
    if (!this.custom) {
      this.custom = new Set<string>();
    }
    this.custom.add("cardinalityBase");

    super.ngOnInit();

    if (this.item){
      this.typeCreated = !!this.item['-->DefinesType'];
      //Options for cardinality multipliers
      this.item.fields['cardinalityMultipliers'].p('possibleValues').subscribe(
          (data: any) => {
            this.cardinalityMultipliers =
              new Set(new HideClass().transform(
                new SetToArray().transform(data), [resourceClassNames.Border, resourceClassNames.Node]));
          });
    }
  }

  onSaved(event: any){
    if (this.item.class === resourceClassNames.CoalescenceScenario){
      if (this.item.lyphs && (this.item.lyphs.size !== 2)){
        console.log("Wrong number of lyphs", this.item.lyphs.size);
      }
    }
    this.saved.emit({createType: this.createType});
  }
}
