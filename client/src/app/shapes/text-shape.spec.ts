import { TextShape } from './text-shape';

describe('TextShape', () => {
    let shape: TextShape;

    beforeEach(() => {
        shape = new TextShape();
    });

    it('clone should return an identical copy', () => {
        const clonedShape = shape.clone() as TextShape;

        expect(clonedShape.text).toEqual(shape.text);
        expect(clonedShape.position).toEqual(shape.position);
        expect(clonedShape.fontSize).toEqual(shape.fontSize);
    });
});
