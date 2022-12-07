"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const config_1 = require("./config");
/* Models Query */
const Sequelize = require('Sequelize');
exports.sequelize = new Sequelize(config_1.dbName, config_1.dbUser, config_1.dbPassword, {
    host: config_1.dbHost,
    dialect: config_1.dbDialect,
    timezone: config_1.dbTimeZone
});
