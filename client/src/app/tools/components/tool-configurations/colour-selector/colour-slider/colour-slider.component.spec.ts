import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { ColourSliderComponent } from './colour-slider.component';

describe('ColourSliderComponent', () => {
    let component: ColourSliderComponent;
    let fixture: ComponentFixture<ColourSliderComponent>;
    let getColourStub: jasmine.Spy<jasmine.Func>;
    let emitStub: jasmine.Spy<jasmine.Func>;
    let mouseEvent: MouseEvent;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ColourSliderComponent],
            providers: [ColourToolService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        getColourStub = spyOn(component, 'getColourAtPosition').and.stub();
        getColourStub.and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('onMouseMove must call getColourAtPosition', () => {
        mouseEvent = { offsetX: 0, offsetY: 255, button: 0 } as MouseEvent;
        component.mousedown = true;
        component.onMouseMove(mouseEvent);
        expect(getColourStub).toHaveBeenCalled();
    });
    it('getColourAtPosition defaults to black when input is above 255', () => {
        const VALUE1 = 0;
        const VALUE2 = 256;
        expect(component.getColourAtPosition(VALUE1, VALUE2)).toEqual('rgba(0,0,0,1)');
    });
    it('onMouseDown calls emitColour', () => {
        mouseEvent = { offsetX: 0, offsetY: 10, button: 0 } as MouseEvent;
        emitStub = spyOn(component, 'emitColour').and.stub();
        component.onMouseDown(mouseEvent);
        expect(emitStub).toHaveBeenCalled();
    });
    it('onMouseUp does not let onMouseMove call emitColour', () => {
        mouseEvent = { offsetX: 0, offsetY: 10, button: 0 } as MouseEvent;
        emitStub = spyOn(component, 'emitColour').and.stub();
        component.onMouseUp(mouseEvent);
        component.onMouseMove(mouseEvent);
        expect(emitStub).not.toHaveBeenCalled();
    });
});
