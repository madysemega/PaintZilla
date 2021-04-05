import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    isActivated: BehaviorSubject<boolean> = new BehaviorSubject(false);

    toggleMagnetism(): void {
        this.isActivated.next(!this.isActivated.value);
    }
}
