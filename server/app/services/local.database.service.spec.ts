import { MetadataModel } from '@app/constants/metadata.schema';
import * as chai from 'chai';
import * as chaiAspromised from 'chai-as-promised';
import * as spies from 'chai-spies';
import * as filesystem from 'fs';
import * as mocha from 'mocha';
import { LocalDatabaseService } from './local.database.service';
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

    it('start(): should create a new file if ./app/drawings/drawing.database.json is not found', () => {
        chai.use(chaiAspromised);
        chai.spy.on(filesystem, 'readFileSync', () => {
            throw new Error();
        });
        chai.spy.on(filesystem, 'mkdirSync', () => {
            return '';
        });
        chai.spy.on(filesystem, 'writeFileSync', () => {
            return '';
        });
        databaseService.start();
        chai.expect(filesystem.mkdirSync).to.have.been.called;
    });

    it('start(): should throw an error if could not find nor create drawing.database.json', () => {
        chai.use(chaiAspromised);
        chai.spy.on(filesystem, 'readFileSync', () => {
            throw new Error();
        });
        chai.spy.on(filesystem, 'mkdirSync', () => {
            return '';
        });
        chai.spy.on(filesystem, 'writeFileSync', () => {
            throw new Error();
        });
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

    it('updateServerDrawings(): should throw an error if file is not correctly written', () => {
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
        chai.expect(databaseService.updateDrawing.bind(databaseService, 'id', 'string')).to.throw('Could not update drawing with provided id');
    });

    it('deleteDrawing(): should delete drawing with provided id from drawings array', () => {
        const expectedResult = {id: '1', drawing: 'original'};
        databaseService.localDatabase.drawings.push(expectedResult);
        databaseService.deleteDrawing(expectedResult.id);
        chai.expect(databaseService.localDatabase.drawings.length).to.deep.equal(0);
    });

    it('deleteDrawing(): should throw an error index of provided id is not found', () => {
        chai.use(chaiAspromised);
        chai.expect(databaseService.deleteDrawing.bind(databaseService, 'id')).to.throw('Could not find any drawing to delete with provided id');
    });

    it('filterDrawings(): should return an array with existing drawings', () => {
        const firstDrawing = new MetadataModel({name: 'default', labels: []});
        const secondDrawing = new MetadataModel({name: 'default', labels: []});
        const metadatas = [firstDrawing, secondDrawing];
        databaseService.localDatabase.drawings.push({id: firstDrawing.id, drawing: 's'});
        const result = databaseService.filterDrawings(metadatas);
        const expected = [{id: firstDrawing.id, name: 'default', drawing: 's', labels: []}];
        chai.expect(result).to.deep.equal(expected);
    });

    it('filterDrawings(): should throw an error if no matching drawing was found from metadatas', () => {
        chai.use(chaiAspromised);
        const firstDrawing = new MetadataModel({name: 'default', labels: []});
        const secondDrawing = new MetadataModel({name: 'default', labels: []});
        const metadatas = [secondDrawing];
        databaseService.localDatabase.drawings.push({id: firstDrawing.id, drawing: 's'});
        chai.expect(databaseService.filterDrawings.bind(databaseService, metadatas))
            .to.throw('Could not find any drawing matching with provided metadatas');
    });

    it('filterDrawings(): should throw an error if no matching drawing was found from localDatabase', () => {
        chai.use(chaiAspromised);
        chai.expect(databaseService.filterDrawings.bind(databaseService, [new MetadataModel({name: 'default', labels: ['lab1', 'lab2']})]))
            .to.throw('Could not find any drawing matching with provided metadatas');
    });

    it('filterByLabels(): should return an array containing all labels which drawings are on localDatabase', () => {
        const firstDrawing = new MetadataModel({name: 'default', labels: ['lab1', 'lab2']});
        const secondDrawing = new MetadataModel({name: 'default', labels: ['lab3', 'lab4']});
        const metadatas = [firstDrawing, secondDrawing];
        databaseService.localDatabase.drawings.push({id: firstDrawing.id, drawing: 's'});
        const result = databaseService.filterByLabels(metadatas);
        const expected = firstDrawing.labels;
        chai.expect(result).to.deep.equal(expected);
    });

    it('filterByLabels(): should throw an error if no matching drawing was found', () => {
        chai.use(chaiAspromised);
        chai.spy.on(databaseService, 'filterDrawings', () => {
            return [];
        });
        chai.expect(databaseService.filterByLabels.bind(databaseService, [new MetadataModel({name: 'default', labels: ['lab1', 'lab2']})]))
            .to.throw('Could not find any drawing matching with provided labels');
    });

    it('mapDrawingById(): should return an drawing corresponding to the metadata passed as parameter', async () => {
        const firstDrawing = new MetadataModel({name: 'default', labels: ['lab1', 'lab2']});
        databaseService.localDatabase.drawings.push({id: firstDrawing.id, drawing: 's'});
        const result = await databaseService.mapDrawingById(firstDrawing);
        const expected = {id: firstDrawing.id, name: 'default', drawing: 's', labels: ['lab1', 'lab2']};
        chai.expect(result).to.deep.equal(expected);
    });

    it('mapDrawingById(): should throw an error if no matching drawing was found', () => {
        chai.use(chaiAspromised);
        const firstDrawing = new MetadataModel({name: 'default', labels: ['lab1', 'lab2']});
        chai.expect(databaseService.mapDrawingById(firstDrawing)).to.eventually.be.rejectedWith(Error);
    });
})
