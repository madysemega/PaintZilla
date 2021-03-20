import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Constants from '@app/server-communication/constants/server.service.constants';
import { Drawing } from '@common/models/drawing';
import { Validator } from '@common/validation/validator/validator';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ServerService {
    constructor(private httpClient: HttpClient) {}

    createDrawing(name: string = Constants.DEFAULT_NAME, drawing: string, labels: string[] = []): Observable<Drawing> {
        Validator.checkDrawing(drawing);
        return this.httpClient.post<Drawing>(Constants.API_URL, { name, drawing, labels }, Constants.JSON_HTTP_OPTIONS);
    }

    getAllDrawings(): Observable<Drawing[]> {
        return this.httpClient.get<Drawing[]>(Constants.API_URL);
    }

    getAllLabels(): Observable<string[]> {
        return this.httpClient.get<string[]>(Constants.API_URL + '/labels');
    }

    getDrawingById(id: string): Observable<Drawing> {
        Validator.checkId(id);
        return this.httpClient.get<Drawing>(Constants.API_URL + `/${id}`);
    }

    getDrawingsByName(name: string): Observable<Drawing[]> {
        Validator.checkName(name);
        return this.httpClient.get<Drawing[]>(Constants.API_URL + `/name/${name}`);
    }

    getDrawingsByLabelsAllMatch(labels: string[]): Observable<Drawing[]> {
        Validator.checkLabels(labels);
        return this.httpClient.get<Drawing[]>(Constants.API_URL + '/labels/all-labels/?drawing=' + encodeURIComponent(labels.toString()));
    }

    getDrawingsByLabelsOneMatch(labels: string[]): Observable<Drawing[]> {
        Validator.checkLabels(labels);
        return this.httpClient.get<Drawing[]>(Constants.API_URL + '/labels/one-label/?drawing=' + encodeURIComponent(labels.toString()));
    }

    updateDrawing(id: string, drawing: Drawing): Observable<Drawing> {
        Validator.checkId(id);
        Validator.checkAll(drawing);
        return this.httpClient.put<Drawing>(Constants.API_URL + `/${id}`, drawing, Constants.JSON_HTTP_OPTIONS);
    }

    updateDrawingName(id: string, name: string): Observable<Drawing> {
        Validator.checkId(id);
        Validator.checkName(name);
        return this.httpClient.put<Drawing>(Constants.API_URL + `/name/${id}`, name, Constants.TEXT_HTTP_OPTIONS);
    }

    updateDrawingLabels(id: string, labels: string[]): Observable<Drawing> {
        Validator.checkId(id);
        Validator.checkLabels(labels);
        return this.httpClient.put<Drawing>(Constants.API_URL + `/labels/${id}`, labels.toString(), Constants.TEXT_HTTP_OPTIONS);
    }

    updateDrawingContent(id: string, content: string): Observable<Drawing> {
        Validator.checkId(id);
        Validator.checkDrawing(content);
        return this.httpClient.put<Drawing>(Constants.API_URL + `/content/${id}`, content, Constants.TEXT_HTTP_OPTIONS);
    }

    deleteDrawing(id: string): Observable<void> {
        Validator.checkId(id);
        return this.httpClient.delete<void>(Constants.API_URL + `/${id}`);
    }
}
