import { Container } from 'inversify';
import { Application } from '../server/app';
import { Server } from '../server/server';
import { DatabaseService } from '@app/services/database.service';
import { DatabaseController } from '@app/controllers/database.controller';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
    container.bind<DatabaseController>(TYPES.DatabaseController).to(DatabaseController);
    return container;
};
