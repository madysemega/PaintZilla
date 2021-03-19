import * as mocha from 'mocha';
// import { Metadata } from '@app/constants/metadata.schema';
import { DatabaseServiceMock } from '@app/mocks/database.service.mock';
import { DrawingService } from './drawing.service';
import * as spies from 'chai-spies';
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

    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        drawingService = new DrawingService(databaseService as any);
        chai.spy.on(Validator, 'checkAll', ValidatorMock.checkAll);
        chai.spy.on(Validator, 'checkId', ValidatorMock.checkId);
        chai.spy.on(Validator, 'checkName', ValidatorMock.checkName);
        chai.spy.on(Validator, 'checkDrawing', ValidatorMock.checkDrawing);
        chai.spy.on(Validator, 'checkLabels', ValidatorMock.checkLabels);
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it ('should create', (done) => {
        chai.spy.on(DrawingService, 'getDrawingById', () => {
            return MOCK_DRAWING;
        });
        drawingService.saveDrawing(MOCK_DRAWING.name, MOCK_DRAWING.drawing, MOCK_DRAWING.labels).then((result) => {
            chai.expect(result).to.equal(MOCK_DRAWING);
            done();
        }).catch((err) => {
            done(err);
        });
    });
});
