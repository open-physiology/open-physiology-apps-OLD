/**
 * Created by Natallia on 7/15/2016.
 */
import {Component, Input, Output} from '@angular/core';
import {RelationshipGraph} from "./view.relationGraph";
import {RelationshipTree}  from "./view.relationTree";
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/components/dropdown';
import {ResizeService} from '../services/service.resize';
import {Subscription}   from 'rxjs/Subscription';
import {PropertyToolbar} from '../components/toolbar.propertySettings';
import {getColor, getPropertyLabel, model} from "../services/utils.model";

@Component({
  selector: 'hierarchy-widget',
  inputs: ['item', 'relations', 'depth'],
  template : `
    <div class="panel panel-default">
      <div class="panel-heading">
        Relations of <strong>{{item?.id}}{{(item)? ': ' + item.name : ''}}</strong>
      </div>
      <div class="panel-body">
          <!--Relations-->
          <property-toolbar  
            [options] = "relationOptions"
            [transform] = "getPropertyLabel"
            (selectionChanged) = "selectedRelationsChanged($event)">
          </property-toolbar>
          
          <!--Depth-->
          <div class="input-group input-group-sm" style="width: 150px; float: left;">
            <span class="input-group-addon" id="basic-addon1">Depth</span>
            <input type="number" class="form-control" aria-describedby="basic-addon1"
              min="0" max="50" [(ngModel)]="depth" >
          </div>
          
          <!--Layout-->
          <div class="btn-group">
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
          [item]="item" [relations]="relations" [depth]="depth"></hierarchy-tree>
        <hierarchy-graph *ngIf="layout == 'graph'" 
          [item]="item" [relations]="relations" [depth]="depth"></hierarchy-graph>
      </div>     
    </div>
  `,
  directives: [RelationshipGraph, RelationshipTree,
    DROPDOWN_DIRECTIVES, CORE_DIRECTIVES, PropertyToolbar]
})
export class RelationshipWidget{
  @Input() item: any;
  @Input() relations  : Set<string> = new Set<string>();
  @Input() depth: number = 2;

  relationOptions: Array<any> = [];
  propertyOptions: Array<any> = [];
  Class: any;
  getPropertyLabel = getPropertyLabel;

  layout = "tree";
  subscription: Subscription;

  constructor(public resizeService: ResizeService) {
    this.subscription = resizeService.resize$.subscribe(
      (event: any) => {
        if (event.target == "hierarchy-widget") {
          this.onSetPanelSize(event);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSetPanelSize(event: any){
    this.resizeService.announceResize({target: "hierarchy-tree", size: event.size});
    this.resizeService.announceResize({target: "hierarchy-graph", size: event.size});
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
      let relations = Object.assign({}, this.item.constructor.relationshipShortcuts);
      for (let relation in relations) {
        if (privateRelations.has(relation)) continue;
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
