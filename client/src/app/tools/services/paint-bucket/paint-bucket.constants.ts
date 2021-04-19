import { Vec2 } from '@app/app/classes/vec2';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { FloodFill } from '@app/tools/services/paint-bucket/flood-fill/flood-fill';
export type Line = [number, number, number, number];
export const PIXEL_LENGTH = 4;
export const MAX_RGBA = 255;
export const RED_INDEX = 0;
export const GREEN_INDEX = 1;
export const BLUE_INDEX = 2;
export const ALPHA_INDEX = 3;
export const TO_PERCENTAGE = 100;
export const MAX_DISTANCE = 196608;
export const HEIGHT = 2;
export const WIDTH = 2;
export const MAX_ALPHA = 1;
export const LENGTH = 16;
export const COLOUR_STUB = new Colour();
export const TOLERANCE = 10;
export const BLACK = new Colour();
export const WHITE = new Colour(MAX_RGBA, MAX_RGBA, MAX_RGBA, MAX_ALPHA);
export const INVALID_INDEX = -1;
export type fillParameters = { imageData: ImageData, onClickCoords: Vec2, fillColour: Colour, tolerance: number };
export type visitCoordinates = { start: number, end: number, nextRow: number, parentRow: number };
export class FloodFillMock extends FloodFill {
    fill(parameters: fillParameters): number[] {
        return [];
    }
}
