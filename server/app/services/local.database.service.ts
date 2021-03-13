import * as Constants from '@app/constants/database.service.constants';
import { DrawingSchema } from '@app/constants/drawing.schema';
import { Metadata } from '@app/constants/metadata.schema';
import { Drawing } from '@common/models/drawing';
import * as fileSystem from 'fs';
import { injectable } from 'inversify';
// TO DO: error cases processing
@injectable()
export class LocalDatabaseService {
    localDatabase: { drawings: DrawingSchema[] };
    start(): void {
        try {
            const str = fileSystem.readFileSync(Constants.LOCAL_DATABASE_PATH, Constants.UTF_8);
            const data = JSON.parse(str);
            this.localDatabase = data;
            console.log('Server drawings were charged successfully');
        } catch (error) {
            console.log("Couldn't parse the json data, details on " + error);
        }
    }
    updateServerDrawings(): void {
        try {
            const localDb = JSON.stringify(this.localDatabase);
            fileSystem.writeFileSync(Constants.LOCAL_DATABASE_PATH, localDb);
            console.log('All drawings were successfully updated');
        } catch (error) {
            throw new Error('An error occured in LocalDatabaseService.close() ' + error.message);
        }
    }

    addDrawing(id: string, drawing: string): void {
        this.localDatabase.drawings.push({ id, drawing });
    }

    getDrawing(id: string): DrawingSchema | undefined {
        const index = this.getDrawingIndex(id);
        if (index !== Constants.NOT_FOUND) {
            return this.localDatabase.drawings[index];
        }
        return undefined;
    }

    getDrawingIndex(id: string): number {
        const drawingToMatch = (element: DrawingSchema) => element.id === id;
        const index = this.localDatabase.drawings.findIndex(drawingToMatch);
        return index;
    }

    updateDrawing(id: string, drawing: string): void {
        const index = this.getDrawingIndex(id);
        if (index !== Constants.NOT_FOUND) {
            this.localDatabase.drawings[index].drawing = drawing;
        } else {
            throw new Error('Could not update drawing with provided id');
        }
    }

    deleteDrawing(id: string): void {
        const drawingIndex = this.getDrawingIndex(id);
        if (drawingIndex !== Constants.NOT_FOUND) {
            this.localDatabase.drawings.splice(drawingIndex, 1);
        } else {
            throw new Error('Could not find any drawing to delete with provided id');
        }
    }

    filterDrawings(metadatas: Metadata[]): Drawing[] {
        const result: Drawing[] = [];
        try {
            for (const drawing of this.localDatabase.drawings) {
                const data = metadatas.find((metadata: Metadata) => {
                    return metadata.id === drawing.id;
                });
                if (data) {
                    result.push({ id: drawing.id, name: data.name, drawing: drawing.drawing, labels: data.labels });
                }
            }
        } catch (err) {
            throw new Error('Error in filterDrawings, details ' + err);
        }
        return result;
    }

    filterByLabels(metadatas: Metadata[]): string[] {
        let result: string[] = [];
        const drawings = this.filterDrawings(metadatas);
        for (const drawing of drawings) {
            result = result.concat(
                drawing.labels.filter((label: string) => {
                    return result.findIndex((item) => label === item) === Constants.NOT_FOUND;
                }),
            );
        }
        return result;
    }

    async mapDrawingById(metadata: Metadata): Promise<Drawing> {
        const drawing = this.getDrawing(metadata.id.toString());
        if (drawing) {
            return { id: drawing.id, name: metadata.name, drawing: drawing.drawing, labels: metadata.labels };
        }
        return Constants.DRAWING_NOT_FOUND;
    }
}
