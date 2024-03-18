import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

import { authenticateLogger as log } from '../../server/winston';
import LogInAuthUser from './auth.interfaces';
import { BRCRYPT_SALT, JWT_TOKEN_EXPIRATION, SEQUILIZE_NEW } from '../../server/config';
import { initModels } from '../../models-auto/init-models';
import { jwtTokenSign } from '../../server/jwtToken';

const { users } = initModels(SEQUILIZE_NEW);

const postLogInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body as LogInAuthUser;
        const getUser = await users.findOne({
            where: {
                username,
            },
            raw: true,
        }).catch((err: ErrorEvent) => {
            log.error(`Error in users postLogInUser, error: ${err.message}`);
            throw new Error(`Error in users postLogInUser, error: ${err}`)
        });
        
        if (!getUser) {
            res.sendStatus(404);
            return;
        }

        const comparePassword = await compareSync(password!, getUser!.password!.trim());
        if (!comparePassword) {
            res.sendStatus(403);
            return;
        }
        res.status(200).send({
            id: getUser!.id,
            username: getUser!.username,
            jwtToken: await jwtTokenSign(getUser!.id),
            expiresIn: JWT_TOKEN_EXPIRATION,
        });
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const postRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body as LogInAuthUser;
        const salt = await genSaltSync(BRCRYPT_SALT);
        const hashPassword = await hashSync(password, salt);
        const checkUser = await users.findOne({
            where: {
                username,
            },
            raw: true,
        }).catch((err: ErrorEvent) => {
            log.error(`Error in users postRegister, error: ${err.message}`);
            throw new Error(`Error in users postRegister, error: ${err}`)
        });

        if (!checkUser) {
            res.sendStatus(303);
            return;
        }
        const createUser = await users.create({
            id: randomUUID(),
            username,
            password: hashPassword,
        },
            {
                raw: true
            }).catch((err: ErrorEvent) => {
                log.error(`Error in users postRegister, error: ${err.message}`);
                throw new Error(`Error in users postRegister, error: ${err}`)
            });

        if (Object.entries(createUser.toJSON()).length === 0) {
            res.sendStatus(422);
            return;
        }
        res.status(201).send(createUser.isNewRecord);
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

export {
    postLogInUser,
    postRegister,
}