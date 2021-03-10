import * as path from 'path';
export const DATABASE_URL = 'mongodb+srv://mady:admin@cluster0.qpved.mongodb.net/log2990-201?retryWrites=true&w=majority';
export const LOCAL_DATABASE_PATH = path.join(__dirname, '../drawings/drawing.database.json');
export const UTF_8 = 'utf-8';
export const NOT_FOUND = -1;
export const DRAWING_NOT_FOUND = { drawing: '', id: '', labels: [], name: '' };
