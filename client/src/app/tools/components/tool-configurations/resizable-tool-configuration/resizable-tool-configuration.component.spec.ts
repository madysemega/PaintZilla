import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MaterialModule } from '@app/material.module';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { ResizableToolConfigurationComponent } from './resizable-tool-configuration.component';

class ResizableToolStub extends ResizableTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    adjustLineWidth(lineWidth: number): void {
        this.key = 'just-to-test';
        this.lineWidth = lineWidth;
    }
}
// tslint:disable:no-any
describe('ResizableToolConfigurationComponent', () => {
    let component: ResizableToolConfigurationComponent;
    let fixture: ComponentFixture<ResizableToolConfigurationComponent>;
    let resizableToolStub: ResizableTool;
    let historyServiceStub: HistoryService;
    let drawingServiceStub: DrawingService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(async(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);
        
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                MatIconModule,
                MatTooltipModule,
                CommonModule,
                HotkeyModule.forRoot(),
            ],
            declarations: [ResizableToolConfigurationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: MatIconRegistry, useValue: FakeMatIconRegistry },
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        drawingServiceStub = new DrawingService(historyServiceStub);
        resizableToolStub = new ResizableToolStub(drawingServiceStub);
        resizableToolStub.lineWidth = 1;
        fixture = TestBed.createComponent(ResizableToolConfigurationComponent);
        component = fixture.componentInstance;
        component.toolService = resizableToolStub;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changing width should reflect on the toolService line width', () => {
        resizableToolStub.lineWidth = 1;
        component.changeWidth(2);
        expect(resizableToolStub.lineWidth).toEqual(2);
    });
});
