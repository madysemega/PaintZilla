import { TextShape } from './text-shape';

describe('TextShape', () => {
    let shape: TextShape;

    beforeEach(() => {
        shape = new TextShape();
    });

    it('If there is no \\n character in the text, split should return one string', () => {
        shape.text = '123';

        const split = shape.splitTextInMultipleLines();
        expect(split.length).toEqual(1);
        expect(split[0]).toEqual('123');
    });

    it('If there is one \\n character in the text, split should return two strings', () => {
        shape.text = '123\n321';

        const split = shape.splitTextInMultipleLines();
        expect(split.length).toEqual(2);
        expect(split[0]).toEqual('123');
        expect(split[1]).toEqual('321');
    });

    it('If there is one \\n character in the text, split should return two strings', () => {
        shape.text = '123\n321\nabc';

        const split = shape.splitTextInMultipleLines();
        expect(split.length).toEqual(3);
        expect(split[0]).toEqual('123');
        expect(split[1]).toEqual('321');
        expect(split[2]).toEqual('abc');
    });

    it('If text ends in \\n, split should add an empty string as last line', () => {
        shape.text = '123\n';

        const split = shape.splitTextInMultipleLines();
        expect(split.length).toEqual(2);
        expect(split[0]).toEqual('123');
        expect(split[1]).toEqual('');
    });

    it('clone should return an identical copy', () => {
        const clonedShape = shape.clone() as TextShape;

        expect(clonedShape.text).toEqual(shape.text);
        expect(clonedShape.position).toEqual(shape.position);
        expect(clonedShape.fontSize).toEqual(shape.fontSize);
    });
});
