import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EllipseToolConfigurationComponent } from './ellipse-tool-configuration.component';

// tslint:disable:no-any
describe('EllipseToolConfigurationComponent', () => {
    let component: EllipseToolConfigurationComponent;
    let fixture: ComponentFixture<EllipseToolConfigurationComponent>;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourService;
    let ellipseToolStub: EllipseService;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        colourServiceStub = new ColourService({} as ColourPickerService);
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
