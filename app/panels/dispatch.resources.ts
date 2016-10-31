import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ResourcePanel}         from './panel.resource';
import {TemplatePanel}         from './panel.template';

import {LyphPanel}             from './panel.lyph';
import {ProcessPanel}     from './panel.process';
import {BorderPanel}      from './panel.border';
import {OmegaTreePanel}   from './panel.omegaTree';

import {ResourceName, model}   from "../services/utils.model";
import {ToastyService, Toasty} from 'ng2-toasty/ng2-toasty';

@Component({
  selector: 'panel-general',
  inputs: ['item', 'ignore', 'options'],
  providers: [ToastyService],
  template:`
     <resource-panel *ngIf="useResourcePanel"
       [ignore]="ignore" [options]="options" [item]="item" 
       (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
       (highlightedItemChange)="highlightedItemChange.emit($event)"></resource-panel>
       
     <template-panel *ngIf="useTemplatePanel"
       [ignore]="ignore" [options]="options" [item]="item" 
       (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
       (highlightedItemChange)="highlightedItemChange.emit($event)"></template-panel>
     
     <!--Borders-->
     <border-panel *ngIf="item.class==ResourceName.Border" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
     (highlightedItemChange)="highlightedItemChange.emit($event)"></border-panel>

     <!--Processes-->      
     <process-panel *ngIf="item.class==ResourceName.Process" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
     (highlightedItemChange)="highlightedItemChange.emit($event)"></process-panel>

     <!--Lyphs-->      
     <lyph-panel *ngIf="item.class==ResourceName.Lyph" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
     (highlightedItemChange)="highlightedItemChange.emit($event)"></lyph-panel>

     <!--Omega trees-->
     <omegaTree-panel *ngIf="item.class==ResourceName.OmegaTree" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
     (highlightedItemChange)="highlightedItemChange.emit($event)"></omegaTree-panel>

     <ng2-toasty></ng2-toasty>
  `,
  directives:
    [
      ResourcePanel,
      TemplatePanel,
      BorderPanel, ProcessPanel, LyphPanel, OmegaTreePanel,
      Toasty
    ]
})
export class PanelDispatchResources{
  @Input() item: any;
  @Input() ignore: any;
  @Input() options: any;

  @Output() saved = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() highlightedItemChange = new EventEmitter();

  ResourceName = ResourceName;
  useResourcePanel = true; //All non-templates
  useTemplatePanel = false; //All standard templates

  constructor(private toastyService:ToastyService){ }

  ngOnInit(){
    if (this.item){
      if (
        (this.item.class == ResourceName.Causality) ||
        (this.item.class == ResourceName.Node) ||
        (this.item.class == ResourceName.Measurable) ||
        (this.item.class == ResourceName.Material) ||
        (this.item.class == ResourceName.CoalescenceScenario)) {
          this.useResourcePanel = false;
          this.useTemplatePanel = true;
      } else {
        if (
          (this.item.class == ResourceName.Border) ||
          (this.item.class == ResourceName.Lyph) ||
          (this.item.class == ResourceName.Process) ||
          (this.item.class == ResourceName.OmegaTree)){
          this.useResourcePanel = false;
        }
      }
    }
  }

  protected onSaved(event: any) {
    this.item.commit()
      .catch(reason => {
        let errorMsg = "Failed to commit resource: Relationship constraints violated! \n" +
          "See browser console (Ctrl+Shift+J) for technical details.";
        this.toastyService.error(errorMsg);
      });

    //Create type
    if (event.createType){
       let template = this.item;
       (async function() {
         let newType = model.Type.new({definition: template});
         template.p('name').subscribe(newType.p('name'));

         await newType.commit();
         //TODO: create only if types does not exist
         //let type = template['-->DefinesType'][2];
         console.log("Type created", newType);
       })();
    }

    this.saved.emit(this.item);
  }

  protected onCanceled() {
    this.item.rollback();
    //this.canceled.emit(this.item);
  }
}
