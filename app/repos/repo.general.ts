"use strict";
import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/components/accordion';

import {DND_DIRECTIVES} from 'ng2-dnd/ng2-dnd';

import {AddToolbar} from '../components/toolbar.add';
import {FilterToolbar} from '../components/toolbar.filter';
import {SortToolbar} from '../components/toolbar.sort';

import {getIcon, ResourceName, model} from "../services/utils.model";

import {OrderBy, FilterBy, HideClass} from "../transformations/pipe.general";
import {PanelDispatchResources} from "../panels/dispatch.resources";
import {ItemHeader, RepoAbstract} from "./repo.abstract";
import {HighlightService} from "../services/service.highlight";
import {PropertyToolbar} from '../components/toolbar.propertySettings';

@Component({
  selector: 'repo-general',
  inputs: ['items', 'caption', 'ignore', 'types', 'selectedItem', 'activeItem', 'options'],
  template:`
     <div class="panel panel-info repo">
        <div class="panel-heading">{{caption}}
          <span class="pull-right" *ngIf="options?.showActive">
            <button type="button" class="btn btn-default btn-header" 
              [ngClass]="{'active': activeItem == null}" (click)="updateActive(null)">
              <span class = "glyphicon" [ngClass]="{'glyphicon-pencil': activeItem == null}"></span>
            </button>
          </span>
        </div>
        <div class="panel-body">
          <sort-toolbar  [options]="['Name', 'ID', 'Class']" (sorted)="onSorted($event)"></sort-toolbar>
          <add-toolbar   [options]="types" [transform]="getClassLabel" (added)="onAdded($event)"></add-toolbar>
          <property-toolbar  [options] = "typeOptions" [transform] = "getClassLabel" 
            (selectionChanged) = "hiddenTypesChanged($event)">
          </property-toolbar>

          <filter-toolbar [filter]="searchString" [options]="['Name', 'ID', 'Class']" (applied)="onFiltered($event)"></filter-toolbar>
                    
          <accordion class="list-group" [closeOthers]="true"> 
            <!--dnd-sortable-container [dropZones]="zones" [sortableData]="items">-->
          <accordion-group *ngFor="let item of items           
          | hideClass : hiddenTypes
          | orderBy : sortByMode 
          | filterBy: [searchString, filterByMode]; let i = index">
            <!--class="list-group-item" dnd-sortable [sortableIndex]="i"> -->
            <div accordion-heading 
              (click)="updateSelected(item)" 
              (mouseover)="updateHighlighted(item)" (mouseout)="cleanHighlighted(item)"
              [ngClass]="{highlighted: _highlightedItem == item}"
              >
              <item-header [item]="item" 
                [selectedItem]  ="selectedItem" 
                [isSelectedOpen]="isSelectedOpen" 
                [icon]          ="getIcon(item.class)">   
                <extra *ngIf="options?.showActive">
                  <button type="button" class="btn btn-default btn-header" 
                    [ngClass]="{'active': activeItem == item}" (click)="updateActive(item)">
                    <span class = "glyphicon" [ngClass]="{'glyphicon-pencil': activeItem == item}"></span>
                  </button>
                </extra>
              </item-header>
            </div>

            <div *ngIf="!options?.headersOnly">
              <panel-general *ngIf="item == selectedItem" [item]="item"
                [ignore]="ignore"
                (saved)="onSaved(item, $event)" 
                (canceled)="onCanceled($event)"
                (removed)="onRemoved(item)"
                (highlightedItemChange)="highlightedItemChange.emit($event)">
               </panel-general>   
            </div>
                
          </accordion-group>        
          </accordion>       
        </div>
      </div>
  `,
  styles: ['.repo{ width: 100%}'],
  directives: [
    SortToolbar, AddToolbar, FilterToolbar,
    ItemHeader,
    PanelDispatchResources, PropertyToolbar,
    ACCORDION_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, DND_DIRECTIVES],
  pipes: [OrderBy, FilterBy, HideClass]
})
export class RepoGeneral extends RepoAbstract{
  getIcon = getIcon;
  ignoreTypes = new Set([ResourceName.Border, ResourceName.Node]);
  typeOptions = [];

  constructor(highlightService: HighlightService){
    super(highlightService);
  }

  ngOnInit(){
    super.ngOnInit();
    this.typeOptions = this.types.filter(x => x.class != ResourceName.LyphWithAxis).map(x => (
      {selected: !this.ignoreTypes.has(x),
        value: x
      }
    ));
    //this.typeOptions.push({selected: !this.ignoreTypes.has("Type"), value: "Type"});
  }

  hiddenTypesChanged(option: any){
    if ( this.ignoreTypes.has(option.value) &&  option.selected) this.ignoreTypes.delete(option.value);
    if (!this.ignoreTypes.has(option.value) && !option.selected) this.ignoreTypes.add(option.value);
  }

  get hiddenTypes () {
    return Array.from(this.ignoreTypes);
  }

}
