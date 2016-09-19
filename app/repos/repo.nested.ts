/**
 * Created by Natallia on 6/28/2016.
 */
import {Component, forwardRef, Input, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/components/accordion';
import {DND_DIRECTIVES} from 'ng2-dnd/ng2-dnd';
import {compareLinkedParts, model} from '../services/utils.model';

import {AddToolbar} from '../components/toolbar.add';
import {FilterToolbar} from '../components/toolbar.filter';
import {SortToolbar} from '../components/toolbar.sort';

import {PanelDispatchResources} from "../panels/dispatch.resources";
import {RepoAbstract} from "./repo.abstract";
import {ItemHeader} from "./repo.itemHeader";
import {OrderBy, FilterBy, SetToArray, FilterByClass} from "../transformations/pipe.general";
import {SingleSelectInput} from "../components/component.select";

import {Subscription}   from 'rxjs/Subscription';
import {ToastyService, Toasty} from 'ng2-toasty/ng2-toasty';
import {HighlightService} from "../services/service.highlight";

@Component({
  selector: 'repo-nested',
  inputs: ['items', 'caption', 'ignore', 'types', 'selectedItem', 'options', 'selectionOptions'],
  providers: [ToastyService],
  template:`
    <div class="panel panel-warning repo-nested">
      <div class="panel-heading">{{caption}}</div>
      <div class="panel-body" >
        <span  *ngIf = "!(options?.readOnly || options?.headersOnly)">
          <select-input-1
            style="float: left;" [item] = "itemToInclude"
           (updated) = "itemToInclude = $event"    
           [options] = "selectionOptions">
          </select-input-1>
          <button type="button" class="btn btn-default btn-icon" (click)="onIncluded(itemToInclude)">
            <span class="glyphicon glyphicon-save"></span>
          </button>
        </span>
        
        <sort-toolbar   *ngIf =  "options?.sortToolbar"  [options]="['Name', 'ID', 'Class']" (sorted)="onSorted($event)"></sort-toolbar>
        <add-toolbar    *ngIf = "!(options?.readOnly || options?.headersOnly)"  [options]="types" [transform]="getClassLabel" (added)="onAdded($event)"></add-toolbar>
        <filter-toolbar *ngIf =  "options?.filterToolbar" [options]="['Name', 'ID', 'Class']" [filter]="searchString" (applied)="onFiltered($event)"></filter-toolbar>
          
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
                [icon]="getIcon(getItemClass(item))">
              </item-header>
            </div>

            <div *ngIf="!options?.headersOnly">
              <panel-general *ngIf="item == selectedItem" 
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
  directives: [ItemHeader, SortToolbar, AddToolbar, FilterToolbar, SingleSelectInput,
    forwardRef(() => PanelDispatchResources),
    ACCORDION_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, DND_DIRECTIVES,
    Toasty],
  pipes: [OrderBy, FilterBy, SetToArray]
})
export class RepoNested extends RepoAbstract{
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
      if (this.types.length == 1){
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
    //Set correct initial order for linked set]
    if (this.items) {
      if (this.options.linked) {
        this.items.sort((a, b) => compareLinkedParts(a, b));
      }
      else if (this.options.ordered) {
        this.items.sort((a, b) => {
          return (a['-->HasLayer'].relativePosition - b['-->HasLayer'].relativePosition)
        });
      }
      /*if ((this.types.length == 1)) {
        console.log("Nested repo " + this.types[0], this.items);
      }*/
    }
  }

  onDragStart(index: number){ }

  onDragEnd(index: number){
    if (this.options.linked){
      this.items[0].treeParent = null;
      for (let i = 1; i < this.items.length; i++){
        this.items[i].treeParent = this.items[i - 1];
      }
      this.updated.emit(this.items);
    }
    else
      if (this.options.ordered){
        for (let i = 0; i < this.items.length; i++){
          this.items[i]['-->HasLayer'].relativePosition = i;
        }
        this.updated.emit(this.items);
      }
  }

  protected onAdded(Class: any){
    super.onAdded(Class);
    if (this.options.linked) this.linkAdded();
  }

  onIncluded(newItem: any){
    if (newItem){
      if (this.items.indexOf(newItem) < 0){
        if (this.options.linked) this.linkAdded();

        this.items.push(newItem);
        this.updated.emit(this.items);
        this.added.emit(newItem);
        this.selectedItem = newItem;

      } else {
        this.toastyService.error("Selected resource is already included to the set!");
      }
    }
  }

  linkAdded(){
    if (this.selectedItem){
      let index = this.items.indexOf(this.selectedItem);
      if (index > 0) {
        this.selectedItem.treeParent = this.items[index -1];
      }
    }
  }
}
