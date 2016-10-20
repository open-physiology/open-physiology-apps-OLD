/**
 * Created by Natallia on 6/19/2016.
 */
import {Component} from '@angular/core';
import {ResourcePanel} from "./panel.resource";
import {MultiSelectInput} from '../components/component.select';
import {RepoNested} from '../repos/repo.nested';
import {model} from "../services/utils.model";
const {Resource} = model;

@Component({
  selector: 'externalResource-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <resource-panel [item] = "item" 
      [ignore] = "ignore"
      [options] ="options"
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "propertyUpdated.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)">

      <inputGroup *ngFor="let property of ['uri', 'type']">
        <div class="input-control input-control-lg" *ngIf="includeProperty(property)">
          <label for="comment">{{getPropertyLabel(property)}}: </label>
          <input type="text" class="form-control" [(ngModel)]="item[property]">
        </div>
        <ng-content select="inputGroup"></ng-content>
      </inputGroup>
      
      <!--Locals - TODO: map to categories-->
      <div class="input-control" *ngIf="includeProperty('locals')">
        <label for="locals">{{getPropertyLabel('locals')}}: </label>
        <select-input 
        [items]="item.p('locals') | async" 
        (updated)="updateProperty('locals', $event)" 
        [options]="item.fields['locals'].p('possibleValues') | async"></select-input>
      </div>

      <ng-content></ng-content>      

    </resource-panel>
  `,
  directives: [ResourcePanel, MultiSelectInput, RepoNested]
})
export class ExternalResourcePanel extends ResourcePanel{
  protected Resource = Resource;
  ngOnInit(){
    super.ngOnInit();
    this.ignore = this.ignore.add('externals');
  }
}
