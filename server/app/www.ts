import { Container } from 'inversify';
import 'reflect-metadata';
import { Server } from './server';
import { containerBootstrapper } from './inversify.config';
import { TYPES } from './types';

void (async () => {
    const container: Container = await containerBootstrapper();
    const server: Server = container.get<Server>(TYPES.Server);

    await server.init();
})();
