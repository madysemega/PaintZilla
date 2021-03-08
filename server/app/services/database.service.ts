import * as Constants from '@app/constants/database.service.constants';
import { LocalDatabaseService } from '@app/services/local.database.service';
import { TYPES } from '@app/settings/types';
import { inject, injectable } from 'inversify';
import * as mongoose from 'mongoose';

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
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }
}
