import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OpacitySliderComponent } from '@app/colour-picker/components/opacity-slider/opacity-slider.component';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { SliderService } from '@app/colour-picker/services/slider/slider.service';
import { Subject } from 'rxjs';
// tslint:disable: no-string-literal
describe('OpacitySliderComponent', () => {
    let component: OpacitySliderComponent;
    let fixture: ComponentFixture<OpacitySliderComponent>;
    let colourPickerServiceSpy: jasmine.SpyObj<ColourPickerService>;
    let sliderServiceSpy: jasmine.SpyObj<SliderService>;
    let opacityCanvasSpy: jasmine.SpyObj<ElementRef<HTMLCanvasElement>>;
    let nativeElementSpy: jasmine.SpyObj<HTMLCanvasElement>;
    const context = {} as CanvasRenderingContext2D;
    let hueSubject: Subject<number>;
    let saturationSubject: Subject<number>;
    let valueSubject: Subject<number>;
    let alphaSubject: Subject<number>;
    beforeEach(async(() => {
        hueSubject = new Subject<number>();
        saturationSubject = new Subject<number>();
        valueSubject = new Subject<number>();
        alphaSubject = new Subject<number>();
        colourPickerServiceSpy = jasmine.createSpyObj('ColourPickerService', ['getAlpha'], {
            hueObservable: hueSubject,
            saturationObservable: saturationSubject,
            valueObservable: valueSubject,
            alphaObservable: alphaSubject,
        });
        sliderServiceSpy = jasmine.createSpyObj('SliderService', ['drawOpacityContext', 'updateOpacity'], {
            colourPickerService: colourPickerServiceSpy,
        });
        nativeElementSpy = jasmine.createSpyObj('HTMLCanvasElement', ['getContext'], {
            width: 0,
            height: 0,
        });
        nativeElementSpy.getContext.and.returnValue(context);
        opacityCanvasSpy = jasmine.createSpyObj('ElementRef<HTMLCanvasElement>', [], {
            nativeElement: nativeElementSpy,
        });
        TestBed.configureTestingModule({
            declarations: [OpacitySliderComponent],
            providers: [
                { provide: ColourPickerService, useValue: colourPickerServiceSpy },
                { provide: SliderService, useValue: sliderServiceSpy },
            ],
        }).compileComponents();
    }));
    beforeEach(async(() => {
        fixture = TestBed.createComponent(OpacitySliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['colourPickerService'] = colourPickerServiceSpy;
        component['sliderService'] = sliderServiceSpy;
        component['opacityCanvas'] = opacityCanvasSpy;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit(): should set sliderService.opacityCtx from nativeElementSpy', () => {
        component.ngAfterViewInit();
        expect(sliderServiceSpy.opacityCtx).toBe(context);
    });

    it("ngAfterViewInit(): should subscribe to colourPickerService's hueChanged, saturationChanged and valueChanged", () => {
        const hueSubscriptionSpy = spyOn(hueSubject, 'subscribe').and.callThrough();
        const saturationSubscriptionSpy = spyOn(saturationSubject, 'subscribe').and.callThrough();
        const valueSubscriptionSpy = spyOn(valueSubject, 'subscribe').and.callThrough();
        const alphaSubscriptionSpy = spyOn(alphaSubject, 'subscribe').and.callThrough();
        component.ngAfterViewInit();
        expect(hueSubscriptionSpy).toHaveBeenCalled();
        expect(saturationSubscriptionSpy).toHaveBeenCalled();
        expect(valueSubscriptionSpy).toHaveBeenCalled();
        expect(alphaSubscriptionSpy).toHaveBeenCalled();
    });

    it('ngAfterViewInit(): hue, saturation, value or alpha subscriptions should change opacitySliderPosition and call sliderServiceSpy.drawOpacityContext() once', () => {
        sliderServiceSpy.opacitySliderPosition = 0;
        hueSubject.next();
        saturationSubject.next();
        valueSubject.next();
        alphaSubject.next();
        expect(sliderServiceSpy.opacitySliderPosition).not.toEqual(0);
        expect(sliderServiceSpy.drawOpacityContext).toHaveBeenCalledTimes(1);
    });

    it('ngOnDestroy(): should unsubscribe from all subscriptions', () => {
        const hsvaSpy = spyOn(component['hslAlphaSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(hsvaSpy).toHaveBeenCalled();
    });

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

    it('onMouseDown(): should set isAdjustingOpacity to true and call sliderService.updateOpacity if isHovering is true', () => {
        component['isHovering'] = true;
        component['isAdjustingOpacity'] = false;
        component.onMouseDown({} as MouseEvent);
        expect(component['isAdjustingOpacity']).toEqual(true);
        expect(sliderServiceSpy.updateOpacity).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onMouseDown(): should not set isAdjustingOpacity to true and not call sliderService.updateOpacity if isHovering is false', () => {
        component['isHovering'] = false;
        component.onMouseDown({} as MouseEvent);
        expect(component['isAdjustingOpacity']).toEqual(false);
        expect(sliderServiceSpy.updateOpacity).not.toHaveBeenCalled();
    });

    it('onMouseMove(): should call sliderService.updateOpacity if isAdjusting is true', () => {
        component['isAdjustingOpacity'] = true;
        component.onMouseMove({} as MouseEvent);
        expect(sliderServiceSpy.updateOpacity).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onMouseMove(): should not call sliderService.updateOpacity if isAdjusting is false', () => {
        component['isAdjustingOpacity'] = false;
        component.onMouseMove({} as MouseEvent);
        expect(sliderServiceSpy.updateOpacity).not.toHaveBeenCalled();
    });

    it('onMouseUp(): should set isAdjusting to false if it was set to true', () => {
        component['isAdjustingOpacity'] = true;
        component.onMouseUp();
        expect(component['isAdjustingOpacity']).toBeFalse();
    });

    it('onMouseUp(): should not set isAdjusting to false if it was set to false #for branch coverage', () => {
        component['isAdjustingOpacity'] = false;
        component.onMouseUp();
        expect(component['isAdjustingOpacity']).toBeFalse();
    });
});
