import { DrawingService } from '@app/services/drawing.service';
import { TYPES } from '@app/settings/types';
import { HttpStatusCode } from '@common/communication/HttpStatusCode';
import { Drawing } from '@common/models/drawing';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
@injectable()
export class MetadataController {
    router: Router;
    constructor(@inject(TYPES.DrawingService) private drawingService: DrawingService) {
        this.router = Router();
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router.post('/drawing', async (req: Request, res: Response, next: NextFunction) => {
           await this.drawingService
                .saveDrawing(req.body.name, req.body.drawing, req.body.labels)
                .then((drawing: Drawing) => {
                    res.status(HttpStatusCode.Created).send(drawing);
                })
                .catch((error) => {
                    res.status(HttpStatusCode.NotAcceptable).send('An error occurred while saving the drawing ' + error.message);
                });
        });

        this.router.get('/drawing', async (req: Request, res: Response, next: NextFunction) => {
             await this.drawingService
                .getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occured while trying to get drawings ' + error.message);
                });
        });

        this.router.get('/drawing/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingById(req.params.id)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occured while trying to get drawings ' + error.message);
                });
        });

        this.router.get('/drawing/name/:name', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByName(req.params.name)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occured while trying to get drawings ' + error.message);
                });
        });

        this.router.get('/drawing/labels/all-labels', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByLabelsAll(req.body.labels)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occured while trying to get drawings, ' + error.message);
                });
        });

        this.router.get('/drawing/labels/one-label', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByLabelsOne(req.body.labels)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send('An error occured while trying to get drawings ' + error.message);
                });
        });

        this.router.put('/drawing/name/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawingName(req.params.id, req.body.name)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occured while trying to update drawing ' + error.message);
                });
        });

        this.router.put('/drawing/labels/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawingLabels(req.params.id, req.body.labels)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occured while trying to update drawing ' + error.message);
                });
        });

        this.router.put('/drawing/content/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawing(req.params.id, req.body.drawing)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occured while trying to update drawing ' + error.message);
                });
        });

        this.router.delete('/drawing/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .deleteDrawing(req.params.id)
                .then((status: boolean) => {
                    res.status(HttpStatusCode.Ok).send(status);
                })
                .catch((error) => {
                    res.status(HttpStatusCode.NotModified).send('An error occurred while trying to delete drawing ' + error.message);
                });
        });
    }
}
