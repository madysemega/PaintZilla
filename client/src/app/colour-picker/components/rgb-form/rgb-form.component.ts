import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as RegularExpressions from '@app/colour-picker/constants/regular-expressions.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { RgbaFormService } from '@app/colour-picker/services/rgb-form/rgb-form.service';
import { combineLatest, merge, Subscription } from 'rxjs';
@Component({
    selector: 'app-rgb-form',
    templateUrl: './rgb-form.component.html',
    styleUrls: ['./rgb-form.component.scss'],
})
export class RgbFormComponent implements OnInit, OnDestroy {
    rgbaFormGroup: FormGroup = new FormGroup({
        redForm: new FormControl('00', [Validators.required, Validators.pattern(RegularExpressions.RGB_FORM_REGEX)]),
        greenForm: new FormControl('00', [Validators.required, Validators.pattern(RegularExpressions.RGB_FORM_REGEX)]),
        blueForm: new FormControl('00', [Validators.required, Validators.pattern(RegularExpressions.RGB_FORM_REGEX)]),
        alphaForm: new FormControl('100', [Validators.required, Validators.pattern(RegularExpressions.ALPHA_FORM_REGEX)]),
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
            this.rgbaFormService.updateRgbForm(this.colourPickerService.getCurrentColor());
        });
        this.rgbaFormSubscription = merge(
            this.rgbaFormGroup.controls.redForm.valueChanges,
            this.rgbaFormGroup.controls.greenForm.valueChanges,
            this.rgbaFormGroup.controls.blueForm.valueChanges,
            this.rgbaFormGroup.controls.alphaForm.valueChanges,
        ).subscribe(() => {
            this.rgbaFormService.isTyping = true;
            this.rgbaFormService.updateColourComponents();
            this.rgbaFormService.isTyping = false;
        });
    }
    ngOnDestroy(): void {
        this.colourSubscription.unsubscribe();
        this.rgbaFormSubscription.unsubscribe();
    }
}
