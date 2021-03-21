// import { fail } from 'assert';
import * as chai from 'chai';
import * as mocha from 'mocha';
import * as chaiAsPromised from 'chai-as-promised';
import { DatabaseService } from './database.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { LocalDatabaseService } from '@app/services/local.database.service';
import 'reflect-metadata';
chai.use(chaiAsPromised);
export const READY_STATE_DISCONNECTED = 0;
export const READY_STATE_CONNECTED = 1;

mocha.describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let mongoUri: string;
    beforeEach(async () => {
        databaseService = new DatabaseService({} as LocalDatabaseService);
        mongoServer = new MongoMemoryServer();
        mongoUri = await mongoServer.getUri();
    });
    afterEach(async () => {
        if(databaseService.distantDatabase.connection.readyState) {
            await databaseService.closeConnection();
        }
    });

    it ('start(): should connect to the database when start is called', async () => {
        await databaseService.start(mongoUri);
        chai.expect(databaseService.distantDatabase.connection.readyState).to.equal(READY_STATE_CONNECTED);
    });

    it ('start(): should not connect to the database when start is called with wrong URL', async () => {
        try {
            await databaseService.start('WRONG URL');
        } catch {}
        chai.expect(databaseService.distantDatabase.connection.readyState).to.equal(READY_STATE_DISCONNECTED);
    });

    it ('closeConnection(): should no longer be connected if closeConnection is called', async () => {
        await databaseService.start(mongoUri);
        await databaseService.closeConnection();
        chai.expect(databaseService.distantDatabase.connection.readyState).to.equal(READY_STATE_DISCONNECTED);
    });
});
