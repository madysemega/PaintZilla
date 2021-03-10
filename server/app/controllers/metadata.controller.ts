import { Drawing } from '@common/models/drawing';
import { TYPES } from '@app/settings/types';
// import { HttpStatusCode } from '@common/communication/HttpStatusCode';
import { DatabaseService } from '@app/services/database.service';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
@injectable()
export class MetadataController {
    router: Router;
    constructor(@inject(TYPES.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
        this.router.get('/get-all', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllDrawings()
                .then((drawings: Drawing[]) => {
                    console.log('Here are your drawings: ');
                    for(const drawing of drawings) {
                        console.log(drawing.id);
                    }
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    return next(error);
                });
        });
    }
}
