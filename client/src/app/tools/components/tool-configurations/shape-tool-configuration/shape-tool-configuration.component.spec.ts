import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ShapeType } from '@app/app/classes/shape-type';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MaterialModule } from '@app/material.module';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
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
    let drawingStub: DrawingService;
    let colourServiceStub: ColourService;
    let ellipseToolStub: EllipseService;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        colourServiceStub = new ColourService({} as ColourPickerService);
        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ShapeToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: EllipseService, useValue: ellipseToolStub }],
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
