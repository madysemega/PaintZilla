import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { sleep } from '@app/app/classes/sleep';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { AutomaticSavingService } from '@app/file-options/automatic-saving/automatic-saving.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MagnetismService } from '@app/magnetism/magnetism.service';
import { MaterialModule } from '@app/material.module';
import { HotkeyModule } from 'angular2-hotkeys';
import { MainPageComponent } from './main-page.component';

// tslint:disable: prefer-const
describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let historyServiceStub: HistoryService;
    let magnetismServiceStub: MagnetismService;
    let resizingServiceStub: ResizingService;
    let dialogServiceStub: jasmine.SpyObj<MatDialog>;
    let automaticSavingServiceStub: AutomaticSavingService;
    let drawingServiceStub: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;

    beforeEach(async(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        resizingServiceStub = new ResizingService({} as DrawingService, historyServiceStub, magnetismServiceStub);
        dialogServiceStub = jasmine.createSpyObj('MatDialog', ['open']);
        drawingServiceStub = new DrawingService(historyServiceStub);
        automaticSavingServiceStub = new AutomaticSavingService(drawingServiceStub, historyServiceStub);

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientModule,
                MaterialModule,
                BrowserAnimationsModule,
                HotkeyModule.forRoot(),
                CommonModule,
                MatTooltipModule,
            ],
            declarations: [MainPageComponent],
            providers: [
                { provide: ResizingService, useValue: resizingServiceStub },
                { provide: MatDialog, useValue: dialogServiceStub },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: AutomaticSavingService, useValue: automaticSavingServiceStub },
                { provide: KeyboardService },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        resizingServiceStub = TestBed.inject(ResizingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingServiceStub.canvas = canvasTestHelper.canvas;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('resetCanvasDimensions(): should call resizingService.resetCanvasDimensions() and automaticDrawingService.saveDrawingLocally()', async () => {
        const resetStub = spyOn(resizingServiceStub, 'resetCanvasDimensions').and.stub();
        const saveDrawingLocallyStub = spyOn(automaticSavingServiceStub, 'saveDrawingLocally').and.stub();
        component.resetCanvasDimensions();
        await sleep();
        expect(resetStub).toHaveBeenCalled();
        expect(saveDrawingLocallyStub).toHaveBeenCalled();
    });

    it('openCarousel() should open the carousel', () => {
        component.openCarousel();
        expect(dialogServiceStub.open).toHaveBeenCalledWith(ImageNavigationComponent, { panelClass: 'custom-modalbox' });
    });

    it('loadMostRecentDrawing() should call automaticSavingService.loadMostRecentDrawing()', () => {
        const loadMostRecentDrawingSpy = spyOn(automaticSavingServiceStub, 'loadMostRecentDrawing').and.stub();
        component.loadMostRecentDrawing();
        expect(loadMostRecentDrawingSpy).toHaveBeenCalled();
    });
});
