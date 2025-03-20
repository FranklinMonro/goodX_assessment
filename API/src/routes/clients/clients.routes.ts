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

        this.router.post('', jwtTokenVerify, postDebtor);

        this.router.get('', jwtTokenVerify, getDebtor);

        this.router.put('', jwtTokenVerify, putClient);

        this.router.delete('', jwtTokenVerify, deleteClient);
    }
}

export default new ClientsRouter().router;