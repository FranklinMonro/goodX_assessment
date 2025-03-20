import { Pool } from 'pg';
import { Sequelize } from 'sequelize';
import dotenv from "dotenv"

import { configLogger as log } from './winston';
import { DateTime } from 'luxon';


dotenv.config()

const PORT = 3000;
const HOST = '0.0.0.0';

const PG_CONNECTION = {
    host: 'db', // host of db container'
    port: 5432, // 5432 is the default;
    database: 'postgres', // database name
    user: 'postgres', // database user name
    password: 'postgres', // database password
};

const SEQUILIZE_NEW = new Sequelize({
    host: PG_CONNECTION.host,
    dialect: 'postgres',
    port: PG_CONNECTION.port,
    database: PG_CONNECTION.database,
    username: PG_CONNECTION.user,
    password: PG_CONNECTION.password,
    benchmark: true,
    logging: false, // console.log, // false,
});

const POOL_PG = new Pool(PG_CONNECTION);

const connectToDB = async () => {
    try {
        await POOL_PG.connect();
        SEQUILIZE_NEW.authenticate();
        console.log('PostgresSQL connection made');
    } catch (err) {
        log.log('error', `Error in establish connection with DB error: ${err}`);
        console.log(err);
    }
};

connectToDB();

const JWT_TOKEN_KEY = 'fa54468c-3fbe-4d8f-9f8e-4fc4b9f1e19a';
const JWT_TOKEN_EXPIRATION = DateTime.now().plus({ day: 1 }).toMillis();

const BRCRYPT_SALT = 10;
export {
    PORT,
    HOST,
    SEQUILIZE_NEW,
    JWT_TOKEN_KEY,
    JWT_TOKEN_EXPIRATION,
    BRCRYPT_SALT,
};
