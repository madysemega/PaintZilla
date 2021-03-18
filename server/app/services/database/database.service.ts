import * as Constants from '@app/constants/database.constants';
import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
@injectable()
export class DatabaseService {
    private options: mongoose.ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    distantDatabase: mongoose.Mongoose;
    constructor() {
        this.distantDatabase = mongoose;
    }
    async start(url: string = Constants.DATABASE_URL): Promise<void> {
        await this.distantDatabase
            .connect(url, this.options)
            .then(() => {
                console.log('Connected successfully to Mongodb Atlas');
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }
}
