"use strict";
import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/components/accordion';

import {DND_DIRECTIVES} from 'ng2-dnd/ng2-dnd';

import {ToolbarAdd} from './toolbar.add';
import {ToolbarFilter} from './toolbar.filter';
import {ToolbarSort} from './toolbar.sort';

import {resourceClassNames, model} from "../common/utils.model";

import {OrderBy, FilterBy, HideClass} from "../common/pipe.general";
import {PanelDispatchResources} from "./dispatch.resources";
import {AbstractResourceList} from "./nestedResource.abstract";
import {ItemHeader} from "./component.itemHeader";
import {HighlightService} from "./service.highlight";
import {ToolbarPropertySettings} from '../common/toolbar.propertySettings';


@Component({
  selector: 'nested-resource-widget',
  providers: [HighlightService],
  inputs: ['items', 'caption', 'ignore', 'types', 'selectedItem', 'activeItem', 'highlightedItem', 'options'],
  template:`
     <div class="panel panel-info repo">
        <div class="panel-heading">{{caption}}
          <span class="pull-right" *ngIf="options?.showActive">
            <button type="button" class="btn btn-default btn-header" 
              [ngClass]="{'active': activeItem === null}" (click)="updateActive(null)">
              <span class = "glyphicon" [ngClass]="{'glyphicon-pencil': activeItem === null}"></span>
            </button>
          </span>
        </div>
        <div class="panel-body">
          <toolbar-sort  [options]="['Name', 'ID', 'Class']" (sorted)="onSorted($event)"></toolbar-sort>
          <toolbar-add   [options]="types" [transform]="getClassLabel" (added)="onAdded($event)"></toolbar-add>
          <toolbar-propertySettings  [options] = "typeOptions" [transform] = "getClassLabel" 
            (selectionChanged) = "hiddenTypesChanged($event)">
          </toolbar-propertySettings>

          <toolbar-filter [filter]="searchString" [options]="['Name', 'ID', 'Class']" (applied)="onFiltered($event)"></toolbar-filter>
                    
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
              [ngClass]="{highlighted: _highlightedItem === item}"
              >
              <item-header [item]="item" 
                [selectedItem]  ="selectedItem" 
                [isSelectedOpen]="isSelectedOpen" 
                [icon]          ="getResourceIcon(item)">   
                <extra *ngIf="options?.showActive">
                  <button type="button" class="btn btn-default btn-header" 
                    [ngClass]="{'active': activeItem === item}" (click)="updateActive(item)">
                    <span class = "glyphicon" [ngClass]="{'glyphicon-pencil': activeItem === item}"></span>
                  </button>
                </extra>
              </item-header>
            </div>

            <div *ngIf="!options?.headersOnly">
              <panel-general *ngIf="item === selectedItem" [item]="item"
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
    ToolbarSort, ToolbarAdd, ToolbarFilter,
    ItemHeader,
    PanelDispatchResources, ToolbarPropertySettings,
    ACCORDION_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, DND_DIRECTIVES],
  pipes: [OrderBy, FilterBy, HideClass]
})
export class NestedResourceWidget extends AbstractResourceList{
  ignoreTypes = new Set([resourceClassNames.Border, resourceClassNames.Node]);
  typeOptions = [];
  highlightService;

  constructor(highlightService: HighlightService){
    super(highlightService);
    this.highlightService = highlightService;
  }

  ngOnInit(){
    super.ngOnInit();
    this.typeOptions = this.types.filter(x => x.class !== resourceClassNames.LyphWithAxis).map(x => (
      { selected: !this.ignoreTypes.has(x), value: x }
    ));
    this.typeOptions.push({selected: !this.ignoreTypes.has("Type"), value: "Type"});
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    if( changes['highlightedItem'] && changes['highlightedItem'].previousValue !== changes['highlightedItem'].currentValue ) {
      if (this.highlightService){
        //propagate externally highlighted item
        this.highlightService.highlight(this.highightedItem);
      }
    }
  }

  hiddenTypesChanged(option: any){
    if ( this.ignoreTypes.has(option.value) &&  option.selected) this.ignoreTypes.delete(option.value);
    if (!this.ignoreTypes.has(option.value) && !option.selected) this.ignoreTypes.add(option.value);
  }

  get hiddenTypes () {
    return Array.from(this.ignoreTypes);
  }

}
