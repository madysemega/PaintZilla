import * as mocha from 'mocha';
import { DatabaseServiceMock } from '@app/mocks/database.service.mock';
import { MetadataModel } from '@app/constants/metadata.schema';
import { DrawingService } from './drawing.service';
import * as spies from 'chai-spies';
import * as chaiAspromised from 'chai-as-promised';
import * as chai from 'chai';
import { Validator } from '@common/validation/validator/validator';
import { ValidatorMock } from '@app/mocks/validator.mock';
import { Drawing } from '@common/models/drawing';
import * as Constants from '@app/constants/drawing.service.spec.contants';
chai.use(spies);
export const MOCK_DRAWING: Drawing = {
    id: Constants.DEFAULT_ID,
    drawing: Constants.DEFAULT_DRAWING,
    name: Constants.DEFAULT_NAME,
    labels: Constants.DEFAULT_LABELS,
};
mocha.describe('Drawing Service', () => {
    let drawingService: DrawingService;
    let databaseService: DatabaseServiceMock;
    mocha.before(() => {
        chai.spy.on(Validator, 'checkAll', ValidatorMock.checkAll);
        chai.spy.on(Validator, 'checkId', ValidatorMock.checkId);
        chai.spy.on(Validator, 'checkName', ValidatorMock.checkName);
        chai.spy.on(Validator, 'checkDrawing', ValidatorMock.checkDrawing);
        chai.spy.on(Validator, 'checkLabels', ValidatorMock.checkLabels);
    });
    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        drawingService = new DrawingService(databaseService as any);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
        chai.spy.restore(MetadataModel);
        chai.spy.restore(drawingService);
    });

    it ('saveDrawing(): should return a drawing made from provided arguments if database is running', (done) => {
        databaseService.start();
        chai.spy.on(drawingService, 'getDrawingById', () => {
            return MOCK_DRAWING;
        });
        drawingService.saveDrawing(MOCK_DRAWING.name, MOCK_DRAWING.drawing, MOCK_DRAWING.labels).then((result) => {
            chai.expect(result).to.equal(MOCK_DRAWING);
            done();
        });
    });

    it ('getAllDrawings(): should call filterDrawings from localDatabaseService', (done) => {
        databaseService.start();
        chai.spy.on(databaseService.localDatabaseService, 'filterDrawings');
        drawingService.getAllDrawings().then(() => {
            chai.expect(databaseService.localDatabaseService.filterDrawings).to.have.been.called;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it ('getDrawingById(): should call localDatabaseService.mapDrawingById if provided an existing id', (done) => {
        databaseService.start();
        chai.spy.on(databaseService.localDatabaseService, 'mapDrawingById');
        chai.spy.on(MetadataModel, 'findById', () => {
            const metadata = new MetadataModel({ name: MOCK_DRAWING.name, labels: MOCK_DRAWING.labels });
            metadata.save();
            return MetadataModel.find({});
        });
        drawingService.getDrawingById(MOCK_DRAWING.id).then(() => {
            chai.expect(databaseService.localDatabaseService.mapDrawingById).to.have.been.called;
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it ('getDrawingById(): should throw an error if request for metadatas fails', async () => {
        chai.use(chaiAspromised);
        databaseService.start();
        chai.expect(drawingService.getDrawingById(MOCK_DRAWING.id)).to.eventually.be.rejectedWith(Error);
    });

    it ('getDrawingsByName(): should call localDatabaseService.filterDrawings', (done) => {
        databaseService.start();
        chai.spy.on(databaseService.localDatabaseService, 'filterDrawings');
        chai.spy.on(MetadataModel, 'find', () => {
            const metadata = new MetadataModel({ name: MOCK_DRAWING.name, labels: MOCK_DRAWING.labels });
            metadata.save();
            return MetadataModel.findById(metadata.id);
        });
        drawingService.getDrawingsByName(MOCK_DRAWING.name).then(() => {
            chai.expect(databaseService.localDatabaseService.filterDrawings).to.have.been.called;
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it ('getAllLabels(): should call filterByLabels from localDatabaseService if it finds labels', (done) => {
        databaseService.start();
        chai.spy.on(databaseService.localDatabaseService, 'filterByLabels');
        drawingService.getAllDrawings().then(() => {
            chai.expect(databaseService.localDatabaseService.filterByLabels).to.have.been.called;
            done();
        }).catch((error)=> {
            done(error);
        });
    });

    it ('getAllLabels(): should throw an error if request for metadatas fails', async () => {
        chai.use(chaiAspromised);
        chai.expect(drawingService.getAllLabels()).to.eventually.be.rejectedWith(Error);
    });

    it ('getDrawingsByLabelsOne(): should call localDatabaseService.filterDrawings', (done) => {
        databaseService.start();
        chai.spy.on(databaseService.localDatabaseService, 'filterDrawings');
        drawingService.getDrawingsByLabelsOne(MOCK_DRAWING.labels).then(() => {
            chai.expect(databaseService.localDatabaseService.filterDrawings).to.have.been.called;
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it ('getDrawingsByLabelsAll(): should call localDatabaseService.filterDrawings', (done) => {
        databaseService.start();
        chai.spy.on(databaseService.localDatabaseService, 'filterDrawings');
        drawingService.getDrawingsByLabelsAll(MOCK_DRAWING.labels).then(() => {
            chai.expect(databaseService.localDatabaseService.filterDrawings).to.have.been.called;
            done();
        }).catch((error) => {
            done(error);
        });
    });

    it ('updateDrawing(): should call drawingService.getDrawingById if request for metadatas is a success', (done) => {
        databaseService.start();
        chai.spy.on(drawingService, 'getDrawingById', () => {
            return MOCK_DRAWING;
        });
        drawingService.saveDrawing(MOCK_DRAWING.name, MOCK_DRAWING.drawing, MOCK_DRAWING.labels).then((result) => {
            chai.expect(drawingService.getDrawingById).to.have.been.called;
            done();
        });
    });

    it ('updateDrawing(): should throw an error if request for metadatas fails', async () => {
        chai.use(chaiAspromised);
        chai.expect(drawingService.updateDrawing(MOCK_DRAWING.id, MOCK_DRAWING)).to.eventually.be.rejectedWith(Error);
    });

    it ('updateDrawingName(): should call drawingService.getDrawingById if request for metadatas is a success', (done) => {
        databaseService.start();
        chai.spy.on(drawingService, 'getDrawingById', () => {
            return MOCK_DRAWING;
        });
        chai.spy.on(MetadataModel, 'findByIdAndUpdate', () => {
            return MetadataModel.find({});
        });
        drawingService.updateDrawingName(MOCK_DRAWING.id, MOCK_DRAWING.name).then((result) => {
            chai.expect(drawingService.getDrawingById).to.have.been.called;
            done();
        });
    });

    it ('updateDrawingName(): should throw an error if request for metadatas fails', async () => {
        chai.use(chaiAspromised);
        chai.expect(drawingService.updateDrawingName(MOCK_DRAWING.id, MOCK_DRAWING.name)).to.eventually.be.rejectedWith(Error);
    });

    it ('updateDrawingLabels(): should call drawingService.getDrawingById if request for metadatas is a success', (done) => {
        chai.use(spies);
        databaseService.start();
        chai.spy.on(drawingService, 'getDrawingById', () => {
            return MOCK_DRAWING;
        });
        chai.spy.on(MetadataModel, 'findByIdAndUpdate', () => {
            return MetadataModel.find({});
        });
        drawingService.updateDrawingLabels(MOCK_DRAWING.id, MOCK_DRAWING.labels).then((result) => {
            chai.expect(drawingService.getDrawingById).to.have.been.called;
            done();
        });
    });

    it ('updateDrawingLabels(): should throw an error if request for metadatas fails', async () => {
        chai.use(chaiAspromised);
        chai.expect(drawingService.updateDrawingLabels(MOCK_DRAWING.id, MOCK_DRAWING.labels)).to.eventually.be.rejectedWith(Error);
    });

    it ('updateDrawingContent(): should call drawingService.getDrawingById if request for metadatas is a success', (done) => {
        chai.use(spies);
        databaseService.start();
        chai.spy.on(drawingService, 'getDrawingById', () => {
            return MOCK_DRAWING;
        });
        chai.spy.on(MetadataModel, 'findById', () => {
            return MetadataModel.find({});
        });
        drawingService.updateDrawingContent(MOCK_DRAWING.id, MOCK_DRAWING.drawing).then((result) => {
            chai.expect(drawingService.getDrawingById).to.have.been.called;
            done();
        });
    });

    it ('updateDrawingContent(): should throw an error if request for metadatas fails', async () => {
        chai.use(chaiAspromised);
        chai.expect(drawingService.updateDrawingContent(MOCK_DRAWING.id, MOCK_DRAWING.drawing)).to.eventually.be.rejectedWith(Error);
    });

    it ('deleteDrawing(): should call localDatabaseService.deleteDrawing if request for metadatas is a success', (done) => {
        chai.use(spies);
        databaseService.start();
        chai.spy.on(databaseService.localDatabaseService, 'deleteDrawing', () => {
            return MOCK_DRAWING;
        });
        chai.spy.on(MetadataModel, 'findByIdAndDelete', () => {
            return MetadataModel.find({});
        });
        drawingService.deleteDrawing(MOCK_DRAWING.id).then((result) => {
            chai.expect(databaseService.localDatabaseService.deleteDrawing).to.have.been.called;
            done();
        });
    });

    it ('deleteDrawing(): should throw an error if request for metadatas fails', async () => {
        chai.use(chaiAspromised);
        chai.expect(drawingService.deleteDrawing(MOCK_DRAWING.id)).to.eventually.be.rejectedWith(Error);
    });
});
