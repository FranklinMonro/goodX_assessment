import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

import { clientsLogger as log } from '../../server/winston';
import { Debtor, DebtorPatients } from './clients.interfaces';
import { SEQUILIZE_NEW } from '../../server/config';
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
        const { clientID } = req.query;

        const debtor = await clients.findOne({
            where: {
                id: clientID as string,
            },
            raw: true,
        }).catch((err: ErrorEvent) => {
            log.error(`Error in clients getDebtor, debtor, error: ${err.message}`);
            throw new Error(`Error in clients getDebtor, debtor, error: ${err}`)
        });

        const patients = await clients.findAll({
            where: {
                debtorID: clientID as string,
            },
            raw: true,
        }).catch((err: ErrorEvent) => {
            log.error(`Error in clients getDebtor, patients, error: ${err.message}`);
            throw new Error(`Error in clients getDebtor, patients, error: ${err}`)
        });

        const debtorSend: Debtor = {};
        debtorSend.id = debtor?.id;
        debtorSend.debtor = debtor?.debtor.trim();
        debtorSend.telephone = debtor?.telephone;
        debtorSend.patients = patients.map((pat) => {
            return {
                id: pat.id,
                name: pat.name!.trim(),
                main: pat.main,
                relationship: pat.relationship!.trim(),
            };
        });

        res.status(201).send(debtorSend);
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const putClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { patients } = req.body as Debtor;
        const mainPatient = patients?.filter((pat) => pat.main)[0] as Debtor;
        patients?.forEach(async (pat) => {
            console.log(pat);
            await clients.update({
                name: pat.name,
                main: pat.main,
                relationship: pat.relationship,
                debtorID: mainPatient.id,
                debtor: mainPatient.debtor,
            }, {
                where: {
                    id: pat.id,
                },
            }).catch((err: ErrorEvent) => {
                log.error(`Error in clients putClient, error: ${err.message}`);
                throw new Error(`Error in clients putClient, error: ${err}`)
            });
        });
        res.status(201);
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const deleteClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { clientID } = req.query;
        const makeInActive = await clients.update({ active: false }, {
            where: {
                id: clientID as string,
            },
        });
        if (makeInActive[0] === 0) {
            res.status(404);
        }
        res.status(202).send(makeInActive[0]);
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

export {
    getDebtorsAll,
    postDebtor,
    getDebtor,
    putClient,
    deleteClient,
}