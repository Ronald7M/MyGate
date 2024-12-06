import { Injectable } from '@angular/core';
import {interval, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  constructor() {}

  startTimer(): Observable<number> {
    return new Observable<number>((observer) => {
      let count = 0; // Contor pentru secundele trecute

      const timer$ = interval(1000).subscribe(() => {
        observer.next(count++);
      });

    });
  }
}
