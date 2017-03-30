/**
 * Created by Natallia on 7/23/2016.
 */
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ResizeService {
  private resizeSource = new Subject<any>();
  resize$ = this.resizeSource.asObservable();
  
  announceResize(event: any) {
    this.resizeSource.next(event);
  }
}
