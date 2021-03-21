import * as Constants from '@app/constants/database.constants';
import { MetadataModel } from '@app/constants/metadata.schema';
import { Server } from '@app/server';
import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/types';
import { Drawing } from '@common/models/drawing';
import { Validator } from '@common/validation/validator/validator';
import { inject, injectable } from 'inversify';
import * as mongoose from 'mongoose';
@injectable()
export class DrawingService {
    distantDatabase: mongoose.Mongoose;
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.databaseService.localDatabaseService.start();
        Server.configureServerDisabling(() => {
            try {
                this.databaseService.localDatabaseService.updateServerDrawings();
            } catch (error) {
                console.log('An error occurred while closing the server', error.message);
            }
        });
    }

    // TO DO: CREATE
    async saveDrawing(name: string = Constants.DEFAULT_NAME, drawing: string, labels: string[] = []): Promise<Drawing> {
        Validator.checkName(name);
        Validator.checkDrawing(drawing);
        Validator.checkLabels(labels);
        const metadata = new MetadataModel({ name, labels });
        await metadata.save().then(() => {
            this.databaseService.localDatabaseService.addDrawing(metadata.id, drawing);
        });
        return this.getDrawingById(metadata.id);
    }

    // TO DO: READ
    async getAllDrawings(): Promise<Drawing[]> {
        const metadatas = await MetadataModel.find({}).exec();
        return this.databaseService.localDatabaseService.filterDrawings(metadatas);
    }

    async getDrawingById(id: string): Promise<Drawing> {
        Validator.checkId(id);
        const metadata = await MetadataModel.findById(id).exec();
        if (metadata) {
            return this.databaseService.localDatabaseService.mapDrawingById(metadata);
        }
        throw new Error('Metadata not found with the provided id.');
    }

    async getDrawingsByName(name: string): Promise<Drawing[]> {
        Validator.checkName(name);
        const drawings = await MetadataModel.find({ name }).exec();
        return this.databaseService.localDatabaseService.filterDrawings(drawings);
    }

    async getAllLabels(): Promise<string[]> {
        const metadatas = await MetadataModel.find({});
        if (metadatas) {
            return this.databaseService.localDatabaseService.filterByLabels(metadatas);
        }
        throw new Error('Could not get metadatas from getAllLabels');
    }

    async getDrawingsByLabelsOne(labels: string[]): Promise<Drawing[]> {
        Validator.checkLabels(labels);
        const drawings = await MetadataModel.find({ labels: { $in: labels } }).exec();
        return this.databaseService.localDatabaseService.filterDrawings(drawings);
    }

    async getDrawingsByLabelsAll(labels: string[]): Promise<Drawing[]> {
        Validator.checkLabels(labels);
        const drawings = await MetadataModel.find({ labels: { $all: labels } }).exec();
        return this.databaseService.localDatabaseService.filterDrawings(drawings);
    }

    // TO DO: UPDATE
    async updateDrawing(id: string, drawing: Drawing): Promise<Drawing> {
        Validator.checkId(id);
        Validator.checkAll(drawing);
        const metadata = await MetadataModel.findByIdAndUpdate(id, { name: drawing.name, labels: drawing.labels }).exec();
        if (metadata) {
            this.databaseService.localDatabaseService.updateDrawing(id, drawing.drawing);
            return this.getDrawingById(id);
        }
        throw new Error('Metadata not found with the provided id.');
    }

    async updateDrawingName(id: string, name: string): Promise<Drawing> {
        Validator.checkId(id);
        Validator.checkName(name);
        const drawing = await MetadataModel.findByIdAndUpdate(id, { name }).exec();
        if (drawing) {
            return this.getDrawingById(id);
        }
        throw new Error('Metadata not found with the provided id.');
    }

    async updateDrawingLabels(id: string, labels: string[]): Promise<Drawing> {
        Validator.checkId(id);
        Validator.checkLabels(labels);
        const metadata = await MetadataModel.findByIdAndUpdate(id, { labels }).exec();
        if (metadata) {
            return this.getDrawingById(id);
        }
        throw new Error('Metadata not found with the provided id.');
    }

    async updateDrawingContent(id: string, drawing: string): Promise<Drawing> {
        Validator.checkId(id);
        Validator.checkDrawing(drawing);
        const metadata = await MetadataModel.findById(id).exec();
        if (metadata) {
            this.databaseService.localDatabaseService.updateDrawing(id, drawing);
            return this.getDrawingById(id);
        }
        throw new Error('Metadata not found with the provided id.');
    }

    // TO DO: DELETE

    async deleteDrawing(id: string): Promise<void> {
        Validator.checkId(id);
        const item = await MetadataModel.findByIdAndDelete(id);
        if (item) {
            this.databaseService.localDatabaseService.deleteDrawing(id);
        } else {
            throw new Error('Could not deleted drawing with provided id');
        }
    }
}
