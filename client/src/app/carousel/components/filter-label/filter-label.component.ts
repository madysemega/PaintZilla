import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
// source: https://material.angular.io/components/chips/examples
@Component({
    selector: 'app-filter-label',
    templateUrl: './filter-label.component.html',
    styleUrls: ['./filter-label.component.scss'],
})
export class FilterLabelComponent {
    @Input()
    availableLabels: string[] = [];
    retainedLabels: string[] = [];

    separatorKeysCodes: number[] = [ENTER, COMMA];
    labelCtrl: FormControl = new FormControl();

    removable: boolean = true;
    selectable: boolean = true;
    isAvailable: boolean = true;

    @Output()
    filterAddEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    filterRemoveEvent: EventEmitter<number> = new EventEmitter<number>();

    constructor() {}

    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    addFilter(event: MatChipInputEvent): void {
        const LABEL = event.value.trim();
        if (LABEL) {
            if (this.availableLabels.indexOf(LABEL) < 0) {
                this.isAvailable = false;
            } else if (this.retainedLabels.indexOf(LABEL) < 0) {
                this.retainedLabels.push(LABEL);
                this.filterAddEvent.emit(LABEL);
                this.isAvailable = true;
            }
        }
        if (event.input) event.input.value = '';
        this.labelCtrl.setValue(null);
    }
    removeFilter(label: string): void {
        const INDEX: number = this.retainedLabels.indexOf(label);
        this.retainedLabels.splice(INDEX, 1);
        this.filterRemoveEvent.emit(INDEX);
    }
    selected(event: MatAutocompleteSelectedEvent): void {
        const LABEL = event.option.viewValue;
        if (LABEL)
            if (this.retainedLabels.indexOf(LABEL) < 0) {
                this.retainedLabels.push(event.option.viewValue);
                this.filterAddEvent.emit(event.option.viewValue);
                this.isAvailable = true;
                this.labelInput.nativeElement.value = '';
                this.labelCtrl.setValue(null);
            }
    }
}
