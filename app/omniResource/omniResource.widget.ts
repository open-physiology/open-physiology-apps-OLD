/**
 * Created by Natallia on 7/23/2016.
 */
import {Component, Input} from '@angular/core';
import {CanonicalTreeWidget} from './canonicalTree.tree';
import {CanonicalTreeInfoWidget} from './canonicalTree.info';
import {LyphWidget} from './lyph.rectangle';
import {resourceClassNames} from '../common/utils.model';
import {ResizeService} from '../common/service.resize';
import {Subscription}   from 'rxjs/Subscription';

@Component({
  selector: 'resource-widget',
  inputs: ['item'],
  template : `
    <div class="panel panel-default">
      <div class="panel-heading">Resource <strong>{{item?.id}}{{(item)? ': ' + item.name : ''}}</strong></div>
      <div class="btn-group" *ngIf="item && (item.class === resourceClassNames.CanonicalTree)">
        <button type="button" class="btn btn-default btn-icon" 
          [ngClass]="{'active': layout === 'tree'}" (click)="layout = 'resource'">
          <img class="icon" src="images/resource.png"/>
        </button>
        <button type="button" class="btn btn-default btn-icon" 
          [ngClass]="{'active': layout === 'stats'}" (click)="layout = 'info'">
          <span class="glyphicon glyphicon-info-sign"></span>
        </button>
      </div>

      <canonical-tree *ngIf="(layout === 'resource') && (item?.class === resourceClassNames.CanonicalTree)" [item]="item"></canonical-tree>  
      <canonical-tree-info *ngIf="(layout === 'info') && (item?.class === resourceClassNames.CanonicalTree)" [item]="item"></canonical-tree-info>  

      <lyph *ngIf="item?.class === resourceClassNames.Lyph" [item]="item"></lyph>  
      
    </div> 
  `,
  directives: [CanonicalTreeWidget, CanonicalTreeInfoWidget, LyphWidget]
})
export class ResourceWidget{
  @Input() item: any;

  layout: string = 'resource';

  resourceClassNames = resourceClassNames;
  subscription: Subscription;

  constructor(public resizeService: ResizeService) {
    this.subscription = resizeService.resize$.subscribe(
      (event: any) => {
        if (event.target === "resource-widget"){
          this.onSetPanelSize(event);
        }
      });
  }

  onSetPanelSize(event: any){
    this.resizeService.announceResize({target: "canonical-tree", size: event.size});
    this.resizeService.announceResize({target: "lyph", size: event.size});
  }

  ngOnDestroy() {this.subscription.unsubscribe();}
}
