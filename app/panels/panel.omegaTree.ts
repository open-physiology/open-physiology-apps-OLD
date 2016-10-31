/**
 * Created by Natallia on 6/17/2016.
 */
import {Component} from '@angular/core';
import {TemplatePanel} from "./panel.template";
import {SetToArray} from "../transformations/pipe.general";

@Component({
  selector: 'omegaTree-panel',
  inputs: ['item', 'ignore', 'options'],
  template:`
    <group-panel [item]="item" 
      [ignore]   = "ignore"
      [options]  = "options"
      [custom]   = ""
      (saved)    = "saved.emit($event)"
      (canceled) = "canceled.emit($event)"
      (removed)  = "removed.emit($event)"
      (propertyUpdated) = "onPropertyUpdate($event)">
      
      <!--TreeParent-->
      <div  *ngIf="includeProperty('type')" class="input-control">
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
    
    </group-panel>
  `,
  directives: [TemplatePanel],
  pipes: [SetToArray]
})
export class OmegaTreePanel extends TemplatePanel{

  ngOnInit(){
    this.custom = new Set<string>(['treeParent', 'treeChildren']);

    super.ngOnInit();
    this.ignore = this.ignore.add('supertypes').add('subtypes').add('elements')
      .add('cardinalityMultipliers').add('treeParent').add('treeChildren');
  }

  onPropertyUpdate(event){
    this.propertyUpdated.emit(event);
  }
}
