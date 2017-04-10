/**
 * Created by Natallia on 7/15/2016.
 */
import {Component, Input, Output} from '@angular/core';
import {HierarchyGraph} from "./hierarchy.graph";
import {HierarchyTree}  from "./hierarchy.tree";

import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/components/dropdown';
import {Subscription}   from 'rxjs/Subscription';
import {ToolbarPropertySettings} from '../common/toolbar.propertySettings';
import {getColor, getPropertyLabel} from "../common/utils.model";

@Component({
  selector: 'hierarchy-widget',
  inputs: ['item', 'depth', 'size'],
  template : `
    <div class="panel panel-default">
      <div class="panel-heading">
        Relations of <strong>{{item?.id}}{{(item)? ': ' + item.name : ''}}</strong>
      </div>
      <div class="panel-body">
        <!--Relations-->
        <toolbar-propertySettings  
          [options] = "relationOptions"
          [transform] = "getPropertyLabel"
          (selectionChanged) = "selectedRelationsChanged($event)">
        </toolbar-propertySettings>
        
        <!--Depth-->
        <div class="input-group input-control-md pull-left">
          <span class="input-group-addon" id="basic-addon1">Depth</span>
          <input type="number" class="form-control" aria-describedby="basic-addon1"
            min="0" max="50" [(ngModel)]="depth" >
        </div>
        
        <!--Layout-->
        <div class="btn-group pull-left">
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': layout == 'tree'}" (click)="layout = 'tree'">
            <img class="icon" src="images/tree.png"/>
          </button>
          <button type="button" class="btn btn-default btn-icon" 
            [ngClass]="{'active': layout == 'graph'}" (click)="layout = 'graph'">
            <img class="icon" src="images/graph.png"/>
          </button>
        </div>
        
        <hierarchy-tree *ngIf="layout == 'tree'" 
          [item]="item" [relations]="relations" [depth]="depth" [size]="size"></hierarchy-tree>
        <hierarchy-graph *ngIf="layout == 'graph'" 
          [item]="item" [relations]="relations" [depth]="depth" [size]="size"></hierarchy-graph>
        
      </div>     
    </div>
  `,
  directives: [HierarchyGraph, HierarchyTree, DROPDOWN_DIRECTIVES, CORE_DIRECTIVES, ToolbarPropertySettings]
})
export class HierarchyWidget{
  @Input() item: any;
  @Input() depth: number = 2;
  @Input() size: any = {width: 600, height: 300};

  relations: Set<string> = new Set<string>();

  relationOptions: Array<any> = [];
  propertyOptions: Array<any> = [];
  Class: any;
  getPropertyLabel = getPropertyLabel;

  layout = "tree";
  subscription: Subscription;


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(){
    if (this.item){
      this.Class = this.item.class;
      this.updateRelations();
    }
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    if (this.item && (this.item.class != this.Class)){
      this.Class = this.item.class;
      this.updateRelations();
    }
  }

  updateRelations(){
    let privateRelations: Set<string> = new Set(["themes"]);

    this.relationOptions = [];
    if (this.item){
      for (let relation of Object.keys(this.item.constructor.relationshipShortcuts)) {
        if (privateRelations.has(relation)) { continue; }
        this.relationOptions.push({value: relation, selected: false, color: getColor(relation)});
      }
      if (this.relationOptions.length > 0) this.relationOptions[0].selected = true;
    }
    this.relations = new Set(this.relationOptions.filter(x => x.selected).map(x => x.value));
  }

  selectedRelationsChanged(option: any){
    if (!this.relations.has(option.value) && option.selected) this.relations.add(option.value);
    if (this.relations.has(option.value) && !option.selected) this.relations.delete(option.value);

    let copy = this.relations;     //TODO: use an observable
    setTimeout(() => { this.relations = new Set<string>()}, 0);
    setTimeout(() => { this.relations = copy }, 0);
  }
}
