import { DatabaseService } from '@app/services/database.service';
import { TYPES } from '@app/settings/types';
import { HttpStatusCode } from '@common/communication/HttpStatusCode';
import { Drawing } from '@common/models/drawing';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
@injectable()
export class MetadataController {
    router: Router;
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.router = Router();
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .saveDrawing(req.body.name, req.body.drawing, req.body.labels)
                .then(() => {
                    res.status(HttpStatusCode.Created);
                })
                .catch((error) => {
                    return next(error);
                });
        });

        this.router.get('/get-all', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.get('/get/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .getDrawingById(req.body.id)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.get('/get/:name', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .getDrawingsByName(req.body.name)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.get('/get-labels-all', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .getDrawingsByLabelsAll(req.body.labels)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.get('/get-labels-one', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .getDrawingsByLabelsOne(req.body.labels)
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });

        this.router.put('/update/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .updateDrawingName(req.body.id, req.body.name)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    next(error);
                });
        });

        this.router.put('/update-labels/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .updateDrawingLabels(req.body.id, req.body.labels)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    next(error);
                });
        });

        this.router.put('/update-drawing/:id', async (req: Request, res: Response, next: NextFunction) => {
            await this.databaseService
                .updateDrawing(req.body.id, req.body.name)
                .then((drawing: Drawing) => {
                    res.send(drawing);
                })
                .catch((error: Error) => {
                    next(error);
                });
        });
    }
}
