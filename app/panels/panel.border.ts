/**
 * Created by Natallia on 6/19/2016.
 */
import {Component} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {RADIO_GROUP_DIRECTIVES} from "ng2-radio-group";
import {SetToArray} from "../transformations/pipe.general";
import {RepoNested} from "../repos/repo.nested";

@Component({
  selector: 'border-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item] = "item" 
      [ignore] = "ignore"
      [options]  = "options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
            
      <!--Nature-->
      <div class="input-control" *ngIf="includeProperty('nature')">
        <fieldset>
          <legend>{{getPropertyLabel('nature')}}:</legend>
           <checkbox-group [ngModel]="item.nature" (ngModelChange)="onSelectChange(item.nature)">
             <input type="checkbox" value="open">open&nbsp;
             <input type="checkbox" value="closed">closed<br/>
           </checkbox-group>
        </fieldset>
      </div>
      
       <relationGroup *ngFor="let property of ['nodes', 'measurables']">
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
  directives: [TemplatePanel, RepoNested, RADIO_GROUP_DIRECTIVES],
  pipes: [SetToArray]
})
export class BorderPanel extends TemplatePanel{

  onSelectChange(value){
    let newNature = (Array.isArray(value))? value.slice(): value;
    this.updateProperty('nature', newNature);
    //this.propertyUpdated.emit({property: 'nature', values: newNature});
  }

  ngOnInit(){
    super.ngOnInit();
    this.ignore = this.ignore
      .add('externals')
      .add('species')
      .add('measurables')
      .add('name')
      .add('types')
      .add('nodes')
      .add('cardinalityBase')
      .add('cardinalityMultipliers');
  }
}
