/**
 * Created by Natallia on 6/19/2016.
 */
import {Component} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {MultiSelectInput} from '../components/component.select';
import {RepoNested} from '../repos/repo.nested';
import {model} from "../services/utils.model";
import {SetToArray} from '../transformations/pipe.general';

@Component({
  selector: 'coalescenceScenario-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item] = "item" 
      [ignore] = "ignore"
      [options] ="options"
      (saved)    = "onSaved($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">

      <!--Lyphs-->
        <div class="input-control" *ngIf="includeProperty('lyphs')">
          <repo-nested [caption]="getPropertyLabel('lyphs')" 
          [items]="item.p('lyphs') | async | setToArray" 
          (updated)="updateProperty('lyphs', $event)"          
          [types]="[ResourceName.Lyph]"
          (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>
      <ng-content></ng-content>      

    </template-panel>
  `,
  directives: [TemplatePanel, MultiSelectInput, RepoNested],
  pipes: [SetToArray]
})
export class CoalescenceScenarioPanel extends TemplatePanel{

  onSaved(event: any){
    if (this.item && this.item.lyphs){
      if (this.item.lyphs.size != 2){
        console.log("Wrong number of lyphs", this.item.lyphs.size);
      }
    }
    this.saved.emit({createType: this.createType});
  }
}
