import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
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

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(async(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [MatMenuModule, CommonModule, MatTooltipModule, HotkeyModule.forRoot()],
            declarations: [MagnetismComponent],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    it('notifying the manipulators should change the isMagnetismActivated property in the selection Manipulator ', () => {
        component.isActivated = true;
        component.notifyManipulators();
        expect(rectangleSelectionCreator.selectionManipulator.isMagnetismActivated).toEqual(true);
    });


    it('setting grid anchor should change the grid movement anchor in the selection Manipulator', () => {
        const dummyAnchor = 5;
        component.setGridAnchor(dummyAnchor);
        expect(rectangleSelectionCreator.selectionManipulator.gridMovementAnchor).toEqual(dummyAnchor);
    });
});
