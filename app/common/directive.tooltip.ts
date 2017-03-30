/**
 * Created by Natallia on 9/16/2016.
 */
import {Directive, TemplateRef, Input} from '@angular/core';

@Directive({ selector: '[tooltip]' })
export class TooltipDirective {
  @Input('tooltip') private content:string;
  @Input('tooltipHtml') public htmlContent:string | TemplateRef<any>;
  @Input('tooltipPlacement') private placement:string = 'top';
  @Input('tooltipIsOpen') private isOpen:boolean;
  @Input('tooltipEnable') private enable:boolean = 'true';
  @Input('tooltipAppendToBody') private appendToBody:boolean;
  @Input('tooltipClass') public popupClass:string;
  @Input('tooltipContext') public tooltipContext:any;
}
