/**
 * Created by Natallia on 6/19/2016.
 */
import {Component} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {RADIO_GROUP_DIRECTIVES} from "ng2-radio-group";

@Component({
  selector: 'border-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item] = "item" 
      [ignore]   = "ignore"
      [options]  = "options"
      [custom]   = "custom" 
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" 
      (highlightedItemChange)="highlightedItemChange.emit($event)">
            
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
      
     <ng-content></ng-content>  
            
    </template-panel>
  `,
  directives: [TemplatePanel, RADIO_GROUP_DIRECTIVES]
})
export class BorderPanel extends TemplatePanel{

  onSelectChange(value){
    let newNature = (Array.isArray(value))? value.slice(): value;
    this.updateProperty('nature', newNature);
  }

  ngOnInit(){
    this.custom = new Set<string>(['nature']);
    super.ngOnInit();
    this.ignore = this.ignore
      .add('externals')
      .add('species')
      .add('measurables')
      .add('name')
      .add('types')
      .add('nodes')
      .add('cardinalityBase')
      .add('cardinalityMultipliers')
      .add('definedType');
  }
}
