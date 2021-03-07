import { MetadataController } from '@app/controllers/metadata.controller';
import { DatabaseService } from '@app/services/database.service';
import { Container } from 'inversify';
import { Application } from '../server/app';
import { Server } from '../server/server';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);
    container.bind<MetadataController>(TYPES.MetadataController).to(MetadataController);
    return container;
};
