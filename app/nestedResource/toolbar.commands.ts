/**
 * Created by Natallia on 7/29/2016.
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'toolbar-commands',
  inputs: ["options"],
  template: `
    <button *ngIf="!options?.hideRemove"
      type="button" class="btn btn-default btn-icon" aria-label="Remove" (click)="removed.emit()">
      <span class="glyphicon glyphicon-remove"></span>
    </button>
    <div class="btn-group">
      <button *ngIf="!options?.hideSave" 
        type="button" class="btn btn-default btn-icon" aria-label="Save" (click)="saved.emit()">
        <span class="glyphicon glyphicon-check"></span>
      </button>
      <button 
        *ngIf="!options?.hideRestore" 
        type="button" class="btn btn-default btn-icon" aria-label="Restore" (click)="canceled.emit()">
        <span class="glyphicon glyphicon-refresh"></span>
      </button>    
    </div>
  `
})
export class ToolbarCommands {
  @Input() options: any;
  @Output() removed = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() saved = new EventEmitter();
}

