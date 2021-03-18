import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// import { ImageDetailsComponent } from '@app/carousel/components/image-details/image-details.component';

@Component({
    selector: 'app-filter-label',
    templateUrl: './filter-label.component.html',
    styleUrls: ['./filter-label.component.scss'],
})
export class FilterLabelComponent implements OnInit {
    @Input()
    availableLabels: string[] = [];
    retainedLabels: string[] = [];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    labelCtrl: FormControl = new FormControl();
    filteredLabels: Observable<string[]>;
    removable: boolean = true;
    selectable: boolean = true;
    @Output()
    filterEvent: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor() {
        this.filteredLabels = this.labelCtrl.valueChanges.pipe(
            startWith(null),
            map((label: string | null) => (label ? this._filter(label) : this.availableLabels.slice())),
        ) as Observable<string[]>;
    }
    ngOnInit(): void {}
    addFilter(event: MatChipInputEvent): void {
        const LABEL = event.value.trim();
        console.log('called');
        if (LABEL)
            if (this.retainedLabels.indexOf(LABEL) < 0) {
                this.retainedLabels.push(LABEL);
                this.filterEvent.emit(LABEL);
            }
        if (event.input) event.input.value = '';
        this.labelCtrl.setValue(null);
    }
    removeFilter(label: string): void {
        const INDEX: number = this.retainedLabels.indexOf(label);
        this.retainedLabels.splice(INDEX, 1);
        console.log('called remove');
    }
    selected(event: MatAutocompleteSelectedEvent): void {
        this.retainedLabels.push(event.option.viewValue);
        this.labelInput.nativeElement.value = '';
        this.labelCtrl.setValue(null);
    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.availableLabels.filter((label) => label.toLowerCase().indexOf(filterValue) === 0);
    }
}
