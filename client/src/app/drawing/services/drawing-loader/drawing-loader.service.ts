import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ServerService } from '@app/server-communication/service/server.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingLoaderService {
    constructor(private drawingService: DrawingService, private server: ServerService) {}

    loadFromServer(imageId: string): void {
        this.server.getDrawingById(imageId).subscribe((drawingData) => this.drawingService.setImageFromBase64(drawingData.drawing));
    }
}
