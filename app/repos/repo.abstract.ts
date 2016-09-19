/**
 * Created by Natallia on 7/8/2016.
 */
import {Input, Output, EventEmitter} from '@angular/core';
import {ResourceName, getClassLabel, getIcon, getItemClass, model} from "../services/utils.model";
import {HighlightService} from "../services/service.highlight";
import {Subscription}   from 'rxjs/Subscription';

export abstract class RepoAbstract{
  @Output() added = new EventEmitter();
  @Output() removed = new EventEmitter();
  @Output() updated = new EventEmitter();
  @Output() selectedItemChange = new EventEmitter();
  @Output() activeItemChange = new EventEmitter();
  @Output() highlightedItemChange = new EventEmitter();

  @Input() items: Array<any> = [];
  @Input() types: Array<any> = [];
  @Input() options: any = {};
  @Input() selectionOptions: any;
  _selectedItem: any;
  _activeItem: any;
  _highlightedItem: any;

  zones: Array<string> = [];
  ignore: Set<string> = new Set<string>();

  sortByMode: string = "unsorted";
  filterByMode: string = "Name";
  searchString: string = "";
  isSelectedOpen: boolean = false;

  hs: Subscription;

  getClassLabel = getClassLabel;
  getIcon = getIcon;
  getItemClass = getItemClass;


  constructor(highlightService: HighlightService){
    this.hs = highlightService.highlightedItemChanged$.subscribe(item => {
      if (this.items.indexOf(item) > -1){
        this._highlightedItem = item;
        //console.log("One of my items is highlighted!", this.items);
      }
    })
  }

  ngOnDestroy() {
    if (this.hs) this.hs.unsubscribe();
  }

  public set selectedItem (item: any) {
    if (this._selectedItem != item){
      this._selectedItem = item;
      this.selectedItemChange.emit(item);
    }
  }

  public get selectedItem () {
    return this._selectedItem;
  }

  public set activeItem (item: any) {
    if (this._activeItem != item){
      this._activeItem = item;
      this.activeItemChange.emit(item);
    }
  }

  public get activeItem () {
    return this._activeItem;
  }

  public set highlightedItem (item: any) {
    if (this.highlightedItem != item){
      this._highlightedItem = item;
      this.highlightedItemChange.emit(item);
    }
  }

  public get highightedItem () {
    return this._highlightedItem;
  }

  ngOnInit(){
    if (!this.items) this.items = [];
    if (this.items[0] || !this.selectedItem)
      this.selectedItem = this.items[0];
    //Resources
    if (this.types.length == 0) {
      for (let x in ResourceName) {
        this.types.push(x);
      }
    }
    this.zones = this.types.map(x => x + "_zone");
  }

  protected updateHighlighted(item){
    this.highlightedItem = item;
  }

  protected cleanHighlighted(item){
    if (this.highlightedItem == item) this.highlightedItem = null;
  }

  protected updateActive(item: any){
    this.activeItem = item;
  }

  protected updateSelected(item: any){
    this.selectedItem = item;
    this.isSelectedOpen = !this.isSelectedOpen;
  }

  protected onSorted(prop: string){
    this.sortByMode = prop.toLowerCase();
  }

  protected onFiltered(config: any){
    this.filterByMode = config.mode.toLowerCase();
    this.searchString = config.filter;
  }

  protected onSaved(item: any, updatedItem: any){
    this.updated.emit(this.items);
    if (item == this.selectedItem){
       this.selectedItemChange.emit(this.selectedItem);
    }
  }

  protected onCanceled(updatedItem: any){}

  protected onRemoved(item: any){
    if (!this.items) return;
    let index = this.items.indexOf(item);
    if (index > -1) this.items.splice(index, 1);
    if (item == this.selectedItem){
      if (this.items.length > 0)
        this.selectedItem = this.items[0];
      else
        this.selectedItem = null;
    }
    item.delete();
    this.removed.emit(item);
    this.updated.emit(this.items);
  }

  protected onAdded(Class: any){
    let options: any = {};
    if (Class == ResourceName.LyphWithAxis) {
      Class = ResourceName.Lyph;
      options.createAxis = true;
    }
    if (Class == ResourceName.Lyph) {
      options.createRadialBorders = true;
    }

    let newItem = model[Class].new({name: "New " + Class}, options);

    if (Class == ResourceName.Material) {
      let newType = model.Type.new({name: newItem.name, definition: newItem});
      newItem.p('name').subscribe(newType.p('name'));
    }

    this.items.push(newItem);
    this.updated.emit(this.items);
    this.added.emit(newItem);
    this.selectedItem = newItem;
  }


}
