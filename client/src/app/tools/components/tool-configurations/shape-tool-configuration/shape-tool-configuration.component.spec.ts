import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShapeType } from '@app/app/classes/shape-type';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MaterialModule } from '@app/material.module';
import { MathsHelper } from '@app/shapes/helper/maths-helper.service';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { ShapeToolConfigurationComponent } from './shape-tool-configuration.component';

// tslint:disable:no-any
describe('ShapeToolConfigurationComponent', () => {
    @Component({
        selector: 'mat-icon',
        template: '<span></span>',
    })
    class MockMatIconComponent {
        @Input() svgIcon: any;
        @Input() fontSet: any;
        @Input() fontIcon: any;
    }

    let component: ShapeToolConfigurationComponent;
    let fixture: ComponentFixture<ShapeToolConfigurationComponent>;
    let historyServiceStub: HistoryService;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let ellipseToolStub: EllipseService;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;
    let mathsHelper: MathsHelper;


    beforeEach(async(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        drawingStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
        mathsHelper = new MathsHelper();
        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub, historyServiceStub, mathsHelper);

        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [MaterialModule, MatIconModule, MatTooltipModule, CommonModule, HotkeyModule.forRoot()],
            declarations: [ShapeToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [
                { provide: EllipseService, useValue: ellipseToolStub },
                { provide: MatIconRegistry, useValue: FakeMatIconRegistry },
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideModule(MatIconModule, {
                remove: {
                    declarations: [MatIcon],
                    exports: [MatIcon],
                },
                add: {
                    declarations: [MockMatIconComponent],
                    exports: [MockMatIconComponent],
                },
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShapeToolConfigurationComponent);
        component = fixture.componentInstance;
        component.toolService = ellipseToolStub;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should select 'contoured' if EllipseService::shapeType is Contoured at initialization", () => {
        ellipseToolStub.shapeType = ShapeType.Contoured;
        component.ngAfterContentInit();
        expect(component.shapeType).toBe('contoured');
    });

    it("should select 'filled' if EllipseService::shapeType is Filled at initialization", () => {
        ellipseToolStub.shapeType = ShapeType.Filled;
        component.ngAfterContentInit();
        expect(component.shapeType).toBe('filled');
    });

    it("should select 'contoured-and-filled' if EllipseService::shapeType is ContouredAndFilled at initialization", () => {
        ellipseToolStub.shapeType = ShapeType.ContouredAndFilled;
        component.ngAfterContentInit();
        expect(component.shapeType).toBe('contoured-and-filled');
    });

    it("onShapeTypeChange should change ellipse tool service shapeType to Contoured if called with 'contoured'", () => {
        const buttonGroup = {
            value: 'contoured',
        } as any;
        component.onShapeTypeChange(buttonGroup);
        expect(ellipseToolStub.shapeType).toBe(ShapeType.Contoured);
    });

    it("onShapeTypeChange should change ellipse tool service shapeType to Filled if called with 'filled'", () => {
        const buttonGroup = {
            value: 'filled',
        } as any;
        component.onShapeTypeChange(buttonGroup);
        expect(ellipseToolStub.shapeType).toBe(ShapeType.Filled);
    });

    it("onShapeTypeChange should change ellipse tool service shapeType to ContouredAndFilled if called with 'contoured-and-filled'", () => {
        const buttonGroup = {
            value: 'contoured-and-filled',
        } as any;
        component.onShapeTypeChange(buttonGroup);
        expect(ellipseToolStub.shapeType).toBe(ShapeType.ContouredAndFilled);
    });
});
