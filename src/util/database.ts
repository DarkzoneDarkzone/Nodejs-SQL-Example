import { dbHost, dbName, dbUser, dbPassword, dbDialect, dbTimeZone } from './config';
/* Models Query */

const Sequelize = require('Sequelize');
export const sequelize = new Sequelize(dbName,dbUser,dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    timezone: dbTimeZone
});