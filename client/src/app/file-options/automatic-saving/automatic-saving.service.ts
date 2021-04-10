import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';

@Injectable({
    providedIn: 'root',
})
export class AutomaticSavingService {
    currentDrawing: string | null;

    constructor(private drawingService: DrawingService, private historyService: HistoryService) {
        this.drawingService.onDrawingLoaded.subscribe(() => {
            this.saveDrawingLocally();
        });

        this.historyService.onDrawingModification.subscribe(() => {
            this.saveDrawingLocally();
        });
    }

    loadMostRecentDrawing(): void {
        this.currentDrawing = localStorage.getItem('drawing') as string;
        if (this.currentDrawing) this.drawingService.setImageSavedLocally(this.currentDrawing);
    }

    saveDrawingLocally(): void {
        localStorage.setItem('drawing', this.drawingService.currentDrawing);
    }
}
