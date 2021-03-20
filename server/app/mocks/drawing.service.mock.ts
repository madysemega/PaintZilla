import { Drawing } from '@common/models/drawing';
import * as Constants from '@app/constants/drawing.service.spec.constants';
export class DrawingServiceMock {
    drawings: Drawing[];

    constructor(){
        this.drawings = [];
    }

    async saveDrawing(name: string = Constants.DEFAULT_NAME, drawing: string, labels: string[] = []): Promise<Drawing> {
        return Constants.DRAWING;
    }

    // TO DO: READ
    async getAllDrawings(): Promise<Drawing[]> {
        return this.drawings;
    }

    async getDrawingById(id: string): Promise<Drawing> {
        return Constants.DRAWING;
    }

    async getDrawingsByName(name: string): Promise<Drawing[]> {
        return this.drawings;
    }

    async getAllLabels(): Promise<string[]> {
        return [''];
    }

    async getDrawingsByLabelsOne(labels: string[]): Promise<Drawing[]> {
        return this.drawings;
    }

    async getDrawingsByLabelsAll(labels: string[]): Promise<Drawing[]> {
        return this.drawings;
    }

    // TO DO: UPDATE
    async updateDrawing(id: string, drawing: Drawing): Promise<Drawing> {
        return Constants.DRAWING;
    }

    async updateDrawingName(id: string, name: string): Promise<Drawing> {
        return Constants.DRAWING;
    }

    async updateDrawingLabels(id: string, labels: string[]): Promise<Drawing> {
        return Constants.DRAWING;
    }

    async updateDrawingContent(id: string, drawing: string): Promise<Drawing> {
        return Constants.DRAWING;
    }

    // TO DO: DELETE

    async deleteDrawing(id: string): Promise<void> {}
}
