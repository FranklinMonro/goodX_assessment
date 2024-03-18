import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

import { clientsLogger as log } from '../../server/winston';
import { Debtor, DebtorPatients } from './clients.interfaces';
import {  SEQUILIZE_NEW } from '../../server/config';
import { initModels } from '../../models-auto/init-models';

const { clients } = initModels(SEQUILIZE_NEW);

const getDebtorsAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const allDebtors = await clients.findAll({
            where: {
                active: true,
                main: true,
            },
        }).catch((err: ErrorEvent) => {
            log.error(`Error in clients getDebtorsAll allDebtors, error: ${err.message}`);
            throw new Error(`Error in clients getDebtorsAll allDebtors, error: ${err}`)
        });;

        res.status(200).send(allDebtors);
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const postDebtor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            debtor = '',
            telephone = 0,
            patients,
        } = req.body as Debtor;
        const mainDebtor: DebtorPatients = patients!.filter((ele) => ele.name === undefined)![0];
        const patientsFilter: DebtorPatients[] = patients!
            .map((ele) => (ele.name !== undefined && ele.name !== '' ? ele : {}))
            .filter((obj) => Object.entries(obj).length > 0)!;
        const debtorUUID = randomUUID()
        const createDebtor = await clients.create(
            {
                id: debtorUUID,
                debtor,
                telephone,
                debtorID: debtorUUID,
                name: debtor,
                main: true,
                relationship: mainDebtor.relationship,
                active: true,
            },  
            {
                raw: true,
        }).catch((err: ErrorEvent) => {
            log.error(`Error in clients postDebtor createDebtor, error: ${err.message}`);
            throw new Error(`Error in clients postDebtor createDebtor, error: ${err}`)
        });
        
        if (Object.entries(createDebtor.toJSON()).length === 0) {
            res.sendStatus(422);
            return;
        }

        patientsFilter.forEach(async (pat) => {
            await clients.create(
                {
                    id: randomUUID(),
                    debtor,
                    telephone,
                    debtorID: debtorUUID,
                    name: pat.name,
                    main: false,
                    relationship: pat.relationship,
                    active: true,
                },  
                {
                    raw: true,
            }).catch((err: ErrorEvent) => {
                log.error(`Error in clients postDebtor create patient, error: ${err.message}`);
                throw new Error(`Error in clients postDebtor create patient, error: ${err}`)
            });
        });

        res.status(201).send(createDebtor.isNewRecord);
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const getDebtor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const putDebtor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const deleteDebtor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const putPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const deletePatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

export {
    getDebtorsAll,
    postDebtor,
    getDebtor,
    putDebtor,
    deleteDebtor,
    putPatient,
    deletePatient,
}