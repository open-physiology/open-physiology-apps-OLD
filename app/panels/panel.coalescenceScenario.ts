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
      <relationGroup *ngFor="let property of ['lyphs']">
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
  directives: [TemplatePanel, RepoNested],
  pipes: [SetToArray]
})
export class CoalescenceScenarioPanel extends TemplatePanel{

  onSaved(event: any){
    if (this.item && this.item.lyphs && (this.item.lyphs.size != 2)){
      console.log("Wrong number of lyphs", this.item.lyphs.size);
    }
    this.saved.emit({createType: this.createType});
  }
}
