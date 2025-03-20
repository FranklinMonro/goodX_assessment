/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorHandlerLogger as log } from './winston';

class ErrorMessage {
  fileName!: string;

  line!: string;

  message!: string | Error;

  statusCode?: number;
}

const createErrorMessage = (err: Error): ErrorMessage => {
  const split = err!.stack!.split('\n');
  const splitAll = split
    .map((all) => {
      if (all.includes('.ts') && all.includes(':')) {
        return all;
      }
      return null;
    })
    .filter((notNull) => notNull)[0];
  const splitNext = splitAll!
    .split('/')
    .map((next: any) => {
      if (next.includes('.ts') || next.includes(':')) {
        return next;
      }
      return null;
    })
    .filter((notNull) => notNull);
  const splitError = splitNext[0];
  const splitOnCollon =
    splitError !== undefined ? splitError!.split(':') : 'splitError';
  if (splitOnCollon === undefined && splitOnCollon === 'splitError') {
    console.log('createErrorMessage: Error: ', err);
    log.log('error', `Error: ${err}`);
    return {
      fileName: 'Error in error stack',
      line: '0',
      message: err!,
      statusCode: 403,
    };
  }
  const fileName = splitOnCollon[0];
  const line = splitOnCollon[1];
  console.log(
    `createErrorMessage: Error in File: ${fileName} on line: ${line}, error: ${err}`
  );
  log.log(
    'error',
    `Error in File: ${fileName} on line: ${line}, error: ${err}`
  );
  return {
    fileName,
    line,
    message: err.message,
    statusCode: 403,
  };
};

export default createErrorMessage;
