import { HttpHeaders } from '@angular/common/http';

export const HOST = 'http://localhost:3000';
export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
        'Content-Type': 'application/json',
  }),
};
