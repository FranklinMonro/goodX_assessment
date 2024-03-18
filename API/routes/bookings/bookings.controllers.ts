import { Request, Response, NextFunction } from 'express';

import { bookingLogger as log } from '../../server/winston';
import { SEQUILIZE_NEW } from '../../server/config';
import { initModels } from '../../models-auto/init-models';
import { BookingClient, BookingClientAttribute } from './bookings.interfaces';

const { clients } = initModels(SEQUILIZE_NEW);

const getBookingClientsAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        clients.hasOne(clients, { sourceKey: 'id', foreignKey: 'debtorID' });
        const allDebtors = await clients.findAll({
            attributes: [],
            include: [
                {
                    model: clients,
                    required: true,
                    attributes: ['id', 'name', 'main','debtorID']
                },
            ],
            where: {
                active: true,
                main: true,
            },
            raw: true,
        }).catch((err: ErrorEvent) => {
            log.error(`Error in bookings getDebtorsAll allDebtors, error: ${err.message}`);
            throw new Error(`Error in bookings getDebtorsAll allDebtors, error: ${err}`)
        });
        const bookingClients: BookingClient[] = []; 
        allDebtors.forEach((debtor: BookingClientAttribute) => {
            if (debtor['client.main']) {
                const indexMain = bookingClients.findIndex((bkClnt) => bkClnt.mainClient?.id === debtor['client.id']);
                if (indexMain === -1) {
                    bookingClients.push({
                        mainClient: {
                            id: debtor['client.id'],
                            name: debtor['client.name']
                        },
                        patientClients: [],
                    });
                }
            }

            if (!debtor['client.main']) { 
                const indexMain = bookingClients.findIndex((bkClnt) => bkClnt.mainClient?.id === debtor['client.debtorID']);
                if (indexMain !== -1) {
                    bookingClients[indexMain].patientClients?.push({
                        id: debtor['client.id'],
                        name: debtor['client.name'],
                    });
                }
            }
        });
        res.status(200).send(bookingClients);
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};

const getBookingsAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

const postBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log(req.body);
        // const data: 
        // const allDebtors = await clients.findAll({
        //     where: {
        //         active: true,
        //         main: true,
        //     },
        // }).catch((err: ErrorEvent) => {
        //     log.error(`Error in clients getDebtorsAll allDebtors, error: ${err.message}`);
        //     throw new Error(`Error in clients getDebtorsAll allDebtors, error: ${err}`)
        // });;

        // res.status(200).send(allDebtors);
        res.status(201);
    } catch (error) {
        log.log('error', `URL ${req.baseUrl}, error: ${error}`);
        next(error);
    }
};


const getBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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


const putBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

const deleteBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export {
    getBookingClientsAll,
    getBookingsAll,
    postBooking,
    getBooking,
    putBooking,
    deleteBooking,
}

