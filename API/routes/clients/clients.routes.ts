import express from "express";

import { jwtTokenVerify } from '../../server/jwtToken';
import { 
    getDebtorsAll,
    postDebtor,
} from "./clients.controllers";

class ClientsRouter {
    public router = express.Router();

    constructor() {
        this.router.get('/debtorsall', jwtTokenVerify, getDebtorsAll);

        this.router.post('/debtor', jwtTokenVerify, postDebtor);
    }
}

export default new ClientsRouter().router;