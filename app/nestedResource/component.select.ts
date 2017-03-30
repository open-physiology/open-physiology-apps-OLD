/**
 * Created by Natallia on 7/23/2016.
 */
import {Component, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {MapToOptions, SetToArray} from "../common/pipe.general";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';

////////////////////////////////////////////////////////////////////////////////
// select-input ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'select-input',
  inputs: ['items', 'options', 'disabled'],
  template:`
    <div *ngIf="active">
      <ng-select 
        [items]       = "options | setToArray | mapToOptions"
        [initData]    = "items   | setToArray | mapToOptions"
        [multiple]    = "true"
        [disabled]    = "disabled"
        (data)        = "refreshValue($event)"
      ></ng-select>
    </div>
    `,
  directives: [SELECT_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
  pipes: [MapToOptions, SetToArray],

})
export class MultiSelectInput {

  @Input()  options: Set<any> = new Set<any>();
  @Input()  items:   Set<any> = new Set<any>();
  @Output() updated = new EventEmitter();

  active: boolean = true;

  externalChange = false;
  ngOnChanges(changes: {[propName: string]: any}) {
    if (this.externalChange){
      setTimeout(() => { this.active = false }, 0);
      setTimeout(() => { this.active = true  }, 0);
    }
    this.externalChange = true;
  }

  refreshValue(value: Array<any>):void {
    this.externalChange = false;
    let newItems = value.map(x => x.id);
    this.updated.emit(new Set(newItems));
  }
}

////////////////////////////////////////////////////////////////////////////////
// select-1-input //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'select-input-1',
  inputs: ['item', 'options', 'disabled'],
  template:`
    <div *ngIf="active">
      <ng-select
        [items]       = "options | setToArray | mapToOptions"
        [initData]    = "items | mapToOptions"
        [multiple]    = false
        [disabled]    = "disabled"
        (data)        = "refreshValue($event)"
      ></ng-select>
    </div>
  `,
  directives: [SELECT_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
  pipes: [MapToOptions, SetToArray]
})
export class SingleSelectInput {
  @Input() item: any;
  @Input() options: Array<any>;
  @Output() updated = new EventEmitter();

  active: boolean = true;
  externalChange = false;

  public get items () {
    return this.item? [this.item]: [];
  }

  ngOnChanges(changes: {[propName: string]: any}) {
    if (this.externalChange){
      setTimeout(() => {this.active = false}, 0);
      setTimeout(() => {this.active = true}, 0);
    }
    this.externalChange = true;
  }

  public refreshValue(value: any):void {
    //let options: any[] = (this.options[0] && this.options[0].children)? [].concat.apply([], this.options.map(item => item.children)): this.options;
    this.externalChange = false;
    if(value.id){
      this.item = value.id;
      this.updated.emit(this.item);
    }
  }
}
