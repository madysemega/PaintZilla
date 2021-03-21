import { TYPES } from '@app/types';
import { Drawing } from '@common/models/drawing';
import { Application } from '@app/app';
import { DrawingService } from '@app/services/drawing.service';
import * as Constants from '@app/constants/drawing.service.spec.contants';
import * as supertest from 'supertest';
import 'reflect-metadata';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { HttpStatusCode } from '@common/communication/HttpStatusCode';
export const MOCK_DRAWING = { name: Constants.DRAWING.name, drawing: Constants.DRAWING.drawing, labels: Constants.DRAWING.labels};
describe('Drawing controller', () => {
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
           deleteDrawing: sandbox.stub(),
       });
       drawingService = container.get(TYPES.DrawingService);
       app = container.get<Application>(TYPES.Application).app;
    });

    it('POST api/drawings: should return Created status on successful post/api/drawings request', async () => {
        const expectedDrawing: Drawing = Constants.DRAWING;
        drawingService.saveDrawing.resolves(expectedDrawing);
        return supertest(app)
            .post('/api/drawings')
            .send(JSON.stringify(MOCK_DRAWING))
            .expect(HttpStatusCode.Created).then(() => {}).catch((error: Error) => {
                console.log('Test failed, ' + error.message);
            });
    });

    it('POST api/drawings: should return an error as a message on service fail', async () => {
        drawingService.saveDrawing.rejects(new Error(''));
        return supertest(app).post('/api/drawings').send(JSON.stringify(MOCK_DRAWING)).expect(HttpStatusCode.NotAcceptable).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings: should return Ok status on successful get/api/drawings request', async () => {
        drawingService.getAllDrawings.resolves([Constants.DRAWING]);
        return supertest(app).get('/api/drawings').expect(HttpStatusCode.Ok).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings: should return an error as a message on service fail', async () => {
        drawingService.getAllDrawings.rejects(new Error(''));
        return supertest(app).get('/api/drawings').expect(HttpStatusCode.NotFound).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/labels: should return Ok status on successful get/api/drawings/labels request', async () => {
        drawingService.getAllLabels.resolves(['']);
        return supertest(app).get('/api/drawings/labels').expect(HttpStatusCode.Ok).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/labels: should return an error as a message on service fail', async () => {
        drawingService.getAllLabels.rejects(new Error(''));
        return supertest(app).get('/api/drawings/labels').expect(HttpStatusCode.NotFound).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/:id: should return Ok status on successful get/api/drawings/:id request', async () => {
        drawingService.getDrawingById.resolves(Constants.DRAWING);
        return supertest(app).get('/api/drawings/id').expect(HttpStatusCode.Ok).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/:id: should return an error as a message on service fail', async () => {
        drawingService.getDrawingById.rejects(new Error(''));
        return supertest(app).get('/api/drawings/id').expect(HttpStatusCode.NotFound).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/name/:name: should return Ok status on successful get/api/drawings/name/:name request', async () => {
        drawingService.getDrawingsByName.resolves([Constants.DRAWING]);
        return supertest(app).get('/api/drawings/name/name').expect(HttpStatusCode.Ok).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/name/:name: should return an error as a message on service fail', async () => {
        drawingService.getDrawingsByName.rejects(new Error(''));
        return supertest(app).get('/api/drawings/name/name').expect(HttpStatusCode.NotFound).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/labels/all-labels: should return Ok status on successful get/drawings/labels/all-labels request', async () => {
        drawingService.getDrawingsByLabelsAll.resolves([Constants.DRAWING]);
        return supertest(app).get('/api/drawings/labels/all-labels').query({ drawing: 'lab1, lab2' }).expect(HttpStatusCode.Ok).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/labels/all-labels: should return an error as a message on service fail', async () => {
        drawingService.getDrawingsByLabelsAll.rejects(new Error(''));
        return supertest(app).get('/api/drawings/labels/all-labels').query({ drawing: 'lab1, lab2' }).expect(HttpStatusCode.NotFound).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/labels/one-label: should return Ok status on successful get/drawings/labels/one-label request', async () => {
        drawingService.getDrawingsByLabelsOne.resolves([Constants.DRAWING]);
        return supertest(app).get('/api/drawings/labels/one-label').query({ drawing: 'lab1, lab2' }).expect(HttpStatusCode.Ok).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('GET api/drawings/labels/one-label: should return an error as a message on service fail', async () => {
        drawingService.getDrawingsByLabelsOne.rejects(new Error(''));
        return supertest(app).get('/api/drawings/labels/one-label').query({ drawing: 'lab1, lab2' }).expect(HttpStatusCode.NotFound).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('PUT api/drawings/:id: should return Ok status on successful put/api/drawings/:id request', async () => {
        drawingService.updateDrawing.resolves(Constants.DRAWING);
        return supertest(app).put('/api/drawings/id').send(JSON.stringify(Constants.DRAWING)).expect(HttpStatusCode.Ok).catch((error: Error) => {
            console.log('Test failed, ' + error.message);
        });
    });

    it('PUT api/drawings/:id: should return an error as a message on service fail', async () => {
        drawingService.updateDrawing.rejects(new Error(''));
        return supertest(app).put('/api/drawings/id').expect(HttpStatusCode.NotModified).catch((error: Error) => {
                console.log('Test failed, ' + error.message);
            });
    });

    it('PUT api/drawings/name/:id: should return Ok status on successful put/api/drawings/name/:id request', async () => {
        drawingService.updateDrawingName.resolves(Constants.DRAWING);
        return supertest(app).put('/api/drawings/name/id').send(Constants.DRAWING.name).expect(HttpStatusCode.Ok).catch((error: Error) => {
                console.log('Test failed, ' + error.message);
            });
    });

    it('PUT api/drawings/name/:id: should return an error as a message on service fail', async () => {
        drawingService.updateDrawingName.rejects(new Error(''));
        return supertest(app).put('/api/drawings/name/id').send(Constants.DRAWING.name).expect(HttpStatusCode.NotModified).catch((error: Error) => {
                console.log('Test failed, ' + error.message);
            });
    });

    it('PUT api/drawings/labels/:id: should return Ok status on successful put/api/drawings/labels/:id request', async () => {
        drawingService.updateDrawingLabels.resolves(Constants.DRAWING);
        return supertest(app).put('/api/drawings/labels/id')
            .set({
            'Content-Type': 'text/plain',
            Accept: '*/*',
            'Cache-Control': 'no-cache',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Length': Buffer.byteLength('lab1, lab2'),
            Connection: 'keep-alive',
        }).send('lab1, lab2').expect(HttpStatusCode.Ok).catch((error: Error) => {
                console.log('Test failed, ' + error.message);
            });
    });

    it('PUT api/drawings/labels/:id: should return an error as a message on service fail', async () => {
        drawingService.updateDrawingLabels.rejects(new Error(''));
        return supertest(app).put('/api/drawings/labels/id')
        .set({
                'Content-Type': 'text/plain',
                Accept: '*/*',
                'Cache-Control': 'no-cache',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Length': Buffer.byteLength('lab1, lab2'),
                Connection: 'keep-alive',
            })
            .send('lab1, lab2').expect(HttpStatusCode.NotModified).catch((error: Error) => {
                console.log('Test failed, ' + error.message);
            });
    });

    it('PUT api/drawings/content/:id: should return Ok status on successful put/api/drawings/content/:id request', async () => {
        drawingService.updateDrawingContent.resolves(Constants.DRAWING);
        return supertest(app).put('/api/drawings/content/id').send(Constants.DRAWING.drawing).expect(HttpStatusCode.Ok).catch((error: Error) => {
                console.log('Test failed, ' + error.message);
            });
    });

    it('PUT api/drawings/content/:id: should return an error as a message on service fail', async () => {
        drawingService.updateDrawingContent.rejects(new Error(''));
        return supertest(app).put('/api/drawings/content/id').send(Constants.DRAWING.drawing).expect(HttpStatusCode.NotModified).catch((error: Error) => {
                console.log('Test failed, ' + error.message);
            });
    });

    it('DELETE api/drawings/:id: should return Ok status on successful put/api/drawings/content/:id request', async () => {
        drawingService.deleteDrawing.resolves();
        return supertest(app).delete('/api/drawings/id').expect(HttpStatusCode.Ok).catch((error: Error) => {
                    console.log('Test failed, ' + error.message);
                });
    });

    it('DELETE api/drawings/:id: should return an error as a message on service fail', async () => {
        drawingService.deleteDrawing.rejects(new Error(''));
        return supertest(app).delete('/api/drawings/id').expect(HttpStatusCode.NotModified).catch((error: Error) => {
                    console.log('Test failed, ' + error.message);
                });
    });
});
