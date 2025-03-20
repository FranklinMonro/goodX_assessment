import express from "express";

import { jwtTokenVerify } from '../../server/jwtToken';
import { 
    deleteBooking, 
    getBooking, 
    getBookingClientsAll, 
    getBookingsAll, 
    postBooking, 
    putBooking,
} from "./bookings.controllers";

class BookingsRouter {
    public router = express.Router();

    constructor() {
        this.router.get('/clientssall', jwtTokenVerify, getBookingClientsAll);

        this.router.get('/bookingsall', getBookingsAll);

        this.router.post('', jwtTokenVerify, postBooking);

        this.router.get('', jwtTokenVerify, getBooking);

        this.router.put('', jwtTokenVerify, putBooking);

        this.router.delete('', jwtTokenVerify, deleteBooking);
    }
}

export default new BookingsRouter().router;