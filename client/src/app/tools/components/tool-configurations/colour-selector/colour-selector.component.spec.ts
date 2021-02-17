import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSliderChange } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/material.module';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { ColourPaletteComponent } from './colour-palette/colour-palette.component';
import { ColourSelectorComponent } from './colour-selector.component';
import { ColourSliderComponent } from './colour-slider/colour-slider.component';

const CLR_OPAC = 0.7;

// tslint:disable: no-any
describe('ColourSelectorComponent', () => {
    @Component({
        selector: 'mat-icon',
        template: '<span></span>',
    })
    class MockMatIconComponent {
        @Input() svgIcon: any;
        @Input() fontSet: any;
        @Input() fontIcon: any;
    }

    let component: ColourSelectorComponent;
    let fixture: ComponentFixture<ColourSelectorComponent>;
    let rmbClrStub: jasmine.Spy<jasmine.Func>;
    const CLR_TEST = 'rgba(255,255,255,1)';
    let input: HTMLInputElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ColourSelectorComponent, ColourSliderComponent, ColourPaletteComponent],
            providers: [{ provide: ColourToolService }],
        })
            .overrideModule(MatIconModule, {
                remove: {
                    declarations: [MatIcon],
                    exports: [MatIcon],
                },
                add: {
                    declarations: [MockMatIconComponent],
                    exports: [MockMatIconComponent],
                },
            })
            .compileComponents();
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
        const SLIDER_EVENT = new MatSliderChange();
        SLIDER_EVENT.value = CLR_OPAC;
        component.changeOpacity(SLIDER_EVENT);
        expect(component.opacity).toEqual(SLIDER_EVENT.value);
    });
    it('setOpacityOne sets opacity to 1', () => {
        component.opacity = CLR_OPAC;
        component.setOpacityOne(component.colour);
        expect(component.opacity).toEqual(1);
    });
    it('toHex transforms a Hex value to an rgba value and adds 1 as the opacity', () => {
        const HEX_VALUE = '#FFFFFF';
        component.toHex(HEX_VALUE);
        expect(component.colour).toEqual(CLR_TEST);
    });
    it('switchCol switches between the primary and secondary colours', () => {
        component.service.primaryColour = CLR_TEST;
        component.switchCol();
        expect(component.service.secondaryColour).toEqual(CLR_TEST);
    });
    it('rememberCol does not remember the same colour twice', () => {
        component.service.colourList.push(CLR_TEST);
        component.rememberCol(CLR_TEST);
        expect(component.service.colourList.length).toEqual(1);
    });
    it('rememberCol adds colour to the list without shifting if the size is under 10', () => {
        component.service.colourList = [];
        component.rememberCol(CLR_TEST);
        expect(component.service.colourList[0]).toEqual(CLR_TEST);
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
            CLR_TEST,
        ];
        component.rememberCol('rgba(0,0,2,1)');
        const NEW_INDEX = 8;
        expect(component.service.colourList.indexOf(CLR_TEST)).toEqual(NEW_INDEX);
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
        const PUSH_STUB = spyOn(component.service.colourList, 'push').and.stub();
        PUSH_STUB.and.callThrough();
        component.rememberCol('rgba(2,2,2,1)');
        expect(PUSH_STUB).not.toHaveBeenCalled();
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
        expect(component.service.primaryColour).toEqual(input.style.backgroundColor);
    });
    it('addSecEv adds the target colour as primary colour', () => {
        const INPUT = document.createElement('input');
        const EVENT = jasmine.createSpyObj('MouseEvent', {}, { target: INPUT });
        INPUT.style.backgroundColor = 'green';
        component.addSecEv(EVENT);
        expect(component.service.secondaryColour).toEqual(INPUT.style.backgroundColor);
    });
    it('takeHexClr does not call rememberCol if no valid hex number is put', () => {
        const EVENT = jasmine.createSpyObj(
            'KeyboardEvent',
            {
                stopPropagation(): void {
                    return;
                },
            },
            { target: input },
        );
        input.value = 'PAS UN HEX';
        component.takeHexClr(EVENT);
        expect(rmbClrStub).not.toHaveBeenCalled();
    });
    it('takeHexClr calls stopPropagation', () => {
        const EVENT = jasmine.createSpyObj(
            'KeyboardEvent',
            {
                stopPropagation(): void {
                    return;
                },
            },
            { target: input },
        );
        input.value = 'PAS UN HEX';
        component.takeHexClr(EVENT);
        expect(EVENT.stopPropagation).toHaveBeenCalled();
    });
    it('takeHexClr does call rememberCol if a hex number of 6 digits preceded by # is entered', () => {
        const EVENT = jasmine.createSpyObj(
            'KeyboardEvent',
            {},
            {
                target: input,
                stopPropagation(): void {
                    return;
                },
            },
        );
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
        component.rememberCol(CLR_TEST);
        component.showList();
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.colEl0'))).toBeTruthy();
    });
    it('showList hides the colours of the remembered list on toggle', () => {
        component.show = true;
        component.rememberCol(CLR_TEST);
        component.showList();
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.colEl0'))).toBeNull();
    });
});
