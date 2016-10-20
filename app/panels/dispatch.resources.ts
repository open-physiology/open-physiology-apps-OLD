import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ResourcePanel}         from './panel.resource';
import {ExternalResourcePanel} from './panel.externalResource';
import {MaterialPanel}         from './panel.material';
import {LyphPanel}             from './panel.lyph';

import {CausalityPanel}   from './panel.causality';
import {ProcessPanel}     from './panel.process';
import {NodePanel}        from './panel.node';
import {BorderPanel}      from './panel.border';
import {MeasurablePanel}  from './panel.measurable';
import {CorrelationPanel} from './panel.correlation';
import {CoalescencePanel} from './panel.coalescence';
import {CoalescenceScenarioPanel} from './panel.coalescenceScenario';

import {GroupPanel}       from './panel.group';
import {OmegaTreePanel}   from './panel.omegaTree';

import {TypePanel}        from './panel.type';

import {ResourceName, model}   from "../services/utils.model";
import {ToastyService, Toasty} from 'ng2-toasty/ng2-toasty';

@Component({
  selector: 'panel-general',
  inputs: ['item', 'ignore', 'options'],
  providers: [ToastyService],
  template:`
    <!--External resources-->
    <externalResource-panel *ngIf="item.class == ResourceName.ExternalResource"
     [item]="item" [ignore]="ignore" [options]="options" 
     (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></externalResource-panel>

    <!--Materials-->
    <material-panel *ngIf="item.class==ResourceName.Material"
     [item]="item" [ignore]="ignore" [options]="options" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></material-panel>
    
     <!--Lyphs-->      
    <lyph-panel *ngIf="item.class==ResourceName.Lyph" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></lyph-panel>

    <!--Processes-->      
    <process-panel *ngIf="item.class==ResourceName.Process" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></process-panel>
   
    <!--Mesurables-->
    <measurable-panel *ngIf="item.class==ResourceName.Measurable" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></measurable-panel>
   
    <!--Causalities-->
    <causality-panel *ngIf="item.class==ResourceName.Causality" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></causality-panel>
    
    <!--Nodes-->
    <node-panel *ngIf="item.class==ResourceName.Node" [ignore]="ignore" [options]="options" 
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></node-panel>

    <!--Borders-->
    <border-panel *ngIf="item.class==ResourceName.Border" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></border-panel>
    
    <!--Groups-->
    <group-panel *ngIf="item.class==ResourceName.Group" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></group-panel>

    <!--Omega trees-->
    <omegaTree-panel *ngIf="item.class==ResourceName.OmegaTree" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></omegaTree-panel>

     <!--Publications: generic panel-->
     <resource-panel *ngIf="item.class==ResourceName.Publication" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></resource-panel>

     <!--Correlations-->
     <correlation-panel *ngIf="item.class==ResourceName.Correlation" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></correlation-panel>

     <!--Clinical indices: generic panel-->
     <resource-panel *ngIf="item.class==ResourceName.ClinicalIndex" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></resource-panel>  

     <!--Coalescence-->
     <coalescence-panel *ngIf="item.class==ResourceName.Coalescence" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></coalescence-panel>

     <!--CoalescenceScenario-->
     <coalescenceScenario-panel *ngIf="item.class==ResourceName.CoalescenceScenario" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></coalescenceScenario-panel>

     <!--Type-->
     <type-panel *ngIf="isType" [ignore]="ignore" [options]="options"
     [item]="item" (saved)="onSaved($event)" (canceled)="onCanceled($event)" (removed)="removed.emit($event)" (highlightedItemChange)="highlightedItemChange.emit($event)"></type-panel>
     
     <ng2-toasty></ng2-toasty>
  `,
  directives:
    [
      ResourcePanel, ExternalResourcePanel,
      MaterialPanel,
      LyphPanel,
      MeasurablePanel,
      ProcessPanel,
      CausalityPanel, NodePanel, BorderPanel,
      CorrelationPanel, CoalescencePanel, CoalescenceScenarioPanel,
      GroupPanel, OmegaTreePanel, TypePanel,
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

  constructor(private toastyService:ToastyService){ }

  isType = false;

  ngOnInit(){
    if (this.item){
      if (this.item.class.indexOf('Type') > -1) this.isType = true;
    }
  }

  protected onSaved(event: any) {
    this.item.commit()
        .catch(reason => {
          let errorMsg = "Failed to commit resource: Relationship constraints violated! \n" +
            "See browser console (Ctrl+Shift+J) for technical details.";
          console.error(reason);
          this.toastyService.error(errorMsg);
        });

    //console.log("Saving panel", event);

    //create type
    if (event.createType){
       let template = this.item;
       (async function() {
         let newType = model.Type.new({definition: template});
         template.p('name').subscribe(newType.p('name'));

         await newType.commit();
         //TODO: create only if types does not exist
         //let type = template['-->DefinesType'][2];
         //console.log("Type created", newType);
       })();
    }

    this.saved.emit(this.item);
  }

  protected onCanceled() {
    this.item.rollback();
    //this.canceled.emit(this.item);
  }
}
