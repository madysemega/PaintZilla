import { TestBed } from '@angular/core/testing';
import * as Constants from '@app/colour-picker/constants/colour-testing.constants';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
// tslint:disable: no-string-literal
describe('ColourService', () => {
    let service: ColourService;
    let colourPickerServiceSpy: jasmine.SpyObj<ColourPickerService>;
    beforeEach(() => {
        colourPickerServiceSpy = jasmine.createSpyObj('ColourPickerService', ['getCurrentColor', 'setCurrentColour']);
        colourPickerServiceSpy.getCurrentColor.and.returnValue(Constants.WHITE);
        TestBed.configureTestingModule({
            providers: [{ provide: ColourService }, { provide: ColourPickerService, useValue: colourPickerServiceSpy }],
        });
        service = TestBed.inject(ColourService);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('updatePrimaryColour(): should call updatePreviousColour and emit primaryColourChanged', () => {
        const primaryChangedSpy = spyOn(service['primaryColourChanged'], 'emit').and.callThrough();
        spyOn(service, 'updatePreviousColours').and.callThrough();
        service.updatePrimaryColour();
        expect(service.updatePreviousColours).toHaveBeenCalled();
        expect(primaryChangedSpy).toHaveBeenCalled();
    });

    it('updateSecondaryColour(): should call updatePreviousColour and emit secondaryColourChanged', () => {
        const secondaryChangedSpy = spyOn(service['secondaryColourChanged'], 'emit').and.callThrough();
        spyOn(service, 'updatePreviousColours').and.callThrough();
        service.updateSecondaryColour();
        expect(service.updatePreviousColours).toHaveBeenCalled();
        expect(secondaryChangedSpy).toHaveBeenCalled();
    });

    it('getPrimaryColour(): should return primaryColour', () => {
        service['primaryColour'] = Constants.WHITE;
        expect(service.getPrimaryColour()).toEqual(Constants.WHITE);
    });

    it('getSecondaryColour(): should return secondaryColour', () => {
        service['secondaryColour'] = Constants.WHITE;
        expect(service.getSecondaryColour()).toEqual(Constants.WHITE);
    });

    it('setPrimaryColour(): should set primaryColour to specified colour and emit primaryColourChanged', () => {
        const primaryChangedSpy = spyOn(service['primaryColourChanged'], 'emit').and.callThrough();
        service.setPrimaryColour(Constants.WHITE);
        expect(service['primaryColour']).toEqual(Constants.WHITE);
        expect(primaryChangedSpy).toHaveBeenCalled();
    });

    it('setSecondaryColour(): should set secondaryColour to specified colour and emit secondaryColourChanged', () => {
        const secondaryChangedSpy = spyOn(service['secondaryColourChanged'], 'emit').and.callThrough();
        service.setSecondaryColour(Constants.WHITE);
        expect(service['secondaryColour']).toEqual(Constants.WHITE);
        expect(secondaryChangedSpy).toHaveBeenCalled();
    });

    it('getPreviousColours(): should return an array of previous colours', () => {
        const expected = [Constants.WHITE, Constants.WHITE];
        service['previousColours'] = expected;
        expect(service.getPreviousColours()).toEqual(expected);
    });

    it('updateColour(): should emit primary, secondary and showColourPickerChange', () => {
        const primaryChangedSpy = spyOn(service['primaryColourChanged'], 'emit').and.callThrough();
        const secondaryChangedSpy = spyOn(service['secondaryColourChanged'], 'emit').and.callThrough();
        const showColourChangeSpy = spyOn(service['showColourPickerChange'], 'emit').and.callThrough();
        service.updateColour();
        expect(primaryChangedSpy).toHaveBeenCalled();
        expect(secondaryChangedSpy).toHaveBeenCalled();
        expect(showColourChangeSpy).toHaveBeenCalled();
    });

    it('updateColour(): should call updatePrimaryColour if primaryColourSelected is true', () => {
        service['primaryColourSelected'] = true;
        const updatePrimaryColourSpy = spyOn(service, 'updatePrimaryColour').and.callThrough();
        const udpateSecondaryColourSpy = spyOn(service, 'updateSecondaryColour').and.callThrough();
        service.updateColour();
        expect(updatePrimaryColourSpy).toHaveBeenCalled();
        expect(udpateSecondaryColourSpy).not.toHaveBeenCalled();
    });

    it('updateColour(): should call updateSecondaryColour if primaryColourSelected is false', () => {
        service['primaryColourSelected'] = false;
        const updatePrimaryColourSpy = spyOn(service, 'updatePrimaryColour').and.callThrough();
        const udpateSecondaryColourSpy = spyOn(service, 'updateSecondaryColour').and.callThrough();
        service.updateColour();
        expect(updatePrimaryColourSpy).not.toHaveBeenCalled();
        expect(udpateSecondaryColourSpy).toHaveBeenCalled();
    });

    it('selectPrimaryColour(): showColourPickerChange should emit', () => {
        const showColourPickerSpy = spyOn(service.showColourPickerChange, 'emit').and.callThrough();
        service.selectPrimaryColour();
        expect(showColourPickerSpy).toHaveBeenCalled();
    });

    it('selectSecondaryColour(): showColourPickerChange should emit', () => {
        const showColourPickerSpy = spyOn(service.showColourPickerChange, 'emit').and.callThrough();
        service.selectSecondaryColour();
        expect(showColourPickerSpy).toHaveBeenCalled();
    });

    it('swapComponentColours(): should call swapColours', () => {
        const swapColourSpy = spyOn(service, 'swapColours').and.callThrough();
        service.swapComponentColours();
        expect(swapColourSpy).toHaveBeenCalled();
    });

    it('swapComponentColours(): should call colourPickerService.setCurrentColour with primaryColour if primaryColourSelected', () => {
        service['primaryColourSelected'] = true;
        service.swapComponentColours();
        expect(colourPickerServiceSpy.setCurrentColour).toHaveBeenCalledWith(service['primaryColour']);
    });

    it('swapComponentColours(): should call colourPickerService.setCurrentColour with secondaryColour if not primaryColourSelected', () => {
        service['primaryColourSelected'] = false;
        service.swapComponentColours();
        expect(colourPickerServiceSpy.setCurrentColour).toHaveBeenCalledWith(service['secondaryColour']);
    });

    it('updatePreviousColours(): should ecrase previousColours[index] if index is found', () => {
        const previousColors = [Constants.WHITE];
        service['previousColours'] = previousColors;
        service.updatePreviousColours(Constants.WHITE);
        expect(service['previousColours'][0]).toEqual(Constants.WHITE);
    });

    it('updatePreviousColours(): should replace first colour of array with provided colour if no match was found', () => {
        service.updatePreviousColours(Constants.WHITE);
        expect(service['previousColours'][0]).toEqual(Constants.WHITE);
    });

    it('swapColours(): primaryColourChanged and secondaryColourChanged should emit', () => {
        const primaryChangedSpy = spyOn(service['primaryColourChanged'], 'emit').and.callThrough();
        const secondaryChangedSpy = spyOn(service['secondaryColourChanged'], 'emit').and.callThrough();
        service.swapColours();
        expect(primaryChangedSpy).toHaveBeenCalled();
        expect(secondaryChangedSpy).toHaveBeenCalled();
    });
});
