import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@common/communication/message';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BASE_URL } from './index.constants';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    constructor(private http: HttpClient) {}

    basicGet(): Observable<Message> {
        return this.http.get<Message>(BASE_URL).pipe(catchError(this.handleError<Message>('basicGet')));
    }

    basicPost(message: Message): Observable<void> {
        return this.http.post<void>(BASE_URL + '/send', message).pipe(catchError(this.handleError<void>('basicPost')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
