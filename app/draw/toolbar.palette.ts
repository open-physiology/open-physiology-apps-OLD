/**
 * Created by Natallia on 9/13/2016.
 */
import {Component, Input, EventEmitter, Output} from '@angular/core';
import {TOOLTIP_DIRECTIVES} from 'ng2-bootstrap/components/tooltip';
import {TooltipDirective} from "../common/directive.tooltip";

@Component({
  "inputs": ["items", "activeItem", "transform"],
  "selector": "toolbar-palette",
  "template": `
      <div class="btn-group pull-left">
        <label *ngFor="let item of items" type="button" class="btn btn-default btn-icon" 
          tooltip="{{transform? transform(item): item}}" tooltipPlacement="bottom"
          [ngClass]="{'active': activeItem === item}" (click)="activeItemChange.emit(item)">
          <img class="icon" src="{{item.constructor.icon}}"/>
        </label>
      </div>
   `,
  "directives": [TOOLTIP_DIRECTIVES, TooltipDirective]
})
export class ToolbarPalette{
  @Input() items: any;
  @Input() activeItem: any;
  @Output() activeItemChange = new EventEmitter();
}
