import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourSliderComponent } from '@app/colour-picker/components/colour-slider/colour-slider.component';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { SliderService } from '@app/colour-picker/services/slider/slider.service';
import { Subject } from 'rxjs';

// tslint:disable: no-string-literal
describe('ColourSliderComponent', () => {
    let component: ColourSliderComponent;
    let fixture: ComponentFixture<ColourSliderComponent>;
    let colourPickerServiceSpy: jasmine.SpyObj<ColourPickerService>;
    let sliderServiceSpy: jasmine.SpyObj<SliderService>;
    let hueChangedSubject: Subject<number>;
    let sliderCanvasSpy: jasmine.SpyObj<ElementRef<HTMLCanvasElement>>;
    let nativeElementSpy: jasmine.SpyObj<HTMLCanvasElement>;
    const context = {} as CanvasRenderingContext2D;
    beforeEach(async(() => {
        hueChangedSubject = new Subject<number>();
        colourPickerServiceSpy = jasmine.createSpyObj('ColourPickerService', [], {
            hueObservable: hueChangedSubject,
        });
        sliderServiceSpy = jasmine.createSpyObj('SliderService', ['drawColorContext', 'updateColor'], {
            colourPickerService: colourPickerServiceSpy,
        });
        nativeElementSpy = jasmine.createSpyObj('HTMLCanvasElement', ['getContext'], {
            width: 0,
            height: 0,
        });
        nativeElementSpy.getContext.and.returnValue(context);
        sliderCanvasSpy = jasmine.createSpyObj('ElementRef<HTMLCanvasElement>', [], {
            nativeElement: nativeElementSpy,
        });
        TestBed.configureTestingModule({
            declarations: [ColourSliderComponent],
            providers: [
                { provide: ColourPickerService, useValue: colourPickerServiceSpy },
                { provide: SliderService, useValue: sliderServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(ColourSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['colourPickerService'] = colourPickerServiceSpy;
        component['sliderService'] = sliderServiceSpy;
        component['sliderCanvas'] = sliderCanvasSpy;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit(): should set sliderService.colorCtx from the canvas', () => {
        component.ngAfterViewInit();
        expect(sliderServiceSpy.colorCtx).toBe(context);
    });

    it("ngAfterViewInit(): should subscribe to colourPickerService's hueChanged", () => {
        const hueSubSpy = spyOn(hueChangedSubject, 'subscribe').and.callThrough();
        component.ngAfterViewInit();
        expect(hueSubSpy).toHaveBeenCalled();
    });

    it('ngAfterViewInit(): hueChanged subscription should change colourSliderPosition and call sliderServiceSpy.drawColorContext', () => {
        const hue = 180;
        const expected = 100;
        hueChangedSubject.next(hue);
        expect(sliderServiceSpy.colorSliderPosition).toEqual(expected);
        expect(sliderServiceSpy.drawColorContext).toHaveBeenCalled();
    });

    it("ngOnDestroy(): should unsubscribe from colourPickerService's hueChanged subscription", async(() => {
        const hueChangedSubscriptionSpy = spyOn(component['hueSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(hueChangedSubscriptionSpy).toHaveBeenCalled();
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

    it('onMouseDown(): should set isAdjustingColour to true and call sliderService.updatePalette if isHovering is true', () => {
        component['isHovering'] = true;
        component['isAdjustingColour'] = false;
        component.onMouseDown({} as MouseEvent);
        expect(component['isAdjustingColour']).toEqual(true);
        expect(sliderServiceSpy.updateColor).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onMouseDown(): should not set isAdjustingColour to true and not call sliderService.updatePalette if isHovering is false', () => {
        component['isHovering'] = false;
        component.onMouseDown({} as MouseEvent);
        expect(component['isAdjustingColour']).toEqual(false);
        expect(sliderServiceSpy.updateColor).not.toHaveBeenCalled();
    });

    it('onMouseMove(): should call sliderService.updatePalette if isAdjustingColour is true', () => {
        component['isAdjustingColour'] = true;
        component.onMouseMove({} as MouseEvent);
        expect(sliderServiceSpy.updateColor).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onMouseMove(): should not call sliderService.updatePalette if isAdjustingColour is false', () => {
        component['isAdjustingColour'] = false;
        component.onMouseMove({} as MouseEvent);
        expect(sliderServiceSpy.updateColor).not.toHaveBeenCalled();
    });

    it('onMouseUp(): should set isAdjustingColour to false if it was set to true', () => {
        component['isAdjustingColour'] = true;
        component.onMouseUp();
        expect(component['isAdjustingColour']).toBeFalse();
    });

    it('onMouseUp(): should not set isAdjustingColour to false if it was set to false #for branch coverage', () => {
        component['isAdjustingColour'] = false;
        component.onMouseUp();
        expect(component['isAdjustingColour']).toBeFalse();
    });
});
