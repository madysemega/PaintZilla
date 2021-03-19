// import { DrawingSchema } from '@app/constants/drawing.schema';
import { Metadata } from '@app/constants/metadata.schema';
export class LocalDatabaseMock {
    start(): void {}
    updateServerDrawings(): void {}
    addDrawing(id: string, drawing: string): void {}
    getDrawing(id: string): void {}
    getDrawingIndex(id: string): void {}
    updateDrawing(id: string, drawing: string): void {}
    deleteDrawing(id: string): void {}
    filterDrawings(metadatas: Metadata[]): void {}
    filterByLabels(metadatas: Metadata[]): void {}
    async mapDrawingById(metadata: Metadata): Promise<void> {}
}
