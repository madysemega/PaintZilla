import { Vec2 } from '@app/app/classes/vec2';

export const ALLOWED_CHAR_CLASSES: string[] = [
    'Key',
    'Digit',
    'Numpad',
    'Comma',
    'Period',
    'Quote',
    'Backquote',
    'Slash',
    'Backslash',
    'Bracket',
    'Space',
    'Minus',
    'Equal',
];

export const DEFAULT_CURSOR_POSITION = 0;
export const CURSOR_BLINK_DELAI_MS = 500;

export const DEFAULT_TEXT = '';
export const DEFAULT_IS_BOLD = false;
export const DEFAULT_IS_ITALIC = false;
export const DEFAULT_POSITION: Vec2 = { x: 0, y: 0 };
export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_NAME = 'Arial';
