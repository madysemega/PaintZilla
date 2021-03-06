import { Container } from 'inversify';
import 'reflect-metadata';
import { Server } from '../server/server';
import { containerBootstrapper } from './inversify.config';
import { TYPES } from './types';

void (async () => {
    const container: Container = await containerBootstrapper();
    const server: Server = container.get<Server>(TYPES.Server);

    server.init();
})();
