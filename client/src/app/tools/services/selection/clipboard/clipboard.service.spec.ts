import { TestBed } from '@angular/core/testing';
import { HandlerMemento } from '@app/app/classes/handler-memento';
import { ManipulatorMemento } from '@app/app/classes/manipulator-memento';
import { Vec2 } from '@app/app/classes/vec2';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { EllipseSelectionHandlerService } from '@app/tools/services/selection/ellipse/ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
// import { ColourToolService } from '@server/tools/services/tools/colour-tool.service';
import { EllipseSelectionCreatorService } from '@app/tools/services/tools/ellipse-selection-creator.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { ClipboardService } from './clipboard.service';


// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-file-line-count
// tslint:disable:no-unused-expression
describe('ClipboardService', () => {
    let service: ClipboardService;
    let ellipseSelectionHandlerService: EllipseSelectionHandlerService;
    let ellipseSelectionManipulatorService: EllipseSelectionManipulatorService;
    let ellipseSelectionHelperService: EllipseSelectionHelperService;
    let ellipseSelectionCreatorService: EllipseSelectionCreatorService;
    let drawingStub: DrawingService;
    let historyServiceStub: HistoryService;
    let colourServiceStub: ColourService;
    let ellipseToolStub: EllipseService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    let registerWhiteFillSpy: jasmine.Spy<any>;
    let drawSelectionSpy: jasmine.Spy<any>;

    beforeEach(() => {
        colourServiceStub = new ColourService({} as ColourPickerService);
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);
        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ],
        });
        service = TestBed.inject(ClipboardService);

        drawingStub = new DrawingService(historyServiceStub);
        drawingStub.canvasSize = { x: 500, y: 600 };

        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub, historyServiceStub);

        ellipseSelectionHelperService = new EllipseSelectionHelperService(drawingStub, colourServiceStub, ellipseToolStub);
        ellipseSelectionHandlerService = new EllipseSelectionHandlerService(drawingStub, ellipseSelectionHelperService);
        ellipseSelectionManipulatorService = new EllipseSelectionManipulatorService(
            drawingStub,
            ellipseSelectionHelperService,
            ellipseSelectionHandlerService,
            historyServiceStub,
        );
        ellipseSelectionCreatorService = new EllipseSelectionCreatorService(
            drawingStub,
            ellipseSelectionManipulatorService,
            ellipseSelectionHelperService,
            service,
        );
        registerWhiteFillSpy = spyOn<any>(service, 'registerWhiteFillInHistory').and.callThrough();
        drawSelectionSpy = spyOn<any>(ellipseSelectionHandlerService, 'drawSelection').and.callThrough().and.returnValue(true);
        spyOn<any>(ellipseSelectionHandlerService, 'restoreFromMemento').and.callThrough().and.returnValue(true);
        spyOn<any>(ellipseSelectionManipulatorService, 'restoreFromMemento').and.callThrough().and.returnValue(true);
        spyOn<any>(ellipseSelectionManipulatorService, 'drawSelectionOutline').and.callThrough().and.returnValue(true);

        spyOn<any>(ellipseSelectionHandlerService, 'whiteFillAtOriginalLocation').and.returnValue(undefined);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('cut should register an action in history if white fill is applied', () => {
        const width = 500;
        const height = 700;
        const manipulatorMemento: ManipulatorMemento = new ManipulatorMemento();
        const handlerMemento: HandlerMemento = new HandlerMemento(width, height);
        service.applyWhiteFill = true;
        service.cut(manipulatorMemento, handlerMemento, ellipseSelectionCreatorService);
        expect(registerWhiteFillSpy).toHaveBeenCalled();
    });

    it('cut should not register an action in history if white fill is not applied', () => {
        const width = 500;
        const height = 700;

        const manipulatorMemento: ManipulatorMemento = new ManipulatorMemento();
        const handlerMemento: HandlerMemento = new HandlerMemento(width, height);

        service.applyWhiteFill = false;
        service.cut(manipulatorMemento, handlerMemento, ellipseSelectionCreatorService);

        expect(registerWhiteFillSpy).not.toHaveBeenCalled();
    });

    it('selection should not be drawn if clipboard is empty', () => {
        service.isEmpty = true;

        service.paste();
        expect(drawSelectionSpy).not.toHaveBeenCalled();
    });

    it('applyWhiteFill should be set to false every time a paste action is performed', () => {
        service.isEmpty = false;
        service.applyWhiteFill = true;
        service.manipulatorToRestore = ellipseSelectionManipulatorService;
        service.handlerToRestore = ellipseSelectionHandlerService;
        service.copyOwner = ellipseSelectionCreatorService;

        service.paste();

        expect(service.applyWhiteFill).toEqual(false);
    });

    it('the manipulator to restore should have its topLeft and bottomRight coordinates correctly set so the selection is at the origin even if isReversedX is true', () => {
        const topLeft: Vec2 = { x: 8, y: 4 };
        const bottomRight: Vec2 = { x: 2, y: 12 };
        const width: number = topLeft.x - bottomRight.x;
        const height: number = bottomRight.y - topLeft.y;

        const expectedTopLeft: Vec2 = { x: width, y: 0 };
        const expectedBottomRight: Vec2 = { x: 0, y: height };

        service.manipulatorToRestore = ellipseSelectionManipulatorService;

        ellipseSelectionManipulatorService.topLeft = topLeft;
        ellipseSelectionManipulatorService.bottomRight = bottomRight;
        ellipseSelectionManipulatorService.isReversedX = true;
        ellipseSelectionManipulatorService.isReversedY = false;

        service.positionAtOrigin();

        expect(ellipseSelectionManipulatorService.topLeft).toEqual(expectedTopLeft);
        expect(ellipseSelectionManipulatorService.bottomRight).toEqual(expectedBottomRight);
    });

    it('the manipulator to restore should have its topLeft and bottomRight coordinates correctly set so the selection is at the origin even if isReversedX is false', () => {
        const bottomRight: Vec2 = { x: 8, y: 12 };
        const topLeft: Vec2 = { x: 2, y: 4 };
        const width: number = bottomRight.x - topLeft.x;
        const height: number = bottomRight.y - topLeft.y;

        const expectedTopLeft: Vec2 = { x: 0, y: 0 };
        const expectedBottomRight: Vec2 = { x: width, y: height };
        service.manipulatorToRestore = ellipseSelectionManipulatorService;
        ellipseSelectionManipulatorService.topLeft = topLeft;
        ellipseSelectionManipulatorService.bottomRight = bottomRight;
        ellipseSelectionManipulatorService.isReversedX = false;
        ellipseSelectionManipulatorService.isReversedY = false;

        service.positionAtOrigin();

        expect(ellipseSelectionManipulatorService.topLeft).toEqual(expectedTopLeft);
        expect(ellipseSelectionManipulatorService.bottomRight).toEqual(expectedBottomRight);
    });

    it('the manipulator to restore should have its topLeft and bottomRight coordinates correctly set so the selection is at the origin even if isReversedY is true', () => {
        const bottomRight: Vec2 = { x: 8, y: 4 };
        const topLeft: Vec2 = { x: 2, y: 12 };
        const width: number = bottomRight.x - topLeft.x;
        const height: number = topLeft.y - bottomRight.y;

        const expectedTopLeft: Vec2 = { x: 0, y: height };
        const expectedBottomRight: Vec2 = { x: width, y: 0 };
        service.manipulatorToRestore = ellipseSelectionManipulatorService;
        ellipseSelectionManipulatorService.topLeft = topLeft;
        ellipseSelectionManipulatorService.bottomRight = bottomRight;
        ellipseSelectionManipulatorService.isReversedX = false;
        ellipseSelectionManipulatorService.isReversedY = true;

        service.positionAtOrigin();

        expect(ellipseSelectionManipulatorService.topLeft).toEqual(expectedTopLeft);
        expect(ellipseSelectionManipulatorService.bottomRight).toEqual(expectedBottomRight);
    });

    it('the manipulator to restore should have its topLeft and bottomRight coordinates correctly set so the selection is at the origin even if isReversedY is false', () => {
        const bottomRight: Vec2 = { x: 8, y: 12 };
        const topLeft: Vec2 = { x: 2, y: 4 };
        const width: number = bottomRight.x - topLeft.x;
        const height: number = bottomRight.y - topLeft.y;

        const expectedTopLeft: Vec2 = { x: 0, y: 0 };
        const expectedBottomRight: Vec2 = { x: width, y: height };
        service.manipulatorToRestore = ellipseSelectionManipulatorService;
        ellipseSelectionManipulatorService.topLeft = topLeft;
        ellipseSelectionManipulatorService.bottomRight = bottomRight;
        ellipseSelectionManipulatorService.isReversedX = false;
        ellipseSelectionManipulatorService.isReversedY = false;

        service.positionAtOrigin();

        expect(ellipseSelectionManipulatorService.topLeft).toEqual(expectedTopLeft);
        expect(ellipseSelectionManipulatorService.bottomRight).toEqual(expectedBottomRight);
    });
});
