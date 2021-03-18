import { fail } from 'assert';
import * as chai from 'chai';
import * as mocha from 'mocha';
import * as mongoose from 'mongoose';
import { DatabaseService } from './database.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
export class MockLocalDb {}

mocha.describe('Database service', () => {
    let databaseService: DatabaseService;
    beforeEach(async () => {
        databaseService = new DatabaseService({} as MockLocalDb);
    })
});
