import * as Constants from '@app/constants/database.service.constants';
import { DrawingSchema } from '@app/constants/drawing.schema';
import * as fileSystem from 'fs';
import { injectable } from 'inversify';
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
                    this.close();
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

    addDrawing(id: string, drawing: string): void {
        if ()
    }

    isValidDrawing(drawing: string): boolean {

    }
}
