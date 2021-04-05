import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MagnetismService {
  public isActivated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() { }

  public toggleMagnetism(): void{
    this.isActivated.next(!this.isActivated.value);
  }
}
