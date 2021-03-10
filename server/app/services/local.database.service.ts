import * as Constants from '@app/constants/database.service.constants';
import { DrawingSchema } from '@app/constants/drawing.schema';
import { Metadata } from '@app/constants/metadata.schema';
import * as RegularExpressions from '@app/constants/regular.expressions';
import { Drawing } from '@common/models/drawing';
import * as fileSystem from 'fs';
import { injectable } from 'inversify';
// TO DO: error cases processing
@injectable()
export class LocalDatabaseService {
    localDatabase: { drawings: DrawingSchema[] };
    async start(): Promise<void> {
        fileSystem.readFile(Constants.LOCAL_DATABASE_PATH, Constants.UTF_8, (error, jsonString) => {
            if (error) {
                console.log('Error while reading json file from local database, details on ' + error);
            } else {
                try {
                    const data = JSON.parse(jsonString);
                    this.localDatabase = data;
                    console.log('Connected successfully to database');
                } catch (error) {
                    console.log("Couldn't parse the json data, details on " + error);
                }
            }
        });
    }
    async close(): Promise<void> {
        const localDb = JSON.stringify(this.localDatabase);
        fileSystem.writeFile(Constants.LOCAL_DATABASE_PATH, localDb, (error) => {
            if (error) {
                console.log('Error writing file', error);
            } else {
                console.log('Successfully wrote file');
            }
        });
    }

    addDrawing(id: string, drawing: string): boolean {
        if (this.isValidID(id)) {
            this.localDatabase.drawings.push({ id, drawing });
            return true;
        }
        return false;
    }

    isValidID(id: string): boolean {
        return RegularExpressions.MONGO_ID_REGEX.test(id);
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

    updateDrawing(id: string, drawing: string): boolean {
        const index = this.getDrawingIndex(id);
        if (index !== Constants.NOT_FOUND) {
            this.localDatabase.drawings[id] = drawing;
            return true;
        }
        return false;
    }

    deleteDrawing(id: string): boolean {
        const drawingIndex = this.getDrawingIndex(id);
        if (drawingIndex !== Constants.NOT_FOUND) {
            this.localDatabase.drawings.splice(drawingIndex, 1);
            console.log(this.localDatabase.drawings.length);
            return true;
        }
        return false;
    }

    async filterDrawings(metadatas: Metadata[]): Promise<Drawing[]> {
        const result: Drawing[] = [];
        for (const drawing of this.localDatabase.drawings) {
            const data = metadatas.find((metadata: Metadata) => {
                return metadata.id === drawing.id;
            });
            if (data) {
                result.push({ id: drawing.id, name: data.name, drawing: drawing.drawing, labels: data.labels });
            }
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
