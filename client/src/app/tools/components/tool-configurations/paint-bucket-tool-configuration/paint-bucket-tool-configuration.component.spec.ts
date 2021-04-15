import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { PaintBucketToolConfigurationComponent } from '@app/tools/components/tool-configurations/paint-bucket-tool-configuration/paint-bucket-tool-configuration.component';
import { PaintBucketService } from '@app/tools/services/tools/paint-bucket.service';
// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('PaintBucketToolConfigurationComponent', () => {
    @Component({
        selector: 'mat-slider',
        template: '<span></span>',
    })
    class MockMatSliderComponent {
        @Input() value: any;
        @Input() fontSet: any;
        @Input() fontIcon: any;
    }
    let component: PaintBucketToolConfigurationComponent;
    let fixture: ComponentFixture<PaintBucketToolConfigurationComponent>;
    let paintBucketServiceStub: PaintBucketService;
    beforeEach(() => {
        paintBucketServiceStub = new PaintBucketService({} as DrawingService, {} as ColourService, {} as HistoryService);
        TestBed.configureTestingModule({
            imports: [MatSliderModule],
            declarations: [PaintBucketToolConfigurationComponent],
            providers: [{ provide: PaintBucketService, useValue: paintBucketServiceStub }],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideModule(MatSliderModule, {
                remove: {
                    declarations: [MatSlider],
                    exports: [MatSlider],
                },
                add: {
                    declarations: [MockMatSliderComponent],
                    exports: [MockMatSliderComponent],
                },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PaintBucketToolConfigurationComponent);
        component = fixture.componentInstance;
        component['paintBucketService'] = paintBucketServiceStub;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onToleranceChange(): should set tolerance property to specified value', () => {
        const expectedTolerance = 10;
        component.onToleranceChange(expectedTolerance);
        expect(component.tolerance).toEqual(expectedTolerance);
        expect(paintBucketServiceStub.tolerance).toEqual(expectedTolerance);
    });
});
