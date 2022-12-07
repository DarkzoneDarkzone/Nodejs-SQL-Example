"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineConfig = exports.smtpName = exports.smtpEmail = exports.smtpPassword = exports.smtpUser = exports.smtpPort = exports.smtpHost = exports.dbTimeZone = exports.dbDialect = exports.dbPassword = exports.dbUser = exports.dbName = exports.dbPort = exports.dbHost = exports.socketPort = exports.serverPort = exports.secretKey = void 0;
/* Imports */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config().parsed;
/* Functions */
const parseNumbers = (value) => +value;
/* App */
const conServer = process.env.WEBPORT;
const conSocket = process.env.SOCKETPORT;
exports.secretKey = process.env.WEBKEY;
exports.serverPort = parseNumbers(conServer);
exports.socketPort = parseNumbers(conSocket);
/* Database */
const dbport = process.env.DBPORT;
exports.dbHost = process.env.DBHOST;
exports.dbPort = parseNumbers(dbport);
exports.dbName = process.env.DBNAME;
exports.dbUser = process.env.DBUSER;
exports.dbPassword = process.env.DBPASSWORD;
exports.dbDialect = process.env.DIALECT;
exports.dbTimeZone = process.env.TIMEZONE;
/* SMTP */
const SMTPPORT = process.env.SMTPPORT;
exports.smtpHost = process.env.SMTPHOST;
exports.smtpPort = parseNumbers(SMTPPORT);
exports.smtpUser = process.env.SMTPUSER;
exports.smtpPassword = process.env.SMTPPASSWORD;
exports.smtpEmail = process.env.SMTPEMAIL;
exports.smtpName = process.env.SMTPNAME;
/* Line */
const lineConfigSet = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_TOKEN,
};
exports.lineConfig = lineConfigSet;
