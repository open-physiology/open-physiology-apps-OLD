/**
 * Created by Natallia on 6/19/2016.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/components/dropdown';

@Component({
  selector: 'toolbar-add',
  inputs: ['options', 'transform'],
  template: `
      <div *ngIf="options?.length > 1" class="btn-group" dropdown>
        <button type="button" class="btn btn-default btn-icon dropdown-toggle" aria-label="Add" dropdownToggle>
          <span class="glyphicon glyphicon-plus"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="Add">
          <li *ngFor="let option of options; let i = index" role="menuitem" (click)="added.emit(option)">
            <a class="dropdown-item" href="#">{{transform? transform(option): option}}</a>
          </li>
        </ul>
      </div>
      <button *ngIf="options?.length === 1" 
        type="button" class="btn btn-default btn-icon" (click)="added.emit(options[0])">
        <span class="glyphicon glyphicon-plus"></span>
      </button>
    `,
  directives:[DROPDOWN_DIRECTIVES, CORE_DIRECTIVES]
})
export class ToolbarAdd {
  @Output() added = new EventEmitter();
}






