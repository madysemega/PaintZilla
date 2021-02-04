import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShapeType } from '@app/classes/shape-type';

import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse-service.service';
import { ShapeToolConfigurationComponent } from './shape-tool-configuration.component';

// tslint:disable:no-any
describe('ShapeToolConfigurationComponent', () => {
    let component: ShapeToolConfigurationComponent;
    let fixture: ComponentFixture<ShapeToolConfigurationComponent>;
    let drawingStub: DrawingService;
    let ellipseToolStub: EllipseService;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        ellipseToolStub = new EllipseService(drawingStub);

        TestBed.configureTestingModule({
            declarations: [ShapeToolConfigurationComponent],
            providers: [{ provide: EllipseService, useValue: ellipseToolStub }],
        }).compileComponents();
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
