import * as Constants from '@app/constants/database.service.constants';
import { METADATA } from '@app/constants/metadata.schema';
import * as RegularExpressions from '@app/constants/regular.expressions';
import { LocalDatabaseService } from '@app/services/local.database.service';
import { TYPES } from '@app/settings/types';
import { inject, injectable } from 'inversify';
import * as mongoose from 'mongoose';

export const MockData = {
    name: 'Example',
    drawing: 'VGhpcyBpcyBzaW1wbGUgQVNDSUkgQmFzZTY0IGZvciBTdGFja092ZXJmbG93IGV4YW1wbGUu',
    labels: ['string1', 'string2'],
};
@injectable()
export class DatabaseService {
    private options: mongoose.ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    distantDatabase: mongoose.Mongoose;
    constructor(@inject(TYPES.LocalDatabaseService) private localDatabaseService: LocalDatabaseService) {
        this.distantDatabase = mongoose;
    }
    async start(url: string = Constants.DATABASE_URL): Promise<void> {
        await this.distantDatabase
            .connect(url, this.options)
            .then(async () => {
                await this.localDatabaseService.start();
                await this.saveDrawing(MockData.name, MockData.drawing, MockData.labels);
                await this.localDatabaseService.close();
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
        await this.localDatabaseService.close();
    }

    // TO DO: CREATE
    async saveDrawing(name: string, drawing: string, labels: string[]): Promise<void> {
        const nameIsValid: boolean = this.isValidName(name);
        const drawingIsValid: boolean = this.isValidDrawing(drawing);
        const labelsAreValid: boolean = this.areValidLabels(labels);
        const canBeProcessed: boolean = nameIsValid && drawingIsValid && labelsAreValid;
        if (canBeProcessed) {
            const metadata = new METADATA({ name, labels });
            await metadata.save().then(() => {
                console.log('Metadata saved in database !');
            });
            if (this.localDatabaseService.addDrawing(metadata.id, drawing)) {
                console.log('Drawing saved in database !');
            }
        } else {
            console.log("Drawing can't be processed !");
        }
    }
    // TO DO: READ
    // TO DO: UPDATE
    // TO DO: DELETE

    isValidName(name: string): boolean {
        return RegularExpressions.NAME_REGEX.test(name);
    }

    isValidDrawing(drawing: string): boolean {
        return RegularExpressions.BASE_64_REGEX.test(drawing);
    }

    areValidLabels(labels: string[]): boolean {
        return labels.every((label: string) => RegularExpressions.LABEL_REGEX.test(label));
    }
}
