import { DateTime } from 'luxon'; 

interface LogInAuthUser {
    username: string;
    password: string;
    jwtToken: string;
    expiresIn: number;
}

class User {
    constructor(
        public userName: string, 
        private _token: string,
        private _tokenExpirationDate: DateTime,
    ){}

    get token(): string | null {
        if (!this._tokenExpirationDate || DateTime.now() > this._tokenExpirationDate) {
            return null;
        }

        return this._token;
    }
}

export {
    LogInAuthUser,
    User,
};