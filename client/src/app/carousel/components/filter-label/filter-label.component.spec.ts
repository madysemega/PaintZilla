import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { FilterLabelComponent } from './filter-label.component';
// tslint:disable: no-any
describe('FilterLabelComponent', () => {
    let component: FilterLabelComponent;
    let fixture: ComponentFixture<FilterLabelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule],
            declarations: [FilterLabelComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilterLabelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should initialize filteredLabels', () => {
        expect(component.filteredLabels).not.toBeUndefined();
    });
    it('addFilter should add a label to retainedLabels', () => {
        const CHIP_EVENT: MatChipInputEvent = ({ input: null, value: 'test' } as unknown) as MatChipInputEvent;
        component.addFilter(CHIP_EVENT);
        expect(component.retainedLabels[component.retainedLabels.length - 1]).toBe(CHIP_EVENT.value);
    });
    it('addFilter should not add an empty label to retainedLabels', () => {
        const CHIP_EVENT: MatChipInputEvent = ({ input: null, value: '' } as unknown) as MatChipInputEvent;
        component.addFilter(CHIP_EVENT);
        expect(component.retainedLabels).not.toContain(CHIP_EVENT.value);
    });
    it('removeFilter should remove a filter from retainedLabels', () => {
        const CHIP_EVENT: MatChipInputEvent = ({ input: null, value: 'test' } as unknown) as MatChipInputEvent;
        component.addFilter(CHIP_EVENT);
        component.removeFilter(CHIP_EVENT.value);
        expect(component.retainedLabels).not.toContain(CHIP_EVENT.value);
    });
    it('selected should add a label to retainedLabels', () => {
        const SELECTED_EVENT: MatAutocompleteSelectedEvent = ({
            source: null,
            option: { viewValue: 'test1' },
        } as unknown) as MatAutocompleteSelectedEvent;
        component.selected(SELECTED_EVENT);
        expect(component.retainedLabels).toContain(SELECTED_EVENT.option.viewValue);
    });
    it('selected should not add an empty label to retainedLabels', () => {
        const SELECTED_EVENT: MatAutocompleteSelectedEvent = ({
            source: null,
            option: { viewValue: '' },
        } as unknown) as MatAutocompleteSelectedEvent;
        component.selected(SELECTED_EVENT);
        expect(component.retainedLabels).not.toContain(SELECTED_EVENT.option.viewValue);
    });
    it('_filter should return false if label is not part of availableLabels', () => {
        const CHIP_EVENT: MatChipInputEvent = ({ input: null, value: 'test' } as unknown) as MatChipInputEvent;
        component.addFilter(CHIP_EVENT);
        component.removeFilter(CHIP_EVENT.value);
        // tslint:disable-next-line: no-string-literal
        expect(component['_filter'](CHIP_EVENT.value)).not.toContain(CHIP_EVENT.value);
    });
    it('addFilter should add a label to retainedLabels', () => {
        const VALUE_CHANGE_SPY: jasmine.Spy<any> = spyOn<any>(component, '_filter').and.callThrough();
        const CHIP_EVENT: MatChipInputEvent = ({ input: null, value: 'test' } as unknown) as MatChipInputEvent;
        component.addFilter(CHIP_EVENT);
        // component.labelCtrl.updateValueAndValidity({ onlySelf: false, emitEvent: true });
        component.labelCtrl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
        // component.labelCtrl.setValue(null);
        component.constructorFunct();
        expect(VALUE_CHANGE_SPY).toHaveBeenCalled();
    });
    it('removeFilter should call emit on filterRemoveEvent', () => {
        const EMIT_FILTER_SPY: jasmine.Spy<any> = spyOn<any>(component.filterRemoveEvent, 'emit').and.callThrough();
        component.removeFilter('test');
        expect(EMIT_FILTER_SPY).toHaveBeenCalled();
    });
    it('addFilter should call emit on filterAddEvent', () => {
        const EMIT_FILTER_SPY: jasmine.Spy<any> = spyOn<any>(component.filterAddEvent, 'emit').and.callThrough();
        const CHIP_EVENT: MatChipInputEvent = ({ input: null, value: 'test' } as unknown) as MatChipInputEvent;
        component.addFilter(CHIP_EVENT);
        expect(EMIT_FILTER_SPY).toHaveBeenCalled();
    });
    it('addFilter should not call emit on filterAddEvent if the label is already in retainedLabels', () => {
        const EMIT_FILTER_SPY: jasmine.Spy<any> = spyOn<any>(component.filterAddEvent, 'emit').and.callThrough();
        const CHIP_EVENT: MatChipInputEvent = ({ input: null, value: 'test' } as unknown) as MatChipInputEvent;
        component.retainedLabels.push('test');
        component.addFilter(CHIP_EVENT);
        expect(EMIT_FILTER_SPY).not.toHaveBeenCalled();
    });
    it('addFilter should not call emit on filterAddEvent if the label is already in retainedLabels', () => {
        const CHIP_EVENT: MatChipInputEvent = ({ input: { value: 'ok' }, value: 'test' } as unknown) as MatChipInputEvent;
        component.addFilter(CHIP_EVENT);
        expect(CHIP_EVENT.input.value).toBe('');
    });
    it('addFilter should not call emit on filterAddEvent if the label is already in retainedLabels', () => {
        const EMIT_FILTER_SPY: jasmine.Spy<any> = spyOn<any>(component.filterAddEvent, 'emit').and.callThrough();
        const SELECTED_EVENT: MatAutocompleteSelectedEvent = ({
            source: null,
            option: { viewValue: 'test' },
        } as unknown) as MatAutocompleteSelectedEvent;
        component.retainedLabels.push('test');
        component.selected(SELECTED_EVENT);
        expect(EMIT_FILTER_SPY).not.toHaveBeenCalled();
    });
});
