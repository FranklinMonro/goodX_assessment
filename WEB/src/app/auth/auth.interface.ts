
interface LogInAuthUser {
    username: string;
    password: string;
}

class Auth {
    constructor(
        private _bearerToken: string,
    ){}

    get bearerToken(): string | null {
        if (!this._bearerToken) {
            return null;
        }

        return this.bearerToken;
    }
}

export {
    LogInAuthUser,
    Auth,
};