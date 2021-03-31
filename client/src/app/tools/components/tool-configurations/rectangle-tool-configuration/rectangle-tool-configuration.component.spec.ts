import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { MaterialModule } from '@app/material.module';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { RectangleToolConfigurationComponent } from './rectangle-tool-configuration.component';


// tslint:disable:no-any
describe('RectangleToolConfigurationComponent', () => {
    let component: RectangleToolConfigurationComponent;
    let fixture: ComponentFixture<RectangleToolConfigurationComponent>;
    let historyServiceStub: HistoryService;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourService;
    let rectangleToolStub: RectangleService;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
        rectangleToolStub = new RectangleService(drawingStub, colourServiceStub, historyServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [RectangleToolConfigurationComponent, ShapeToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: RectangleService, useValue: rectangleToolStub }],
            schemas:      [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
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
});
