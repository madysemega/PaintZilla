import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientDrawingModel } from '@app/commons/class/drawing';
import * as Constants from '@app/commons/constants/server.service.constants';
// import { Drawing } from '@common/models/drawing';
// import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ServerService {
    constructor(private httpClient: HttpClient) {}

  saveDrawing(newName: string, newDrawing: string, newLabels: string[]): void {
        const drawingToAdd: ClientDrawingModel = { name: newName, drawing: newDrawing, labels: newLabels };
        this.httpClient.post<ClientDrawingModel>(Constants.HOST + '/create', drawingToAdd, Constants.HTTP_OPTIONS);
  }
}
