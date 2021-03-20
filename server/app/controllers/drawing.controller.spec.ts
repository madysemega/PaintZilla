import 'reflect-metadata';
import * as mocha from 'mocha';
const supertest = require('supertest');
import { TYPES } from '@app/types';
import * as chai from 'chai';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Drawing } from '@common/models/drawing';
import { Application } from '@app/app';
import { DrawingService } from '@app/services/drawing/drawing.service';
import * as Constants from '@app/constants/drawing.service.spec.contants';
import { HttpStatusCode } from '@common/communication/HttpStatusCode';
export const MOCK_DRAWING = { name: Constants.DRAWING.name, drawing: Constants.DRAWING.drawing, labels: Constants.DRAWING.labels};
mocha.describe('Drawing controller', () => {
    let drawingService: Stubbed<DrawingService>;
    let app: Express.Application;

    beforeEach(async () => {
       const [container, sandbox] = await testingContainer();
       container.rebind(TYPES.DrawingService).toConstantValue({
           saveDrawing: sandbox.stub(),
           getAllDrawings: sandbox.stub(),
           getDrawingById: sandbox.stub(),
           getDrawingsByName: sandbox.stub(),
           getAllLabels: sandbox.stub(),
           getDrawingsByLabelsOne: sandbox.stub(),
           getDrawingsByLabelsAll: sandbox.stub(),
           updateDrawing: sandbox.stub(),
           updateDrawingName: sandbox.stub(),
           updateDrawingLabels: sandbox.stub(),
           updateDrawingContent: sandbox.stub(),
           deleteDrawing: sandbox.stub()
       });
       drawingService = container.get(TYPES.DrawingService);
       app = container.get<Application>(TYPES.Application).app;
    });

    it('POST api/drawings: should return Created status on successful post/api/drawings request', async () => {
        const expectedDrawing: Drawing = Constants.DRAWING;
        drawingService.saveDrawing.resolves(expectedDrawing);
        supertest(app).post('api/drawings').send(JSON.stringify(MOCK_DRAWING)).expect(HttpStatusCode.Created).then((drawing: Drawing) => {
            chai.expect(drawing).to.deep.equal(expectedDrawing);
        }).catch((error: Error) => {});
    });

    it('POST api/drawings: should return an error as a message on service fail', async () => {
        drawingService.saveDrawing.rejects(new Error(''));
        supertest(app).post('api/drawings').send(JSON.stringify(MOCK_DRAWING)).expect(HttpStatusCode.NotAcceptable);
    });

    it('GET api/drawings: should return Ok status on successful get/api/drawings request', async () => {
        drawingService.getAllDrawings.resolves([Constants.DRAWING]);
        supertest(app).get('api/drawings').expect(HttpStatusCode.Ok);
    });

    it('GET api/drawings: should return an error as a message on service fail', async () => {
        drawingService.getAllDrawings.rejects(new Error(''));
        supertest(app).get('api/drawings').expect(HttpStatusCode.NotFound);
    });

    it('GET api/drawings/labels: should return Ok status on successful get/api/drawings/labels request', async () => {
        drawingService.getAllLabels.resolves(['']);
        supertest(app).get('api/drawings/labels').expect(HttpStatusCode.Ok);
    });

    it('GET api/drawings/labels: should return an error as a message on service fail', async () => {
        drawingService.getAllLabels.rejects(new Error(''));
        supertest(app).get('api/drawings/labels').expect(HttpStatusCode.NotFound);
    });

    it('GET api/drawings/:id: should return Ok status on successful get/api/drawings/:id request', async () => {
        drawingService.getDrawingById.resolves(Constants.DRAWING);
        supertest(app).get('api/drawings/id').expect(HttpStatusCode.Ok);
    });

    it('GET api/drawings/:id: should return an error as a message on service fail', async () => {
        drawingService.getDrawingById.rejects(new Error(''));
        supertest(app).get('api/drawings/id').expect(HttpStatusCode.NotFound);
    });

    it('GET api/drawings/name/:name: should return Ok status on successful get/api/drawings/name/:name request', async () => {
        drawingService.getDrawingsByName.resolves([Constants.DRAWING]);
        supertest(app).get('api/drawings/name/name').expect(HttpStatusCode.Ok);
    });

    it('GET api/drawings/name/:name: should return an error as a message on service fail', async () => {
        drawingService.getDrawingsByName.rejects(new Error(''));
        supertest(app).get('api/drawings/name/name').expect(HttpStatusCode.NotFound);
    });

    it('GET api/drawings/labels/all-labels: should return Ok status on successful get/drawings/labels/all-labels request', async () => {
        drawingService.getDrawingsByLabelsAll.resolves([Constants.DRAWING]);
        supertest(app).get('api/drawings/labels/all-labels').expect(HttpStatusCode.Ok);
    });

    it('GET api/drawings/labels/all-labels: should return an error as a message on service fail', async () => {
        drawingService.getDrawingsByLabelsAll.rejects(new Error(''));
        supertest(app).get('api/drawings/labels/all-labels').expect(HttpStatusCode.NotFound);
    });

    it('GET api/drawings/labels/one-label: should return Ok status on successful get/drawings/labels/one-label request', async () => {
        drawingService.getDrawingsByLabelsOne.resolves([Constants.DRAWING]);
        supertest(app).get('api/drawings/labels/one-label').expect(HttpStatusCode.Ok);
    });

    it('GET api/drawings/labels/one-label: should return an error as a message on service fail', async () => {
        drawingService.getDrawingsByLabelsOne.rejects(new Error(''));
        supertest(app).get('api/drawings/labels/one-label').expect(HttpStatusCode.NotFound);
    });

    it('PUT api/drawings/:id: should return Ok status on successful put/api/drawings/:id request', async () => {
        drawingService.updateDrawing.resolves(Constants.DRAWING);
        supertest(app).put('api/drawings/id').send(JSON.stringify(Constants.DRAWING)).expect(HttpStatusCode.Ok);
    });

    it('PUT api/drawings/:id: should return an error as a message on service fail', async () => {
        drawingService.updateDrawing.rejects(new Error(''));
        supertest(app).put('api/drawings/id').expect(HttpStatusCode.NotModified);
    });

    it('PUT api/drawings/name/:id: should return Ok status on successful put/api/drawings/name/:id request', async () => {
        drawingService.updateDrawingName.resolves(Constants.DRAWING);
        supertest(app).put('api/drawings/name/id').send(Constants.DRAWING.name).expect(HttpStatusCode.Ok);
    });

    it('PUT api/drawings/name/:id: should return an error as a message on service fail', async () => {
        drawingService.updateDrawingName.rejects(new Error(''));
        supertest(app).put('api/drawings/name/id').send(Constants.DRAWING.name).expect(HttpStatusCode.NotModified);
    });

    it('PUT api/drawings/labels/:id: should return Ok status on successful put/api/drawings/labels/:id request', async () => {
        drawingService.updateDrawingLabels.resolves(Constants.DRAWING);
        supertest(app).put('api/drawings/labels/id').send([].toString()).expect(HttpStatusCode.Ok);
    });

    it('PUT api/drawings/labels/:id: should return an error as a message on service fail', async () => {
        drawingService.updateDrawingLabels.rejects(new Error(''));
        supertest(app).put('api/drawings/labels/id').send([].toString()).expect(HttpStatusCode.NotModified);
    });

    it('PUT api/drawings/content/:id: should return Ok status on successful put/api/drawings/content/:id request', async () => {
        drawingService.updateDrawingContent.resolves(Constants.DRAWING);
        supertest(app).put('api/drawings/content/id').send(Constants.DRAWING.drawing).expect(HttpStatusCode.Ok);
    });

    it('PUT api/drawings/content/:id: should return an error as a message on service fail', async () => {
        drawingService.updateDrawingContent.rejects(new Error(''));
        supertest(app).put('api/drawings/content/id').send(Constants.DRAWING.drawing).expect(HttpStatusCode.NotModified);
    });

    it('DELETE api/drawings/:id: should return Ok status on successful put/api/drawings/content/:id request', async () => {
        drawingService.deleteDrawing.resolves(Constants.DRAWING);
        supertest(app).delete('api/drawings/id').expect(HttpStatusCode.Ok);
    });

    it('DELETE api/drawings/:id: should return an error as a message on service fail', async () => {
        drawingService.deleteDrawing.rejects(new Error(''));
        supertest(app).delete('api/drawings/id').expect(HttpStatusCode.NotModified);
    });
});
