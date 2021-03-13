import { HttpHeaders } from '@angular/common/http';

export const JSON_HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

export const TEXT_HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'text/plain',
    }),
};
export const API_URL = 'http://localhost:3000/api/drawings';
// export const CREATE_DRAWING = HOST;
// export const GET_ALL_DRAWINGS = HOST;
// export const GET_DRAWING_BY_ID = HOST + '/:id';
// export const GET_DRAWINGS_BY_NAME = HOST + '/name/:name';
// export const GET_DRAWINGS_BY_LABEL_ALL = HOST + '/labels/all-labels';
// export const GET_DRAWINGS_BY_LABEL_ONE = HOST + '/labels/one-label';
// export const PUT_DRAWING = HOST + '/:id';
// export const PUT_DRAWING_NAME = HOST + '/name/:id';
// export const PUT_DRAWING_LABELS = HOST + '/labels/:id';
// export const PUT_DRAWING_CONTENT = HOST + '/content/:id';
// export const DELETE_DRAWING = HOST + '/:id';
