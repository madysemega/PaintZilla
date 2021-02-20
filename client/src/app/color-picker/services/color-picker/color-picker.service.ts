import { Injectable } from '@angular/core';
import { ColorConverter } from '@app/color-picker/classes/color-converter.class';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ColorPickerService {
    private currentColor: ColorConverter;
    private hueChangedSubject: BehaviorSubject<number>;
    private saturationChangedSource: BehaviorSubject<number>;
    private valueChangedSubject: BehaviorSubject<number>;
    private alphaChangedSource: BehaviorSubject<number>;
}
