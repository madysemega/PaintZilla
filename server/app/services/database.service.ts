import * as Constants from '@app/constants/database.service.constants';
import { injectable } from 'inversify';
import { MongoClient, MongoClientOptions } from 'mongodb';
// @ts-ignore
import mongoose from 'mongoose';
@injectable()
export class DatabaseService {
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    private client: MongoClient;
    async start(url: string = Constants.DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await mongoose.connect(url, this.options);
            this.client = client;
        } catch {
            throw new Error('Database connection error');
        }
        return this.client;
    }
}
