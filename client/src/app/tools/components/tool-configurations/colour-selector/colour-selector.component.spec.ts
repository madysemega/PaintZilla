import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { ColourSelectorComponent } from './colour-selector.component';
const NOTONE = 0.7;

describe('ColourSelectorComponent', () => {
    let component: ColourSelectorComponent;
    let fixture: ComponentFixture<ColourSelectorComponent>;
    let rmbClrStub: jasmine.Spy<jasmine.Func>;
    const CLRTEST = 'rgba(255,255,255,1)';
    let input: HTMLInputElement;
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
        input = document.createElement('input');
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
        const HEXVALUE = '#FFFFFF';
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
    it('rememberCol adds colour to the list without shifting if the size is under 10', () => {
        component.service.colourList = [];
        component.rememberCol(CLRTEST);
        expect(component.service.colourList[0]).toEqual(CLRTEST);
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
        console.log('lol');
        console.log(component.service.colourList.length);
        expect(component.service.colourList.indexOf(CLRTEST)).toEqual(NEWINDEX);
    });
    it('rememberCol does not push to colourList when its length is above 10', () => {
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
            'rgba(0,0,2,1)',
            'rgba(0,2,2,1)',
        ];
        const PUSHSTUB = spyOn(component.service.colourList, 'push').and.stub();
        PUSHSTUB.and.callThrough();
        component.rememberCol('rgba(2,2,2,1)');
        expect(PUSHSTUB).not.toHaveBeenCalled();
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
    it('addColEv adds the target colour as primary colour', () => {
        const EVENT = jasmine.createSpyObj('MouseEvent', {}, { target: input });
        input.style.backgroundColor = 'green';
        component.addColEv(EVENT);
        expect(component.service.colour1).toEqual(input.style.backgroundColor);
    });
    it('addSecEv adds the target colour as primary colour', () => {
        const INPUT = document.createElement('input');
        const EVENT = jasmine.createSpyObj('MouseEvent', {}, { target: INPUT });
        INPUT.style.backgroundColor = 'green';
        component.addSecEv(EVENT);
        expect(component.service.colour2).toEqual(INPUT.style.backgroundColor);
    });
    it('takeHexClr does not call rememberCol if no valid hex number is put', () => {
        const EVENT = jasmine.createSpyObj('KeyboardEvent', {}, { target: input });
        input.value = 'PAS UN HEX';
        component.takeHexClr(EVENT);
        expect(rmbClrStub).not.toHaveBeenCalled();
    });
    it('takeHexClr does call rememberCol if a hex number of 6 digits preceded by # is entered', () => {
        const EVENT = jasmine.createSpyObj('KeyboardEvent', {}, { target: input });
        input.value = '#FFFFFF';
        component.takeHexClr(EVENT);
        expect(rmbClrStub).toHaveBeenCalled();
    });
    it('isHex does not accept ascii symbols between 58 and 64', () => {
        expect(component.isHex('#FF:FFF')).toBeFalse();
    });
    it('isHex does not accept ascii symbols between 91 and 96', () => {
        const SYMBOL = '^';
        expect(component.isHex(`#ff${SYMBOL}fff`)).toBeFalse();
    });
    it('isHex does not accept symbols lower than 48', () => {
        const SYMBOL = '-';
        expect(component.isHex(`#ff${SYMBOL}fff`)).toBeFalse();
    });
    it('isHex accepts small letters as valid hex input', () => {
        expect(component.isHex('#ffffff')).toBeTrue();
    });
    it('showList shows the colours of the remembered list on toggle', () => {
        component.show = false;
        component.rememberCol(CLRTEST);
        component.showList();
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.colEl0'))).toBeTruthy();
    });
    it('showList hides the colours of the remembered list on toggle', () => {
        component.show = true;
        component.rememberCol(CLRTEST);
        component.showList();
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.colEl0'))).toBeNull();
    });
});
