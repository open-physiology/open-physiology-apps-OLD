/**
 * Created by Natallia on 7/23/2016.
 */
import {Component, Input} from '@angular/core';
import {CanonicalTreeWidget} from './canonicalTree.tree';
import {CanonicalTreeInfoWidget} from './canonicalTree.info';
import {LyphWidget} from './lyph.rectangle';
import {modelClassNames} from '../common/utils.model';

@Component({
  selector: 'resource-widget',
  inputs: ['item', 'size'],
  template : `
    <div class="panel panel-default">
      <div class="panel-heading">Resource <strong>{{item?.id}}{{(item)? ': ' + item.name : ''}}</strong></div>
      <div class="btn-group" *ngIf="item && (item.class === modelClassNames.CanonicalTree)">
        <button type="button" class="btn btn-default btn-icon" 
          [ngClass]="{'active': layout === 'tree'}" (click)="layout = 'resource'">
          <img class="icon" src="images/resource.png"/>
        </button>
        <button type="button" class="btn btn-default btn-icon" 
          [ngClass]="{'active': layout === 'stats'}" (click)="layout = 'info'">
          <span class="glyphicon glyphicon-info-sign"></span>
        </button>
      </div>

      <canonical-tree *ngIf="(layout === 'resource') && (item?.class === modelClassNames.CanonicalTree)" 
        [item]="item" [size]="size"></canonical-tree>  
      <canonical-tree-info *ngIf="(layout === 'info') && (item?.class === modelClassNames.CanonicalTree)" 
        [item]="item"></canonical-tree-info>  

      <lyph *ngIf="item?.class === modelClassNames.Lyph" [item]="item" [size]="size"></lyph>  
      
    </div> 
  `,
  directives: [CanonicalTreeWidget, CanonicalTreeInfoWidget, LyphWidget]
})
export class ResourceWidget{
  @Input() item: any;
  @Input() size: any = {width: 600, height: 300};

  layout: string = 'resource';
  modelClassNames = modelClassNames;
}
