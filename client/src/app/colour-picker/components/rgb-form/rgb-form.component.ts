import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as RegularExpressions from '@app/colour-picker/constants/regular-expressions.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { combineLatest, Subscription } from 'rxjs';
@Component({
    selector: 'app-rgb-form',
    templateUrl: './rgb-form.component.html',
    styleUrls: ['./rgb-form.component.scss'],
})
export class RgbFormComponent implements OnInit, OnDestroy {
    rgbaFormGroup: FormGroup = new FormGroup({
        redForm: new FormControl('', [Validators.required, Validators.pattern(RegularExpressions.RGB_FORM_REGEX)]),
        greenForm: new FormControl('', [Validators.required, Validators.pattern(RegularExpressions.RGB_FORM_REGEX)]),
        blueForm: new FormControl('', [Validators.required, Validators.pattern(RegularExpressions.RGB_FORM_REGEX)]),
        alphaForm: new FormControl('', [Validators.required, Validators.pattern(RegularExpressions.ALPHA_FORM_REGEX)]),
    });
    private colourSubscription: Subscription;
    private rgbaFormSubscription: Subscription;
    constructor(private colourPickerService: ColourPickerService, private rgbaFormService: RgbaFormService) {}

    ngOnInit(): void {
        this.rgbaFormService.rgbaFormGroup = this.rgbaFormGroup;
        this.colourSubscription = combineLatest([
            this.colourPickerService.hueObservable,
            this.colourPickerService.saturationObservable,
            this.colourPickerService.valueObservable,
            this.colourPickerService.alphaObservable,
        ]).subscribe(() => {
            // console.log('From for colour subscription change, current colour =  ' + this.colourPickerService.getCurrentColor().toStringRBG());
            this.rgbaFormService.updateRgbForm(this.colourPickerService.getCurrentColor().toStringHex());
        });

        this.rgbaFormSubscription = this.rgbaFormGroup.valueChanges.subscribe(() => {
            this.rgbaFormService.updateColourComponents();
        });
    }
    ngOnDestroy(): void {
        this.colourSubscription.unsubscribe();
        this.rgbaFormSubscription.unsubscribe();
    }
}
