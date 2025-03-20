/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { jwtTokenLogger as log } from './winston';
import { JWT_TOKEN_EXPIRATION, JWT_TOKEN_KEY } from './config';

interface TokenVerify {
    userID?: string;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            userID?: string,
        }
    }
}

const jwtTokenSign = async (userID: string): Promise<string> => {
    return sign({ userID }, JWT_TOKEN_KEY, { expiresIn: JWT_TOKEN_EXPIRATION });
}

const jwtTokenVerify = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const tokenVerify = verify(req.headers['x-authorization'] as string, JWT_TOKEN_KEY) as TokenVerify;
        req.userID = tokenVerify.userID;
        next();
    } catch (error) {
        log.error(`Error in jwtToken, jwtTokenVerify, error: ${error}`);
        next(error);
    }
}


export {
    jwtTokenSign,
    jwtTokenVerify,
}