import * as Constants from '@app/constants/database.service.constants';
import { MetadataModel } from '@app/constants/metadata.schema';
import * as RegularExpressions from '@app/constants/regular.expressions';
import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/settings/types';
import { Drawing } from '@common/models/drawing';
import { inject, injectable } from 'inversify';
import * as mongoose from 'mongoose';
@injectable()
export class DrawingService {
    distantDatabase: mongoose.Mongoose;
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.databaseService.localDatabaseService.start();
    }

    // TO DO: CREATE
    async saveDrawing(name: string = Constants.DEFAULT_NAME, drawing: string, labels: string[] = []): Promise<Drawing> {
        this.checkName(name);
        this.checkDrawing(drawing);
        this.checkLabels(labels);
        const metadata = new MetadataModel({ name, labels });
        await metadata.save().then(() => {
            console.log('Metadata saved in database !');
        });
        if (this.databaseService.localDatabaseService.addDrawing(metadata.id, drawing)) {
            console.log('Drawing saved in local database !');
            return this.getDrawingById(metadata.id);
        }
        return Constants.DRAWING_NOT_FOUND;
    }

    // TO DO: READ
    async getAllDrawings(): Promise<Drawing[]> {
        const metadatas = await MetadataModel.find({}).exec();
        return this.databaseService.localDatabaseService.filterDrawings(metadatas);
    }

    async getDrawingById(id: string): Promise<Drawing> {
        this.checkId(id);
        const drawing = await MetadataModel.findById(id).exec();
        if (drawing) {
            return this.databaseService.localDatabaseService.mapDrawingById(drawing);
        } else {
            return Constants.DRAWING_NOT_FOUND;
        }
    }

    async getDrawingsByName(name: string): Promise<Drawing[]> {
        this.checkName(name);
        const drawings = await MetadataModel.find({ name }).exec();
        return await this.databaseService.localDatabaseService.filterDrawings(drawings);
    }

    async getAllLabels(): Promise<string[]>{
        const metadatas = await MetadataModel.find({}).exec();
        if (metadatas) {
            return this.databaseService.localDatabaseService.filterByLabels(metadatas);
        }
        throw new Error('Could not get labels from getAllLabels');
    }

    async getDrawingsByLabelsOne(labels: string[]): Promise<Drawing[]> {
        this.checkLabels(labels);
        const drawings = await MetadataModel.find({ labels: { $in: labels } }).exec();
        return await this.databaseService.localDatabaseService.filterDrawings(drawings);
    }

    async getDrawingsByLabelsAll(labels: string[]): Promise<Drawing[]> {
        this.checkLabels(labels);
        const drawings = await MetadataModel.find({ labels: { $all: labels } }).exec();
        return await this.databaseService.localDatabaseService.filterDrawings(drawings);
    }

    // TO DO: UPDATE
    async updateDrawing(id: string, drawing: Drawing): Promise<Drawing> {
        this.checkId(id);
        this.checkAll(drawing);
        const updatedMetadata = await MetadataModel.findByIdAndUpdate(id, { name: drawing.name, labels: drawing.labels }).exec();
        if (updatedMetadata) {
            this.databaseService.localDatabaseService.updateDrawing(id, drawing.drawing);
            return this.getDrawingById(id);
        }
        return Constants.DRAWING_NOT_FOUND;
    }

    async updateDrawingName(id: string, name: string): Promise<Drawing> {
        this.checkId(id);
        this.checkName(name);
        const drawing = await MetadataModel.findByIdAndUpdate(id, { name }).exec();
        if (drawing) {
            return this.getDrawingById(id);
        }
        return Constants.DRAWING_NOT_FOUND;
    }

    async updateDrawingLabels(id: string, labels: string[]): Promise<Drawing> {
        this.checkId(id);
        this.checkLabels(labels);
        const drawing = await MetadataModel.findByIdAndUpdate(id, { labels }).exec();
        if (drawing) {
            return this.getDrawingById(id);
        }
        return Constants.DRAWING_NOT_FOUND;
    }

    async updateDrawingContent(id: string, drawing: string): Promise<Drawing> {
        this.checkId(id);
        this.checkDrawing(drawing);
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
        this.checkId(id);
        const item = await MetadataModel.findByIdAndDelete(id).exec();
        if (item) {
            return this.databaseService.localDatabaseService.deleteDrawing(id);
        }
        return false;
    }

    checkId(id: string): void {
        if (!this.isValidId(id)) {
            throw new Error('Invalid id provided');
        }
    }

    checkName(name: string): void {
        if (!this.isValidName(name)) {
            throw new Error('Invalid name provided');
        }
    }

    checkDrawing(drawing: string): void {
        if (!this.isValidDrawing(drawing)) {
            throw new Error('Invalid drawing provided');
        }
    }

    checkLabels(labels: string[]): void {
        if (!this.areValidLabels(labels)) {
            throw new Error('Invalid label(s) provided');
        }
    }

    checkAll(drawing: Drawing): void {
        this.checkId(drawing.id);
        this.checkName(drawing.name);
        this.checkDrawing(drawing.drawing);
        this.checkLabels(drawing.labels);
    }

    isValidId(id: string): boolean {
        return RegularExpressions.MONGO_ID_REGEX.test(id);
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
