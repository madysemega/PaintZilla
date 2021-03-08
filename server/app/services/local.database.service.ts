import * as Constants from '@app/constants/database.service.constants';
import { injectable } from 'inversify';
// @ts-ignore
// tslint:disable-next-line:no-require-imports
import mongoose = require('mongoose');
import { ConnectOptions, Mongoose } from 'mongoose';

@injectable()
export class LocalDatabaseService {
    private options: ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    localDatabase: Mongoose;
    constructor() {
        this.localDatabase = mongoose;
    }
    async start(url: string = Constants.LOCAL_HOST_URL): Promise<void> {
        await this.localDatabase
            .createConnection(url, this.options)
            .then(() => {
                console.log('Mongoose has successfully connected to distant and local databases');
            })
            .catch(() => {
                throw new Error('Local database connection error');
            });
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }
}
