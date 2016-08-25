/**
 * Created by Natallia on 6/19/2016.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/components/dropdown';

@Component({
  selector: 'add-toolbar',
  inputs: ['options', 'transform'],
  template: `
      <div *ngIf="options && (options.length > 1)" class="btn-group" dropdown>
        <button type="button" class="btn btn-default btn-icon dropdown-toggle" aria-label="Add" dropdownToggle>
          <span class="glyphicon glyphicon-plus"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="Add">
          <li *ngFor="let option of options; let i = index" role="menuitem" (click)="added.emit(option)">
            <a class="dropdown-item" href="#">{{transform? transform(option): option}}</a>
          </li>
        </ul>
      </div>
      <button *ngIf="options && (options.length == 1)" 
        type="button" class="btn btn-default btn-icon" (click)="added.emit(options[0])">
        <span class="glyphicon glyphicon-plus"></span>
      </button>
    `,
  directives:[DROPDOWN_DIRECTIVES, CORE_DIRECTIVES]
})
export class AddToolbar {
  @Output() added = new EventEmitter();
}

@Component({
  selector: 'form-toolbar',
  inputs: ["options"],
  template: `
    <button *ngIf="!(options && options.hideRemove)"
      type="button" class="btn btn-default btn-icon" aria-label="Remove" (click)="removed.emit()">
      <span class="glyphicon glyphicon-remove"></span>
    </button>
    <button *ngIf="!(options && options.hideSave)" 
      type="button" class="btn btn-default" aria-label="Save" (click)="saved.emit()">
      <span class="glyphicon glyphicon-check"></span>
    </button>
    <button 
      *ngIf="!(options && options.hideRestore)" 
      type="button" class="btn btn-default" aria-label="Restore" (click)="canceled.emit()">
      <span class="glyphicon glyphicon-refresh"></span>
    </button>
    `
})
export class FormToolbar {
  @Output() removed = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() saved = new EventEmitter();

  constructor(){};
}





