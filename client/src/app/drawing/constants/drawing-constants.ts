import { Colour } from '@app/colour-picker/classes/colours.class';

const SIDEBAR_LENGTH = 130;
export const DEFAULT_WIDTH = (window.innerWidth - SIDEBAR_LENGTH) / 2;
export const DEFAULT_HEIGHT = window.innerHeight / 2;
export const MINIMUM_SIZE = 250;
export const MAX_WIDTH = 2365;
export const MAX_HEIGHT = 1185;
export const INFERIOR_Z_INDEX = '0';
export const SUPERIOR_Z_INDEX = '2';
export const CTX_COLOR = 'rgba(255, 255, 255, 1)';
export const PREVIEW_CTX_COLOR = 'rgba(255, 255, 255, 0)';
export const BLANK = 255;
export const HEX_WHITE = '#ffffff';
export const DEFAULT_COLOUR = new Colour();
