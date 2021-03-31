import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';

import { MagnetismComponent } from './magnetism.component';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-file-line-count
// tslint:disable:no-unused-expression
describe('MagnetismComponent', () => {
    let component: MagnetismComponent;
    let fixture: ComponentFixture<MagnetismComponent>;
    let rectangleSelectionCreator: RectangleSelectionCreatorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatMenuModule, CommonModule, MatTooltipModule],
            declarations: [MagnetismComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MagnetismComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.toolSelector = TestBed.inject(ToolSelectorService);
        rectangleSelectionCreator = TestBed.inject(RectangleSelectionCreatorService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('toggling magnetism twice should not change initial value', () => {
        component.isActivated = false;
        component.toggleMagnetism();
        component.toggleMagnetism();
        expect(component.isActivated).toEqual(false);
    });

    it('toggling magnetism twice should not change initial value', () => {
        const dummyAnchor = 5;
        component.setGridAnchor(dummyAnchor);
        expect(rectangleSelectionCreator.selectionManipulator.gridMovementAnchor).toEqual(dummyAnchor);
    });
});
