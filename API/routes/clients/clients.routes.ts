import express from "express";

import { jwtTokenVerify } from '../../server/jwtToken';
import { 
    deleteClient,
    getDebtor,
    getDebtorsAll,
    postDebtor,
    putClient,
} from "./clients.controllers";

class ClientsRouter {
    public router = express.Router();

    constructor() {
        this.router.get('/debtorsall', jwtTokenVerify, getDebtorsAll);

        this.router.post('/debtor', jwtTokenVerify, postDebtor);

        this.router.get('/debtor', jwtTokenVerify, getDebtor);

        this.router.put('/debtor', jwtTokenVerify, putClient);

        this.router.delete('/debtor', jwtTokenVerify, deleteClient);
    }
}

export default new ClientsRouter().router;