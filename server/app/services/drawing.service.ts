import * as Constants from '@app/constants/database.service.constants';
import { MetadataModel } from '@app/constants/metadata.schema';
import * as RegularExpressions from '@app/constants/regular.expressions';
import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/settings/types';
import { Drawing } from '@common/models/drawing';
import { inject, injectable } from 'inversify';
import * as mongoose from 'mongoose';
// export const MockData = {
//     name: 'Example',
//     drawing: 'VGhpcyBpcyBzaW1wbGUgQVNDSUkgQmFzZTY0IGZvciBTdGFja092ZXJmbG93IGV4YW1wbGUu',
//     labels: ['string1', 'string2'],
// };
@injectable()
export class DrawingService {
    distantDatabase: mongoose.Mongoose;
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.databaseService.localDatabaseService.start();
    }

    // TO DO: CREATE
    async saveDrawing(name: string, drawing: string, labels: string[] = []): Promise<void> {
        const canBeProcessed: boolean = this.drawingCanBeProcessed(name, drawing, labels);
        if (canBeProcessed) {
            const metadata = new MetadataModel({ name, labels });
            await metadata.save().then(() => {
                console.log('Metadata saved in database !');
            });
            if (this.databaseService.localDatabaseService.addDrawing(metadata.id, drawing)) {
                console.log('Drawing saved in database !');
            }
        } else {
            throw new Error("Drawing can't be processed, invalid data");
        }
    }
    drawingCanBeProcessed(name: string, drawing: string, labels: string[]): boolean {
        const nameIsValid: boolean = this.isValidName(name);
        const drawingIsValid: boolean = this.isValidDrawing(drawing);
        const labelsAreValid: boolean = this.areValidLabels(labels);
        return nameIsValid && drawingIsValid && labelsAreValid;
    }
    // TO DO: READ
    async getAllDrawings(): Promise<Drawing[]> {
        const metadatas = await MetadataModel.find({}).exec();
        return this.databaseService.localDatabaseService.filterDrawings(metadatas);
    }

    async getDrawingById(id: string): Promise<Drawing> {
        const drawing = await MetadataModel.findById(id).exec();
        if (drawing) {
            return this.databaseService.localDatabaseService.mapDrawingById(drawing);
        } else {
            return Constants.DRAWING_NOT_FOUND;
        }
    }

    async getDrawingsByName(name: string): Promise<Drawing[]> {
        const drawings = await MetadataModel.find({ name }).exec();
        return await this.databaseService.localDatabaseService.filterDrawings(drawings);
    }

    async getDrawingsByLabelsOne(labels: string[]): Promise<Drawing[]> {
        const drawings = await MetadataModel.find({ labels: { $in: labels } }).exec();
        return await this.databaseService.localDatabaseService.filterDrawings(drawings);
    }

    async getDrawingsByLabelsAll(labels: string[]): Promise<Drawing[]> {
        const drawings = await MetadataModel.find({ labels: { $all: labels } }).exec();
        return await this.databaseService.localDatabaseService.filterDrawings(drawings);
    }
    // TO DO: UPDATE
    async updateDrawingName(id: string, name: string): Promise<Drawing> {
        const drawing = await MetadataModel.findByIdAndUpdate(id, { name }).exec();
        if (drawing) {
            return this.getDrawingById(id);
        }
        return Constants.DRAWING_NOT_FOUND;
    }

    async updateDrawingLabels(id: string, labels: string[]): Promise<Drawing> {
        const drawing = await MetadataModel.findByIdAndUpdate(id, { labels }).exec();
        if (drawing) {
            return this.getDrawingById(id);
        }
        return Constants.DRAWING_NOT_FOUND;
    }

    async updateDrawing(id: string, drawing: string): Promise<Drawing> {
        const item = await MetadataModel.findById(id).exec();
        if (item && this.isValidDrawing(drawing)) {
            this.databaseService.localDatabaseService.updateDrawing(id, drawing);
            return this.getDrawingById(id);
        } else {
            return Constants.DRAWING_NOT_FOUND;
        }
    }

    // TO DO: DELETE

    async deleteDrawing(id: string): Promise<boolean> {
        const item = await MetadataModel.findByIdAndDelete(id).exec();
        if (item) {
            return this.databaseService.localDatabaseService.deleteDrawing(id);
        }
        return false;
    }

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
