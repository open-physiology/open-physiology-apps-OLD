/**
 * Created by Natallia on 6/17/2016.
 */
import {Component} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {RepoNested} from '../repos/repo.nested';
import {SetToArray} from "../transformations/pipe.general";

@Component({
  selector: 'group-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <template-panel [item]="item" 
      [ignore]   = "ignore"
      [options]  = "options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">
      
      <relationGroup>
        <!--Elements-->
        <div class="input-control" *ngIf="includeProperty('elements')">
           <repo-nested [caption]="getPropertyLabel('elements')" 
           [items] = "item.p('elements') | async | setToArray" 
           (updated)="updateProperty('elements', $event)"
           [types]="[ResourceName.Lyph, ResourceName.OmegaTree]"
           (highlightedItemChange)="highlightedItemChange.emit($event)"></repo-nested>
        </div>
         <ng-content select="relationGroup"></ng-content> 
      </relationGroup>
      
      <ng-content></ng-content>    
    
    </template-panel>
  `,
  directives: [TemplatePanel, RepoNested],
  pipes: [SetToArray]
})
export class GroupPanel extends TemplatePanel{}
