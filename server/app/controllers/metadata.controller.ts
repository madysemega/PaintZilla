import { Router } from 'express';
import { injectable } from 'inversify';
@injectable()
export class MetadataController {
    router: Router;
    constructor() {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();
    }
}
