import * as Constants from '@app/constants/database.service.constants';
import { DrawingSchema } from '@app/constants/drawing.schema';
import * as RegularExpressions from '@app/constants/regular.expressions';
import * as fileSystem from 'fs';
import { injectable } from 'inversify';

// TO DO: error cases processing
@injectable()
export class LocalDatabaseService {
    localDatabase: { dataset: DrawingSchema[] };
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
            this.localDatabase.dataset.push({ id, drawing });
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
            return this.localDatabase.dataset[index];
        }
        return undefined;
    }

    getDrawingIndex(id: string): number {
        const drawingToMatch = (element: DrawingSchema) => element.id === id;
        const index = this.localDatabase.dataset.findIndex(drawingToMatch);
        return index;
    }

    updateDrawing(id: string, drawing: string): boolean {
        const index = this.getDrawingIndex(id);
        if (index !== Constants.NOT_FOUND) {
            this.localDatabase.dataset[id] = drawing;
            return true;
        }
        return false;
    }

    deleteDrawing(id: string): boolean {
        const drawingIndex = this.getDrawingIndex(id);
        if (drawingIndex !== Constants.NOT_FOUND) {
            this.localDatabase.dataset.splice(drawingIndex, 1);
            console.log(this.localDatabase.dataset.length);
            return true;
        }
        return false;
    }
}
