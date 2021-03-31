import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
import { ResizingMode } from '@app/tools/services/selection/selection-base/resizing-mode';

import { EllipseSelectionComponent } from './ellipse-selection.component';

describe('EllipseSelectionComponent', () => {
    let component: EllipseSelectionComponent;
    let fixture: ComponentFixture<EllipseSelectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipseSelectionComponent],
            providers: [{ provide: EllipseSelectionManipulatorService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setResizingMode should set selectionManipulator resizingMode', () => {
        const resizingModeInitialValue = 0;
        component.selectionManipulator.resizingMode = resizingModeInitialValue;
        component.setResizingMode(ResizingMode.towardsBottom);
        expect(component.selectionManipulator.resizingMode).toEqual(ResizingMode.towardsBottom);
    });

    it('isXRev should return selectionManipulator isReversedX', () => {
        const isReversedXInitialValue = true;
        component.selectionManipulator.isReversedX = isReversedXInitialValue;
        const output: boolean = component.isXRev();
        expect(output).toEqual(true);
    });

    it('isYRev should return selectionManipulator isReversedY', () => {
        const isReversedYInitialValue = true;
        component.selectionManipulator.isReversedY = isReversedYInitialValue;
        const output: boolean = component.isYRev();
        expect(output).toEqual(true);
    });
});
