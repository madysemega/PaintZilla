import { Vec2 } from '@app/app/classes/vec2';
import { ContiguousPixelFill } from '@app/tools/services/paint-bucket/contiguous-fill/contiguous-pixel-fill';
import * as Constants from '@app/tools/services/paint-bucket/paint-bucket.constants';
// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
type Line = [number, number, number, number];
describe('ContiguousPixelFill', () => {
    let floodFill: ContiguousPixelFill;
    let imageStub: ImageData;
    beforeEach(() => {
        floodFill = new ContiguousPixelFill();
        imageStub = new ImageData(Constants.WIDTH, Constants.HEIGHT);
    });

    it('should create', () => {
        expect(floodFill).toBeTruthy();
    });

    it('fill(): should call initializeAttributes and result', () => {
        const initializeStub = spyOn(floodFill, 'initializeAttributes').and.stub();
        floodFill.fill({
            imageData: imageStub,
            onClickCoords: { x: 0, y: 0 } as Vec2,
            fillColour: Constants.COLOUR_STUB,
            tolerance: Constants.TOLERANCE,
        });
        expect(initializeStub).toHaveBeenCalled();
    });

    it('fill(): should call fillQueue if start !== INVALID_INDEX', () => {
        spyOn(floodFill, 'fillAt').and.returnValue([0, Constants.INVALID_INDEX]);
        spyOn(floodFill, 'initializeAttributes').and.callThrough();
        const fillQueueStub = spyOn(floodFill, 'fillQueue').and.stub();
        floodFill.fill({
            imageData: imageStub,
            onClickCoords: { x: 0, y: 0 } as Vec2,
            fillColour: Constants.COLOUR_STUB,
            tolerance: Constants.TOLERANCE,
        });
        expect(fillQueueStub).toHaveBeenCalled();
    });
    it('fill(): should not call fillQueue if start === INVALID_INDEX', () => {
        spyOn(floodFill, 'fillAt').and.returnValue([Constants.INVALID_INDEX, 0]);
        spyOn(floodFill, 'initializeAttributes').and.callThrough();
        const fillQueueStub = spyOn(floodFill, 'fillQueue').and.stub();
        floodFill.fill({
            imageData: imageStub,
            onClickCoords: { x: 0, y: 0 } as Vec2,
            fillColour: Constants.COLOUR_STUB,
            tolerance: Constants.TOLERANCE,
        });
        expect(fillQueueStub).not.toHaveBeenCalled();
    });

    it('fillQueue(): should push [start, end, y + 1, y] in queue when required conditions are met', () => {
        floodFill['start'] = 0;
        floodFill['end'] = 0;
        floodFill['height'] = 2 * Constants.HEIGHT;
        const firstOutput: Line = [0, 0, 2, 1];
        const secondOutput: Line = [0, 0, 1, 0];
        floodFill.fillQueue({ start: 0, end: 0, nextRow: 1, parentRow: 0 });
        floodFill.fillQueue({ start: 1, end: 0, nextRow: 0, parentRow: 0 });
        expect(floodFill['queue']).toEqual([firstOutput, secondOutput]);
    });

    it('fillQueue(): should push [start, end, y - 1, y] in queue when required conditions are met', () => {
        floodFill['start'] = 0;
        floodFill['end'] = 0;
        floodFill['height'] = 0;
        const expected: Line = [0, 0, 0, 1];
        floodFill.fillQueue({ start: 0, end: 0, nextRow: 1, parentRow: 2 });
        floodFill.fillQueue({ start: 1, end: 0, nextRow: 1, parentRow: 0 });
        expect(floodFill['queue']).toEqual([expected, expected]);
    });

    it('fillAt(): should return [INVALID_INDEX, INVALID_INDEX] if isValidPixel returns false', () => {
        const expected = [Constants.INVALID_INDEX, Constants.INVALID_INDEX];
        spyOn(floodFill, 'isValidPixel').and.returnValue(false);
        const actual = floodFill.fillAt(0, 0);
        expect(actual).toEqual(expected);
    });

    it('fillAt(): should return correct [minX, maxX]', () => {
        spyOn(floodFill, 'setPixel').and.callFake(() => {
            return;
        });
        let count = 0;
        spyOn(floodFill, 'isValidPixel').and.callFake(() => {
            if (count < 5) {
                count++;
                return true;
            } else if (count > 5 && count < 10) {
                count++;
                return true;
            }
            count++;
            return false;
        });
        const expected = [2, 10];
        const actual = floodFill.fillAt(6, 0);
        expect(actual).toEqual(expected);
    });
});
