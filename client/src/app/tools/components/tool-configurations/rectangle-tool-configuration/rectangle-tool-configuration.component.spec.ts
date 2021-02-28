import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { MaterialModule } from '@app/material.module';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { RectangleToolConfigurationComponent } from './rectangle-tool-configuration.component';

// tslint:disable:no-any
describe('RectangleToolConfigurationComponent', () => {
    let component: RectangleToolConfigurationComponent;
    let fixture: ComponentFixture<RectangleToolConfigurationComponent>;
    let historyServiceStub: HistoryService;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourToolService;
    let rectangleToolStub: RectangleService;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourToolService();
        rectangleToolStub = new RectangleService(drawingStub, colourServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [RectangleToolConfigurationComponent, ShapeToolConfigurationComponent, ResizableToolConfigurationComponent],
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
});
