import { DrawingModel } from '@app/commons/class/drawing';
import { Drawing } from '@common/models/drawing';
// tslint:disable-next-line:no-magic-numbers
export const DEFAULT_WIDTH = (window.innerWidth - 220) / 2;
// tslint:disable-next-line:no-magic-numbers
export const DEFAULT_HEIGHT = window.innerHeight - 10;
export const MINIMUM_SIZE = 250;
export const MAX_WIDTH = 2365;
export const MAX_HEIGHT = 1185;
export const INFERIOR_Z_INDEX = '0';
export const SUPERIOR_Z_INDEX = '2';
export const CTX_COLOR = '#ffffff';
export const PREVIEW_CTX_COLOR = 'none';
export const BLANK = 0;
export const RGB_WHITE = 'rgb(255, 255, 255)';
export const drawing: DrawingModel = {
    name: 'Sans titre',
    drawing: 'VGhscyBpcyBzaW1wbGUgQVNDSUkgQmFzZTY0IGZvciBTdGFja092ZXJmbG93IGV4YW1wbGUu',
    labels: ['string1', 'string2'],
};

export const default_drawing: Drawing = {
    id: '604c562e4c06b98048cc0566',
    name: 'Sans titre',
    drawing: 'VGhpcyBpcyBzaW1wbGUgQVNDSUkgQmFzZTY0IGZvciBTdGFja092ZXJmbG93IGV4YW1wbGUu',
    labels: ['string1', 'string5', 'string7'],
};
export const AN_ID = '604c0957f5516581e88f7d59';
