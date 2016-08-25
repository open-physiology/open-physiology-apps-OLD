/**
 * Created by Natallia on 7/28/2016.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/components/dropdown';

@Component({
  selector: 'filter-toolbar',
  inputs: ['filter', 'options'],
  template: `
      <div class="input-group input-group-sm" style="width: 220px;">
        <input type="text" class="form-control" 
        [value]="filter" (input)="updateValue($event)" (keyup.enter)="applied.emit({filter: filter, mode: mode});"/>
        <div class="input-group-btn" dropdown>
          <button type="button" class="btn btn-secondary dropdown-toggle" aria-label="Filter" dropdownToggle
            aria-haspopup="true" aria-expanded="false">
             <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="Filter">
            <li *ngFor="let option of options; let i = index" (click)="updateMode(option)">
              <a class="dropdown-item" href="#"> <span *ngIf="mode == option">&#10004;</span>{{option}}</a>
            </li>            
          </ul>
        </div>
      </div>
    `,
  styles: [':host {float: right;}'],
  directives: [DROPDOWN_DIRECTIVES, CORE_DIRECTIVES]
})
export class FilterToolbar {
  options: string[];
  filter: string;
  mode: string;
  @Output() applied = new EventEmitter();

  constructor(){}

  ngOnInit(){
    if (this.options && (this.options.length > 0)) this.mode = this.options[0];
  }

  updateMode(option: string){
    this.mode = option;
    this.applied.emit({filter: this.filter, mode: this.mode});
  }

  updateValue(event: any){
    this.filter = event.target.value;
    //Remove filter if search string is empty
    if (this.filter.trim().length == 0)
      this.applied.emit({filter: this.filter, mode: this.mode});
  }

}
