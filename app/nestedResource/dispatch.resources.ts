import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ResourcePanel}         from './panel.resource';
import {TemplatePanel}         from './panel.template';

import {LyphPanel}             from './panel.lyph';
import {ProcessPanel}          from './panel.process';
import {BorderPanel}           from './panel.border';

import {resourceClassNames, model}   from "../common/utils.model";
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
     <border-panel *ngIf="item?.class===resourceClassNames.Border" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
     (highlightedItemChange)="highlightedItemChange.emit($event)"></border-panel>

     <!--Processes-->      
     <process-panel *ngIf="item?.class===resourceClassNames.Process" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
     (highlightedItemChange)="highlightedItemChange.emit($event)"></process-panel>

     <!--Lyphs-->      
     <lyph-panel *ngIf="item?.class===resourceClassNames.Lyph" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" 
     (highlightedItemChange)="highlightedItemChange.emit($event)"></lyph-panel>

     <ng2-toasty></ng2-toasty>
  `,
  directives:
    [
      ResourcePanel, TemplatePanel,
      BorderPanel, ProcessPanel, LyphPanel,
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

  resourceClassNames = resourceClassNames;
  useResourcePanel = true; //All non-templates
  useTemplatePanel = false; //All standard templates

  constructor(private toastyService:ToastyService){ }

  ngOnInit(){
    if (this.item){
      if ([resourceClassNames.Causality,
          resourceClassNames.Node,
          resourceClassNames.Measurable,
          resourceClassNames.Material,
          resourceClassNames.CoalescenceScenario,
          resourceClassNames.CanonicalTree,
          resourceClassNames.CanonicalTreeBranch
        ].includes(this.item.class)) {
          this.useResourcePanel = false;
          this.useTemplatePanel = true;
      } else {
        //Custom panels
        if ([resourceClassNames.Border,
            resourceClassNames.Lyph,
            resourceClassNames.Process
          ].includes(this.item.class)){ this.useResourcePanel = false; }
      }
    }
  }

  protected onSaved(event: any) {
    this.item.commit()
      .catch(reason => {
        let errorMsg = "Failed to commit resource: Relationship constraints violated! \n" +
          "See browser console (Ctrl+Shift+J) for technical details.";
        this.toastyService.error(errorMsg);
        console.log(reason);
      });

    if (event.createType){
       let template = this.item;
       if (!template['-->DefinesType']){
         (async function() {
           let newType = model.Type.new({definition: template});
           template.p('name').subscribe(newType.p('name'));

           await newType.commit();
         })();
       }
    }

    this.saved.emit(this.item);
  }

  protected onCanceled() {
    this.item.rollback();
    //this.canceled.emit(this.item);
  }
}
