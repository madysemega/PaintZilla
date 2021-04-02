import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { MaterialModule } from '@app/material.module';
import { EraserToolConfigurationComponent } from '@app/tools/components/tool-configurations/eraser-tool-configuration/eraser-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { EraserService } from '@app/tools/services/tools/eraser-service';

describe('EraserToolConfigurationComponent', () => {
    let component: EraserToolConfigurationComponent;
    let fixture: ComponentFixture<EraserToolConfigurationComponent>;

    let historyServiceStub: HistoryService;
    let drawingServiceStub: DrawingService;
    let eraserServiceStub: EraserService;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingServiceStub = new DrawingService(historyServiceStub);
        eraserServiceStub = new EraserService(drawingServiceStub, historyServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule, CommonModule, MatTooltipModule],
            declarations: [EraserToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [
                { provide: EraserService, useValue: eraserServiceStub },
                { provide: HistoryService, useValue: historyServiceStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraserToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
