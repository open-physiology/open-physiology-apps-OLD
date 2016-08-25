/**
 * Created by Natallia on 7/24/2016.
 */
/**
 * Created by Natallia on 7/7/2016.
 */
import {Component, ComponentRef, Directive, ContentChild, TemplateRef, ElementRef,
  Input, ViewContainerRef, ComponentResolver, ComponentFactory} from '@angular/core';

@Directive({
  selector: '[dcl-wrapper]'
})
export class DynamicLoader {
  @Input() target: any;
  @Input() type: any;
  @Input() input: any;
  cmpRef: ComponentRef<any>;
  private isViewInitialized: boolean = false;

  constructor(private resolver: ComponentResolver) {}

  updateComponent() {
    if (!this.isViewInitialized) {return;}
    if (this.cmpRef) {this.cmpRef.destroy();}
    this.resolver.resolveComponent(this.type).then((factory: ComponentFactory<any>) => {
      this.cmpRef = this.target.createComponent(factory);
      this.cmpRef.instance.input = this.input;
    });
  }
  ngOnChanges() {
    this.updateComponent();
  }
  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();
  }
  ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}

