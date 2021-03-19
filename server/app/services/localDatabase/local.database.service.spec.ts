import * as mocha from 'mocha';
import * as chai from 'chai';
import * as spies from 'chai-spies';
import * as filesystem from 'fs';
import { LocalDatabaseService } from '@app/services/localDatabase/local.database.service';
import * as chaiAspromised from 'chai-as-promised';
chai.use(spies);
mocha.describe('Local database service', () => {
    let databaseService: LocalDatabaseService;
    beforeEach(async () => {
        databaseService = new LocalDatabaseService();
    });

    afterEach(async () => {
        chai.spy.restore(filesystem);
        chai.spy.restore(JSON);
    });

    it('start(): should return JSON file content if it is parsed correctly', () => {
        const expectedResult = { drawings: [{id: '1', drawing: 's'}] };
        chai.spy.on(filesystem, 'readFileSync', () => {
            return '';
        });
        chai.spy.on(JSON, 'parse', () => {
            return expectedResult;
        });
        databaseService.start();
        chai.expect(databaseService.localDatabase).to.deep.equal(expectedResult);
    });

    it('start(): should throw an error if file is not parsed correctly', () => {
        chai.use(chaiAspromised);
        chai.expect(databaseService.start).to.throw(Error);
    });

    it('updateServerDrawings(): should call fileSystem.writeFileSync', () => {
        chai.spy.on(JSON, 'stringify', () => {
            return '';
        });
        chai.spy.on(filesystem, 'writeFileSync', () => {
            return null;
        });
        databaseService.updateServerDrawings();
        chai.expect(filesystem.writeFileSync).to.have.been.called;
    });

    it('updateServerDrawings(): should throw an error if file correctly written', () => {
        chai.use(chaiAspromised);
        chai.expect(databaseService.updateServerDrawings).to.throw(Error);
    });

    it('addDrawing(): should add a drawing with specified parameters to drawings array', () => {
        const expectedResult = {id: '1', drawing: 's'};
        databaseService.addDrawing(expectedResult.id, expectedResult.drawing);
        chai.expect(databaseService.localDatabase.drawings[0]).to.deep.equal(expectedResult);
    });
})
