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
