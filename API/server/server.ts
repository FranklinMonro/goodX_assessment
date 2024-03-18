import debug from 'debug';
import { createServer } from 'http';

import { serverLogger as log } from './winston';
import App from './app';
import { HOST, PORT } from './config';

const server = createServer(App);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onError = (error: any): void => {
    const addr = server.address();
    if (error.syscall !== 'listen') {
        log.log('error', `Error in onError not listen server, error: ${error}`);
        throw error;
    }
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${PORT}`;
    log.log('error', `${bind} On error error code: ${error.code}, error: ${error}`);
    switch (error.code) {
        case 'EACCES':
            log.log('error', `${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.log('error', `${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${PORT}`;
    console.log(`Listening on ${bind}`);
    console.log(`Localhost: http://${HOST}:${PORT}`);
    console.log(`PGAdmin4 listening on:  http://${HOST}:5050`);
    debug(`Listening on ${bind}`);
};

server.on('error', onError);
server.on('listening', onListening);
server.listen(PORT, HOST);

export default server