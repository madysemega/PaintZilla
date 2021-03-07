import { Container } from 'inversify';
import 'reflect-metadata';
import { Server } from './server/server';
import { containerBootstrapper } from './settings/inversify.config';
import { TYPES } from './settings/types';

void (async () => {
    const container: Container = await containerBootstrapper();
    const server: Server = container.get<Server>(TYPES.Server);

    await server.init();
})();
