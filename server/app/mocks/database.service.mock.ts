import { LocalDatabaseMock } from '@app/mocks/local.database.service.mock';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
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

    async start(): Promise<void> {
        this.mongoUri = await this.mongoServer.getUri();
        await this.distantDatabase
            .connect(this.mongoUri, this.options)
            .then(() => {
                console.log('Connected successfully to Mongodb Atlas');
            });
    }

    async closeConnection(): Promise<void> {
        await this.distantDatabase.connection.close();
    }
}
