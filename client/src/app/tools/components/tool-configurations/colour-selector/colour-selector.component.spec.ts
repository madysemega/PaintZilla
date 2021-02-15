import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { ColourSelectorComponent } from './colour-selector.component';
const NOTONE = 0.7;

describe('ColourSelectorComponent', () => {
    let component: ColourSelectorComponent;
    let fixture: ComponentFixture<ColourSelectorComponent>;
    let rmbClrStub: jasmine.Spy<jasmine.Func>;
    const CLRTEST = 'rgba(255,255,255,1)';
    // const mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColourSelectorComponent],
            providers: [{ provide: ColourToolService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColourSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.colour = 'rgba(0, 0, 0, 1)';
        rmbClrStub = spyOn(component, 'rememberCol').and.stub();
        rmbClrStub.and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changeOpacity is affected by a MatSliderChange event', () => {
        const SLIDEREVENT = new MatSliderChange();
        SLIDEREVENT.value = NOTONE;
        component.changeOpacity(SLIDEREVENT);
        expect(component.opacity).toEqual(SLIDEREVENT.value);
    });
    it('setOpacityOne sets opacity to 1', () => {
        component.opacity = NOTONE;
        component.setOpacityOne(component.colour);
        expect(component.opacity).toEqual(1);
    });
    it('toHex transforms a Hex value to an rgba value and adds 1 as the opacity', () => {
        const HEXVALUE = 'FFFFFF';
        component.toHex(HEXVALUE);
        expect(component.colour).toEqual(CLRTEST);
    });
    it('switchCol switches between the primary and secondary colours', () => {
        component.service.colour1 = CLRTEST;
        component.switchCol();
        expect(component.service.colour2).toEqual(CLRTEST);
    });
    it('rememberCol does not remember the same colour twice', () => {
        component.service.colourList.push(CLRTEST);
        component.rememberCol(CLRTEST);
        expect(component.service.colourList.length).toEqual(1);
    });
    it('rememberCol shifts elements when listColour is pushed when its length is 10', () => {
        component.service.colourList = [
            'rgba(0,0,0,1)',
            'rgba(1,0,0,1)',
            'rgba(0,1,0,1)',
            'rgba(0,0,1,1)',
            'rgba(0,1,1,1)',
            'rgba(1,1,0,1)',
            'rgba(1,0,1,1)',
            'rgba(2,0,0,1)',
            'rgba(0,2,0,1)',
            CLRTEST,
        ];
        component.rememberCol('rgba(0,0,2,1)');
        const NEWINDEX = 8;
        expect(component.service.colourList.indexOf(CLRTEST)).toEqual(NEWINDEX);
    });
    it('addFirstCol does not call rememberCol if the argument is false', () => {
        component.addFirstCol(false);
        expect(rmbClrStub).not.toHaveBeenCalled();
    });
    it('addFirstCol does call rememberCol if the argument is true', () => {
        component.addFirstCol(true);
        expect(rmbClrStub).toHaveBeenCalled();
    });
    it('addSecCol does not call rememberCol if the argument is false', () => {
        component.addSecCol(false);
        expect(rmbClrStub).not.toHaveBeenCalled();
    });
    it('addSecCol does call rememberCol if the argument is true', () => {
        component.addSecCol(true);
        expect(rmbClrStub).toHaveBeenCalled();
    });
    it('takeHexClr throws an error if no target', () => {
        expect(component.takeHexClr(new KeyboardEvent('lol'))).toThrowError();
    });
});
