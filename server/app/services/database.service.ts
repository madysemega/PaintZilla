import * as Constants from '@app/constants/database.service.constants';
import { injectable } from 'inversify';
// @ts-ignore
// tslint:disable-next-line:no-require-imports
import mongoose = require('mongoose');
import { ConnectOptions } from 'mongoose';

@injectable()
export class DatabaseService {
    private options: ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    async start(url: string = Constants.DATABASE_URL): Promise<void> {
        await mongoose
            .connect(url, this.options)
            .then(() => {
                console.log('Mongoose is connected ;)');
            })
            .catch(() => {
                throw new Error('Database connection error');
            });
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }
}
