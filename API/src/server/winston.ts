import { createLogger, transports, format } from 'winston';

const authenticateLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'authenticateLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const appLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'appLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const bookingLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'bookingLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const configLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'configLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const clientsLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'clientsLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const errorHandlerLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'errorHandlerLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const jwtTokenLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'jwtTokenLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const nodemailerLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'nodemailerLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const serverLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'serverLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

const swaggerLogger = createLogger({
  transports: [
    new transports.File({
      dirname: 'logs',
      filename: 'swaggerLogger.log',
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message, service }) =>
        `[${timestamp}] ${service} ${level}: ${message}`
    )
  ),
  defaultMeta: {
    service: 'WinstonExample',
  },
});

export {
  authenticateLogger,
  appLogger,
  bookingLogger,
  configLogger,
  clientsLogger,
  errorHandlerLogger,
  jwtTokenLogger,
  nodemailerLogger,
  serverLogger,
  swaggerLogger,
};
