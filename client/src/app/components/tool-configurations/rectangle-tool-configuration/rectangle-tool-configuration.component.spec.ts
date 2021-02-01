import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShapeType } from '@app/classes/shape-type';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { RectangleToolConfigurationComponent } from './rectangle-tool-configuration.component';

// tslint:disable:no-any
describe('RectangleToolConfigurationComponent', () => {
    let component: RectangleToolConfigurationComponent;
    let fixture: ComponentFixture<RectangleToolConfigurationComponent>;
    let drawingStub: DrawingService;
    let rectangleToolStub: RectangleService;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        rectangleToolStub = new RectangleService(drawingStub);

        TestBed.configureTestingModule({
            declarations: [RectangleToolConfigurationComponent],
            providers: [{ provide: RectangleService, useValue: rectangleToolStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should select 'contoured' if RectangleService::shapeType is Contoured at initialization", () => {
        rectangleToolStub.shapeType = ShapeType.Contoured;
        component.ngAfterContentInit();
        expect(component.shapeType).toBe('contoured');
    });

    it("should select 'filled' if RectangleService::shapeType is Filled at initialization", () => {
        rectangleToolStub.shapeType = ShapeType.Filled;
        component.ngAfterContentInit();
        expect(component.shapeType).toBe('filled');
    });

    it("should select 'contoured-and-filled' if RectangleService::shapeType is ContouredAndFilled at initialization", () => {
        rectangleToolStub.shapeType = ShapeType.ContouredAndFilled;
        component.ngAfterContentInit();
        expect(component.shapeType).toBe('contoured-and-filled');
    });

    it("onShapeTypeChange should change rectangle tool service shapeType to Contoured if called with 'contoured'", () => {
        const buttonGroup = {
            value: 'contoured',
        } as any;
        component.onShapeTypeChange(buttonGroup);
        expect(rectangleToolStub.shapeType).toBe(ShapeType.Contoured);
    });

    it("onShapeTypeChange should change rectangle tool service shapeType to Filled if called with 'filled'", () => {
        const buttonGroup = {
            value: 'filled',
        } as any;
        component.onShapeTypeChange(buttonGroup);
        expect(rectangleToolStub.shapeType).toBe(ShapeType.Filled);
    });

    it("onShapeTypeChange should change rectangle tool service shapeType to ContouredAndFilled if called with 'contoured-and-filled'", () => {
        const buttonGroup = {
            value: 'contoured-and-filled',
        } as any;
        component.onShapeTypeChange(buttonGroup);
        expect(rectangleToolStub.shapeType).toBe(ShapeType.ContouredAndFilled);
    });
});
