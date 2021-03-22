import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourPaletteComponent } from '@app/colour-picker/components/colour-palette/colour-palette.component';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { SliderService } from '@app/colour-picker/services/slider/slider.service';
import { Subject } from 'rxjs';
import { Vec2 } from '@app/app/classes/vec2';
import * as Constants from '@app/colour-picker/constants/colour-palette.component.constants';

// tslint:disable: no-string-literal
describe('ColourPaletteComponent', () => {
    let component: ColourPaletteComponent;
    let fixtureComponent: ComponentFixture<ColourPaletteComponent>;
    let colourPickerServiceSpy: jasmine.SpyObj<ColourPickerService>;
    let sliderServiceSpy: jasmine.SpyObj<SliderService>;
    let hueChangedSubject: Subject<number>;
    let saturationChangedSubject: Subject<number>;
    let valueChangedSubject: Subject<number>;
    let paletteCanvasSpy: jasmine.SpyObj<ElementRef<HTMLCanvasElement>>;
    let nativeElementSpy: jasmine.SpyObj<HTMLCanvasElement>;
    const context = {} as CanvasRenderingContext2D;
    beforeEach(async(() => {
        hueChangedSubject = new Subject<number>();
        saturationChangedSubject = new Subject<number>();
        valueChangedSubject = new Subject<number>();
        sliderServiceSpy = jasmine.createSpyObj('SliderService', ['drawPaletteContext', 'updatePalette'], {
            colourPickerService: colourPickerServiceSpy,
        });
        colourPickerServiceSpy = jasmine.createSpyObj('ColourPickerService', [], {
            hueObservable: hueChangedSubject,
            saturationObservable: saturationChangedSubject,
            valueObservable: valueChangedSubject,
        });
        nativeElementSpy = jasmine.createSpyObj('HTMLCanvasElement', ['getContext'], {
            width: 0,
            height: 0,
        });
        nativeElementSpy.getContext.and.returnValue(context);
        paletteCanvasSpy = jasmine.createSpyObj('ElementRed<HTMLCanvasElement>', [], {
            nativeElement: nativeElementSpy,
        });
        TestBed.configureTestingModule({
            declarations: [ColourPaletteComponent],
            providers: [
                { provide: ColourPickerService, useValue: colourPickerServiceSpy },
                { provide: SliderService, useValue: sliderServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixtureComponent = TestBed.createComponent(ColourPaletteComponent);
        component = fixtureComponent.componentInstance;
        fixtureComponent.detectChanges();
        component['colourPickerService'] = colourPickerServiceSpy;
        component['sliderService'] = sliderServiceSpy;
        component['paletteCanvas'] = paletteCanvasSpy;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit(): should set the sliderService context from the canvas', () => {
        component.ngAfterViewInit();
        expect(sliderServiceSpy.paletteCtx).toBe(context);
    });

    it("ngAfterViewInit(): should subscribe to colourPickerService's hueChanged, saturationChanged and valueChanged", () => {
        const hueSubscriptionSpy = spyOn(hueChangedSubject, 'subscribe').and.callThrough();
        const saturationSubscriptionSpy = spyOn(saturationChangedSubject, 'subscribe').and.callThrough();
        const valueSubscriptionSpy = spyOn(valueChangedSubject, 'subscribe').and.callThrough();
        component.ngAfterViewInit();
        expect(hueSubscriptionSpy).toHaveBeenCalled();
        expect(saturationSubscriptionSpy).toHaveBeenCalled();
        expect(valueSubscriptionSpy).toHaveBeenCalled();
    });

    it('ngAfterViewInit(): hueChanged subscription should call sliderServiceSpy.drawPaletteContext()', () => {
        const hueValue = 1;
        hueChangedSubject.next(hueValue);
        expect(sliderServiceSpy.drawPaletteContext).toHaveBeenCalled();
    });

    it("ngAfterViewInit(): saturationChanged should set slider's x position and call sliderServiceSpy.drawPaletteContext()", () => {
        const sliderPositionMock = { x: 0, y: 0 } as Vec2;
        sliderServiceSpy.paletteSliderPosition = sliderPositionMock;
        const saturationValue = 0.5;
        const expectedPosition = saturationValue * Constants.SLIDER_WIDTH;
        saturationChangedSubject.next(saturationValue);
        expect(sliderPositionMock.x).toEqual(expectedPosition);
        expect(sliderServiceSpy.drawPaletteContext).toHaveBeenCalled();
    });

    it("ngAfterViewInit(): valueChanged should set slider's y position and call sliderServiceSpy.drawPaletteContext()", () => {
        const sliderPositionMock = { x: 0, y: 0 } as Vec2;
        sliderServiceSpy.paletteSliderPosition = sliderPositionMock;
        const value = 0.5;
        const expectedPosition = value * Constants.SLIDER_HEIGHT;
        valueChangedSubject.next(value);
        expect(sliderPositionMock.y).toEqual(expectedPosition);
        expect(sliderServiceSpy.drawPaletteContext).toHaveBeenCalled();
    });

    it("ngOnDestroy(): should unsubscribe from colourPickerService's subscriptions", async(() => {
        const hueChangedSubscriptionSpy = spyOn(component['hueSubscription'], 'unsubscribe');
        const saturationChangedSubscriptionSpy = spyOn(component['saturationSubscription'], 'unsubscribe');
        const valueChangedSubscriptionSpy = spyOn(component['valueSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(hueChangedSubscriptionSpy).toHaveBeenCalled();
        expect(saturationChangedSubscriptionSpy).toHaveBeenCalled();
        expect(valueChangedSubscriptionSpy).toHaveBeenCalled();
    }));

    it('onMouseEnter(): should set component.isHovering to true', () => {
        component['isHovering'] = false;
        component.onMouseEnter();
        expect(component['isHovering']).toEqual(true);
    });

    it('onMouseLeave(): should set component.isHovering to false', () => {
        component['isHovering'] = true;
        component.onMouseLeave();
        expect(component['isHovering']).toEqual(false);
    });

    it('onMouseDown(): should set isAdjusting to true and call sliderService.updatePalette if isHovering is true', () => {
        component['isHovering'] = true;
        component['isAdjusting'] = false;
        component.onMouseDown({} as MouseEvent);
        expect(component['isAdjusting']).toEqual(true);
        expect(sliderServiceSpy.updatePalette).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onMouseDown(): should not set isAdjusting to true and not call sliderService.updatePalette if isHovering is false', () => {
        component['isHovering'] = false;
        component.onMouseDown({} as MouseEvent);
        expect(component['isAdjusting']).toEqual(false);
        expect(sliderServiceSpy.updatePalette).not.toHaveBeenCalled();
    });

    it('onMouseMove(): should call sliderService.updatePalette if isAdjusting is true', () => {
        component['isAdjusting'] = true;
        component.onMouseMove({} as MouseEvent);
        expect(sliderServiceSpy.updatePalette).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onMouseMove(): should not call sliderService.updatePalette if isAdjusting is false', () => {
        component['isAdjusting'] = false;
        component.onMouseMove({} as MouseEvent);
        expect(sliderServiceSpy.updatePalette).not.toHaveBeenCalled();
    });

    it('onMouseUp(): should set isAdjusting to false if it was set to true', () => {
        component['isAdjusting'] = true;
        component.onMouseUp();
        expect(component['isAdjusting']).toBeFalse();
    });

    it('onMouseUp(): should not set isAdjusting to false if it was set to false #for branch coverage', () => {
        component['isAdjusting'] = false;
        component.onMouseUp();
        expect(component['isAdjusting']).toBeFalse();
    });
});
