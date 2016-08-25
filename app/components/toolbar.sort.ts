/**
 * Created by Natallia on 7/29/2016.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/components/dropdown';

@Component({
  selector: 'sort-toolbar',
  inputs: ['options'],
  template: `
      <div class="btn-group" dropdown>
        <button type="button" class="btn btn-default btn-icon dropdown-toggle" aria-label="SortAsc" dropdownToggle>
          <span class="glyphicon glyphicon-sort-by-attributes" aria-hidden="true"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="SortAsc">
          <li role="menuitem" (click)="onClick('unsorted')">
            <a class="dropdown-item" href="#">
            <span *ngIf="sortByMode == 'unsorted'">&#10004;</span>
            (unsorted)</a>
          </li>
          <li class="divider"></li>
          <li *ngFor="let option of options; let i = index" role="menuitem" (click)="onClick(option)">
            <a class="dropdown-item" href="#">
              <span *ngIf="sortByMode == option">&#10004;</span>
              {{option}}
            </a>
          </li>
        </ul>
      </div>
      <div class="btn-group" dropdown>
        <button type="button" class="btn btn-default btn-icon dropdown-toggle" aria-label="SortDesc" dropdownToggle>
          <span class="glyphicon glyphicon-sort-by-attributes-alt" aria-hidden="true"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="SortDesc">
          <li *ngFor="let option of options; let i = index" role="menuitem" (click)="onClick('-'+option)">
            <a class="dropdown-item" href="#">
             <span *ngIf="sortByMode == '-'+option">&#10004;</span>
             {{option}}
            </a>
          </li>
        </ul>
      </div>
    `,
  directives: [DROPDOWN_DIRECTIVES, CORE_DIRECTIVES]
})
export class SortToolbar {
  sortByMode = "unsorted";
  @Output() sorted = new EventEmitter();
  constructor(){}

  onClick(item: any){
    this.sortByMode = item;
    this.sorted.emit(item);
  }
}
