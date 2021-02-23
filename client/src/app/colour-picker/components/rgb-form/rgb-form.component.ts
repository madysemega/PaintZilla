import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as RegularExpressions from '@app/colour-picker/constants/regular-expressions.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { RgbFormService } from '@app/colour-picker/services/rgb-form/rgb-form.service';
import { combineLatest, Subscription } from 'rxjs';
@Component({
    selector: 'app-rgb-form',
    templateUrl: './rgb-form.component.html',
    styleUrls: ['./rgb-form.component.scss'],
})
export class RgbFormComponent implements OnInit, OnDestroy {
    rgbForm: FormControl;
    private colourSubscription: Subscription;
    private rgbFormSubscription: Subscription;
    constructor(private colourPickerService: ColourPickerService, private rgbFormService: RgbFormService) {}

    ngOnInit(): void {
        this.rgbForm = new FormControl(this.colourPickerService.getCurrentColor().toStringHex(), [
            Validators.required,
            Validators.pattern(RegularExpressions.RGB_FORM_REGEX),
        ]);
        console.log(this.colourPickerService.getCurrentColor().toStringHex());
        this.rgbFormService.rgbFormControl = this.rgbForm;
        this.colourSubscription = combineLatest([
            this.colourPickerService.hueObservable,
            this.colourPickerService.saturationObservable,
            this.colourPickerService.valueObservable,
            this.colourPickerService.alphaObservable,
        ]).subscribe(() => {
            this.rgbFormService.updateRgbForm(this.colourPickerService.getCurrentColor().toStringHex());
        });

        this.rgbFormSubscription = this.rgbFormService.rgbFormControl.valueChanges.subscribe(() => {
            this.rgbFormService.updateColourComponents();
        });
    }

    ngOnDestroy(): void {
        this.colourSubscription.unsubscribe();
        this.rgbFormSubscription.unsubscribe();
    }
}
