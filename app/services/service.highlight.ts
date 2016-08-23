/**
 * Created by Natallia on 7/23/2016.
 */
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class HighlightService {
  private highlightedItem = new Subject<any>(); 
  highlightedItem$ = this.highlightedItem.asObservable();
  highlightedItemChange(event: any) {
    this.highlightedItem.next(event);
  }
}
