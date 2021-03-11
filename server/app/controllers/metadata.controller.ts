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
        this.router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .saveDrawing(req.body.name, req.body.drawing, req.body.labels)
                .then(() => {
                    res.status(HttpStatusCode.Created);
                })
                .catch((error) => {
                    return next(error);
                });
        });

        this.router.get('/get-all', async (req: Request, res: Response, next: NextFunction) => {
             this.drawingService
                .getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.json(drawings);
                })
                .catch((error: Error) => {
                    res.status(HttpStatusCode.NotFound).send(error.message);
                });
        });

        this.router.get('/get/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingById(req.body.id)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.get('/get/:name', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByName(req.body.name)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.get('/get-labels-all', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByLabelsAll(req.body.labels)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.get('/get-labels-one', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .getDrawingsByLabelsOne(req.body.labels)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawingName(req.body.id, req.body.name)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    next(error);
                });
        });

        this.router.put('/update-labels/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawingLabels(req.body.id, req.body.labels)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    next(error);
                });
        });

        this.router.put('/update-drawing/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .updateDrawing(req.body.id, req.body.name)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    next(error);
                });
        });

        this.router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.drawingService
                .deleteDrawing(req.body.id)
                .then((status: boolean) => {
                    if (status) {
                        res.status(HttpStatusCode.Ok);
                    } else {
                        res.status(HttpStatusCode.NotModified);
                    }
                })
                .catch((error) => {
                    next(error);
                });
        });
    }
}
