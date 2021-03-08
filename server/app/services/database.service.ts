import * as Constants from '@app/constants/database.service.constants';
import { LocalDatabaseService } from '@app/services/local.database.service';
import { TYPES } from '@app/settings/types';
import { inject, injectable } from 'inversify';
// @ts-ignore
// tslint:disable-next-line:no-require-imports
import mongoose = require('mongoose');
import { ConnectOptions, Mongoose } from 'mongoose';

@injectable()
export class DatabaseService {
    private options: ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    distantDatabase: Mongoose;
    localDatabase: Mongoose;
    constructor(@inject(TYPES.LocalDatabaseService) private localDatabaseservice: LocalDatabaseService) {
        this.distantDatabase = mongoose;
    }
    async start(url: string = Constants.DATABASE_URL): Promise<void> {
        await this.distantDatabase
            .connect(url, this.options)
            .then(async () => {
                await this.localDatabaseservice.start().catch((error: Error) => {
                    console.log('Could not connect to local database, details on the ' + error);
                });
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }
}
