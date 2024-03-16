import express from "express";
import { postLogInUser, postRegister } from "./auth.controllers";

class AuthenticateRouter {
    public router = express.Router();

    constructor() {
        this.router.post("/login", postLogInUser);

        this.router.post("/register", postRegister);
    }
}

export default new AuthenticateRouter().router;
