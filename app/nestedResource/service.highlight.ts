/**
 * Created by Natallia on 7/23/2016.
 */
import { Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class HighlightService {
  public highlightedItemChanged$: EventEmitter<any>;

  constructor() {
    this.highlightedItemChanged$ = new EventEmitter();
  }

  public highlight(item: any): void {
    this.highlightedItemChanged$.emit(item);
  }

}
