import { DrawingService } from '@app/services/drawing/drawing.service';
import { TYPES } from '@app/settings/types';
import { HttpStatusCode } from '@common/communication/HttpStatusCode';
import { Drawing } from '@common/models/drawing';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import * as Parser from 'body-parser';
@injectable()
export class DrawingController {
    router: Router;
    constructor(@inject(TYPES.DrawingService) private drawingService: DrawingService) {
        this.router = Router();
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router.post('/drawings', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .saveDrawing(req.body.name, req.body.drawing, req.body.labels)
                .then((drawing: Drawing) => {
                    res.status(HttpStatusCode.Created).send(drawing);
                })
                .catch((error) => {
                    res.status(HttpStatusCode.NotAcceptable).send('An error occurred while saving the drawing... ' + error.message);
                });
        });

        this.router.get('/drawings', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.status(HttpStatusCode.Ok).send(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occurred while trying to get drawings ' + error.message);
                });
        });

        this.router.get('/drawings/labels', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getAllLabels()
                .then((labels: string[]) => {
                    res.status(HttpStatusCode.Ok).send(labels);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occurred while trying to get labels ' + error.message);
                });
        });

        this.router.get('/drawings/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingById(req.params.id)
                .then((drawing: Drawing) => {
                    res.status(HttpStatusCode.Ok).send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occurred while trying to get drawings ' + error.message);
                });
        });

        this.router.get('/drawings/name/:name', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByName(req.params.name)
                .then((drawings: Drawing[]) => {
                    res.status(HttpStatusCode.Ok).send(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occurred while trying to get drawings ' + error.message);
                });
        });

        this.router.get('/drawings/labels/all-labels/', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByLabelsAll(req.query.drawing.split(','))
                .then((drawings: Drawing[]) => {
                    res.status(HttpStatusCode.Ok).send(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occurred while trying to get drawings, ' + error.message);
                });
        });

        this.router.get('/drawings/labels/one-label', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByLabelsOne(req.query.drawing.split(','))
                .then((drawings: Drawing[]) => {
                    res.status(HttpStatusCode.Ok).send(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occurred while trying to get drawings ' + error.message);
                });
        });

        this.router.put('/drawings/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawing(req.params.id, req.body)
                .then((drawing: Drawing) => {
                    res.status(HttpStatusCode.Ok).send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occurred while trying to update drawing ' + error.message);
                });
        });

        this.router.use(Parser.text());

        this.router.put('/drawings/name/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawingName(req.params.id, req.body)
                .then((drawing: Drawing) => {
                    res.status(HttpStatusCode.Ok).send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occurred while trying to update drawing ' + error.message);
                });
        });

        this.router.put('/drawings/labels/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawingLabels(req.params.id, req.body.split(','))
                .then((drawing: Drawing) => {
                    res.status(HttpStatusCode.Ok).send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occurred while trying to update drawing ' + error.message);
                });
        });

        this.router.put('/drawings/content/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawingContent(req.params.id, req.body)
                .then((drawing: Drawing) => {
                    res.status(HttpStatusCode.Ok).send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occurred while trying to update drawing ' + error.message);
                });
        });

        this.router.delete('/drawings/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .deleteDrawing(req.params.id)
                .then(() => {
                    res.status(HttpStatusCode.Ok).sendStatus(HttpStatusCode.Ok);
                })
                .catch((error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occurred while trying to delete drawing ' + error.message);
                });
        });
    }
}
