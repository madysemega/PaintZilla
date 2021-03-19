import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { LocalDatabaseMock } from '@app/mocks/local.database.service.mock';
export class DatabaseServiceMock {
    mongoServer: MongoMemoryServer;
    mongoUri: string;
    private options: mongoose.ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    distantDatabase: mongoose.Mongoose;
    localDatabaseService: LocalDatabaseMock;
    constructor() {
        this.mongoServer = new MongoMemoryServer();
        this.distantDatabase = mongoose;
        this.localDatabaseService = new LocalDatabaseMock();
    }

    async start(url: string): Promise<void> {
        this.mongoUri = await this.mongoServer.getUri();
        await this.distantDatabase
            .connect(this.mongoUri, this.options)
            .then(() => {
                console.log('Connected successfully to Mongodb Atlas');
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });
    }

    async closeConnection(): Promise<void> {
        await this.distantDatabase.connection.close();
    }
}
