/**
 * Created by Natallia on 9/13/2016.
 */
/**
 * Created by Natallia on 6/21/2016.
 */
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {getIcon} from "../services/utils.model";

@Component({
  "inputs": ["items", "activeItem"],
  "selector": "pallete-toolbar",
  "template": `
      <div class="input-control">
        <div class="btn-group" style="float: left;">
          <button *ngFor="let item of items" type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': activeItem == item}" (click)="activeItemChange.emit(item)">
            <img class="icon" src="{{getIcon(item)}}"/>
          </button>
        </div>
      </div>
   `
})
export class PalleteToolbar{
  @Input() items: any;
  @Input() activeItem: any;

  @Output() activeItemChange = new EventEmitter();
  
  getIcon = getIcon;
}
