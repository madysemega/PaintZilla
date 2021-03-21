import { DrawingController } from '@app/controllers/drawing.controller';
import { DatabaseService } from '@app/services/database.service';
import { DrawingService } from '@app/services/drawing.service';
import { LocalDatabaseService } from '@app/services/local.database.service';
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { TYPES } from './types';
import 'reflect-metadata';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
    container.bind<DrawingService>(TYPES.DrawingService).to(DrawingService);
    container.bind<LocalDatabaseService>(TYPES.LocalDatabaseService).to(LocalDatabaseService);
    container.bind<DrawingController>(TYPES.DrawingController).to(DrawingController);
    return container;
};
