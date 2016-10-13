/**
 * Created by Natallia on 7/23/2016.
 */
import {Component, Input} from '@angular/core';
import {OmegaTreeWidget} from './view.omegaTree';
import {OmegaTreeInfoWidget} from './view.omegaTreeInfo';
import {LyphWidget} from './view.lyph';
import {ResourceName} from '../services/utils.model';
import {ResizeService} from '../services/service.resize';
import {Subscription}   from 'rxjs/Subscription';

@Component({
  selector: 'resource-widget',
  inputs: ['item'],
  template : `
    <div class="panel panel-default">
      <div class="panel-heading">Resource <strong>{{item?.id}}{{(item)? ': ' + item.name : ''}}</strong></div>
      <div class="btn-group" *ngIf="item && (item.class == ResourceName.OmegaTree)">
        <button type="button" class="btn btn-default btn-icon" 
          [ngClass]="{'active': layout == 'tree'}" (click)="layout = 'resource'">
          <img class="icon" src="images/resource.png"/>
        </button>
        <button type="button" class="btn btn-default btn-icon" 
          [ngClass]="{'active': layout == 'stats'}" (click)="layout = 'info'">
          <span class="glyphicon glyphicon-info-sign"></span>
        </button>
      </div>

      <omega-tree *ngIf="item && (layout == 'resource') && (item.class == ResourceName.OmegaTree)" [item]="item"></omega-tree>  
      <omega-tree-info *ngIf="item && (layout == 'info') && (item.class == ResourceName.OmegaTree)" [item]="item"></omega-tree-info>  

      <lyph *ngIf="item && (item.class == ResourceName.Lyph)" [item]="item"></lyph>  
      
    </div> 
  `,
  directives: [OmegaTreeWidget, OmegaTreeInfoWidget, LyphWidget]
})
export class ResourceWidget{
  @Input() item: any;

  layout: string = 'resource';

  ResourceName = ResourceName;
  subscription: Subscription;

  constructor(public resizeService: ResizeService) {
    this.subscription = resizeService.resize$.subscribe(
      (event: any) => {
        if (event.target == "resource-widget"){
          this.onSetPanelSize(event);
        }
      });
  }

  ngOnChanges(changes: { [propName: string]: any }) {
    if (this.item && (this.item.class == ResourceName.Lyph)){}
  }

  onSetPanelSize(event: any){
    this.resizeService.announceResize({target: "omega-tree", size: event.size});
    this.resizeService.announceResize({target: "lyph", size: event.size});
  }

  ngOnDestroy() {this.subscription.unsubscribe();}
}
