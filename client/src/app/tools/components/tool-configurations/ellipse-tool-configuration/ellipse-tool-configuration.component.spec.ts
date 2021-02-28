import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EllipseToolConfigurationComponent } from './ellipse-tool-configuration.component';

// tslint:disable:no-any
describe('EllipseToolConfigurationComponent', () => {
    let component: EllipseToolConfigurationComponent;
    let fixture: ComponentFixture<EllipseToolConfigurationComponent>;
    let historyServiceStub: HistoryService;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourToolService;
    let ellipseToolStub: EllipseService;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourToolService();
        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub);

        TestBed.configureTestingModule({
            imports: [MatButtonToggleModule, MatIconModule, MatSliderModule, MatDividerModule, MatTooltipModule],
            declarations: [EllipseToolConfigurationComponent, ShapeToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: EllipseService, useValue: ellipseToolStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
