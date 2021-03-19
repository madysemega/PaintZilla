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

    it('getDrawing(): should return drawing corresponding to the provided id', () => {
        const expectedResult = {id: '1', drawing: 's'};
        databaseService.localDatabase.drawings.push(expectedResult);
        const actualResult = databaseService.getDrawing(expectedResult.id);
        chai.expect(actualResult).to.deep.equal(expectedResult);
    });

    it('getDrawing(): should return undefined if provided an non existing id', () => {
        const expectedResult = {id: '1', drawing: 's'};
        const actualResult = databaseService.getDrawing(expectedResult.id);
        chai.expect(actualResult).to.equal(undefined);
    });

    it('getDrawingIndex(): should return index in drawings array of drawing which id was provided', () => {
        const expectedResult = {id: '1', drawing: 's'};
        databaseService.localDatabase.drawings.push(expectedResult);
        const actualResult = databaseService.getDrawingIndex(expectedResult.id);
        const expectedIndex = 0;
        chai.expect(actualResult).to.deep.equal(expectedIndex);
    });

    it('getDrawingIndex(): should return -1 if provided id corresponds to no drawing', () => {
        const expectedResult = {id: '1', drawing: 's'};
        const actualResult = databaseService.getDrawingIndex(expectedResult.id);
        const expectedIndex = -1;
        chai.expect(actualResult).to.deep.equal(expectedIndex);
    });

    it('updateDrawing(): should update drawing property with provided drawing', () => {
        const expected = 'updated';
        const expectedResult = {id: '1', drawing: 'original'};
        databaseService.localDatabase.drawings.push(expectedResult);
        databaseService.updateDrawing(expectedResult.id, expected);
        chai.expect(databaseService.localDatabase.drawings[0].drawing).to.deep.equal(expected);
    });

    it('updateDrawing(): should throw an error index of provided id is not found', () => {
        chai.use(chaiAspromised);
        chai.expect(databaseService.updateDrawing).to.throw(Error);
    });

    it('deleteDrawing(): should delete drawing with provided id from drawings array', () => {
        const expectedResult = {id: '1', drawing: 'original'};
        databaseService.localDatabase.drawings.push(expectedResult);
        databaseService.deleteDrawing(expectedResult.id);
        chai.expect(databaseService.localDatabase.drawings.length).to.deep.equal(0);
    });

    it('deleteDrawing(): should throw an error index of provided id is not found', () => {
        chai.use(chaiAspromised);
        chai.expect(databaseService.deleteDrawing).to.throw(Error);
    });

    it('filterDrawings(): should return an array with existing drawings', () => {
        const metadatas: Metadata = [{id: '1', labels: []}, {id: '2', labels: []}];
        databaseService.localDatabase.drawings.push({id: '1', drawing: 's'});
        const result = databaseService.filterDrawings(metadatas);
        const expected = [{id: '1', labels: []}];
        chai.expect(result).to.deep.equal(expected);
    });
})
