/**
 * Created by Natallia on 6/28/2016.
 */
import {Component, forwardRef, Input, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/components/accordion';
import {DND_DIRECTIVES} from 'ng2-dnd/ng2-dnd';
import {model} from '../common/utils.model';

import {ToolbarAdd} from './toolbar.add';
import {ToolbarFilter} from './toolbar.filter';
import {ToolbarSort} from './toolbar.sort';

import {PanelDispatchResources} from "./dispatch.resources";
import {AbstractResourceList} from "./nestedResource.abstract";
import {ItemHeader} from "./component.itemHeader";
import {OrderBy, FilterBy, SetToArray, FilterByClass} from "../common/pipe.general";
import {SingleSelectInput} from "./component.select";

import {Subscription}   from 'rxjs/Subscription';
import {ToastyService, Toasty} from 'ng2-toasty/ng2-toasty';
import {HighlightService} from "./service.highlight";

@Component({
  selector: 'nested-resource-list',
  inputs: ['items', 'caption', 'ignore', 'types', 'selectedItem', 'options', 'selectionOptions'],
  providers: [ToastyService],
  template:`
    <div class="panel repo-nested">
      <div class="panel-heading"> <label>{{caption}}: </label></div>
      <div class="panel-body" >
        <span  *ngIf = "!(options?.readOnly || options?.headersOnly)">
          <select-input-1 class="pull-left input-select" [item] = "itemToInclude"
           (updated) = "itemToInclude = $event"    
           [options] = "selectionOptions">
          </select-input-1>
          <button type="button" class="btn btn-default btn-icon" (click)="onIncluded(itemToInclude)">
            <span class="glyphicon glyphicon-save"></span>
          </button>
        </span>
        
        <toolbar-sort   *ngIf =  "options?.sortToolbar"  [options]="['Name', 'ID', 'Class']" (sorted)="onSorted($event)"></toolbar-sort>
        <toolbar-add    *ngIf = "!(options?.readOnly || options?.headersOnly)"  [options]="types" [transform]="getClassLabel" (added)="onAdded($event)"></toolbar-add>
        <toolbar-filter *ngIf =  "options?.filterToolbar" [options]="['Name', 'ID', 'Class']" [filter]="searchString" (applied)="onFiltered($event)"></toolbar-filter>
          
        <accordion class="list-group" [closeOthers]="true"
          dnd-sortable-container [dropZones]="zones" [sortableData]="items">
          <accordion-group *ngFor="let item of items 
            | orderBy : sortByMode 
            | filterBy: [searchString, filterByMode]; let i = index" 
            class="list-group-item" dnd-sortable (onDragStart)="onDragStart()" (onDragEnd)="onDragEnd()"
           [sortableIndex]="i">
            <div accordion-heading 
              (click)="updateSelected(item)" 
              (mouseover)="updateHighlighted(item)" (mouseout)="cleanHighlighted(item)"
              [ngClass]="{highlighted: _highlightedItem === item}">
              <item-header [item]="item" 
                [selectedItem]="selectedItem" 
                [isSelectedOpen]="isSelectedOpen" 
                [icon]="getResourceIcon(item)">
              </item-header>
            </div>

            <div *ngIf="!options?.headersOnly">
              <panel-general *ngIf="item === selectedItem" 
                [item]    ="item" 
                [ignore]  ="ignore"
                [options] ="options"
                (saved)   ="onSaved(item, $event)" 
                (removed) ="onRemoved(item)"
                (highlightedItemChange)="highlightedItemChange.emit($event)"
                ></panel-general>            
            </div>
          </accordion-group>        
        </accordion>       
      </div>
    </div>
    <ng2-toasty></ng2-toasty>
  `,
  directives: [ItemHeader, ToolbarSort, ToolbarAdd, ToolbarFilter, SingleSelectInput,
    forwardRef(() => PanelDispatchResources),
    ACCORDION_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, DND_DIRECTIVES,
    Toasty],
  pipes: [OrderBy, FilterBy, SetToArray]
})
export class NestedResourceList extends AbstractResourceList{
  includeExisting = false;
  itemToInclude: any = null;

  ts: Subscription;

  constructor(protected toastyService:ToastyService, highlightService: HighlightService){
    super(highlightService);
  }

  ngOnInit(){
    super.ngOnInit();

    //If selectionOptions are not provided by parent, subscribe and get all for given types
    if (!this.selectionOptions) {
      if (this.types.length === 1){
        this.ts = model[this.types[0]].p('all').subscribe(
          (data: any) => {
            this.selectionOptions = data;
          });
      } else {
        if (this.types.length > 1){
          let setToArray = new SetToArray();
          let filterByClass = new FilterByClass();

          this.ts = model.Template.p('all').subscribe(
            (data: any) => {this.selectionOptions = new Set(filterByClass.transform(setToArray.transform(data), this.types))});
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.ts)
      this.ts.unsubscribe();
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    if (this.items) {
      if (this.options.ordered) {
        this.items.sort((a, b) => {
          return (a['-->HasLayer'].relativePosition - b['-->HasLayer'].relativePosition)
        });
      }
    }
  }

  onDragStart(index: number){ }

  onDragEnd(index: number){
    if (this.options.ordered){
        for (let i = 0; i < this.items.length; i++){
          this.items[i]['-->HasLayer'].relativePosition = i;
        }
        this.updated.emit(this.items);
    }
  }

  onIncluded(newItem: any){
    if (newItem){
      if (this.items.indexOf(newItem) < 0){

        this.items.push(newItem);
        this.updated.emit(this.items);
        this.added.emit(newItem);
        this.selectedItem = newItem;

      } else {
        this.toastyService.error("Selected resource is already included to the set!");
      }
    }
  }
}
