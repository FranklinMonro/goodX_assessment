import { json, urlencoded } from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';

import { appLogger as log, errorHandlerLogger as errorLog } from './winston';

import AuthenticateRouter from '../routes/auth/auth.routes';
import ClientsRouter from '../routes/clients/clients.routes';
import BookingsRouter from '../routes/bookings/bookings.routes';
class App {
    public httpServer = express();

    constructor() {
        this.httpServer.use(json({ limit: '500mb' }));

        this.httpServer.use(urlencoded({ extended: true, limit: '500mb' }));
        this.httpServer.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:4401');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Authorization, X-CSRFToken, X-Authorization',
            );
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, OPTIONS, DELETE');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });

        this.httpServer.set('trust proxy', true);

        this.httpServer.get('/', (req: Request, res: Response) => {
            console.log('Welcome to API');
            res.send('Welcome to API');
        });

        this.httpServer.use('/goodxapi/auth', AuthenticateRouter);

        this.httpServer.use('/goodxapi/clients', ClientsRouter);

        this.httpServer.use('/goodxapi/bookings', BookingsRouter);

        this.httpServer.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.log(`error in url ${req.originalUrl} - error: ${err}`);
            log.error(`error in url ${req.originalUrl} - error: ${err.message}`);
            errorLog.error(`error in url ${req.originalUrl} - error: ${err.message}`);
            res.send(err.message);
            next();
        });

        process.once('uncaughtException', (err: Error) => {
            console.log(err.name, err.message);
            console.log('UNCAUGHT EXCEPTION!  Shutting down...');
            log.log('error', `uncaughtException - Error name: ${err.name}, Error message: ${err.message}, UNCAUGHT EXCEPTION!  Shutting down...`);
            process.exit(1);
        });

        process.once('unhandledRejection', (reason: Error) => {
            console.log(reason.name, reason.message);
            console.log('UNHANDLED REJECTION! 💥 Shutting down...');
            log.log('error', `uncaughtException - Reason name: ${reason.name}, Reason message: ${reason.message}, UNHANDLED REJECTION!  Shutting down...`);
            process.exit(1);
        });
    }
}

export default new App().httpServer;