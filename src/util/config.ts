/* Imports */
import dotenv from 'dotenv'
dotenv.config().parsed;
/* Functions */
const parseNumbers = (value: string) => +value; 

/* App */ 
const conServer = <string>process.env.WEBPORT;
const conSocket = <string>process.env.SOCKETPORT;
export const secretKey = process.env.WEBKEY
export const serverPort = parseNumbers(conServer)  
export const socketPort = parseNumbers(conSocket)

/* Database */
const dbport = <string>process.env.DBPORT;
export const dbHost = process.env.DBHOST
export const dbPort = parseNumbers(dbport)  
export const dbName = process.env.DBNAME
export const dbUser = process.env.DBUSER
export const dbPassword = process.env.DBPASSWORD
export const dbDialect = process.env.DIALECT
export const dbTimeZone = process.env.TIMEZONE

/* SMTP */
const SMTPPORT = <string>process.env.SMTPPORT;
export const smtpHost = process.env.SMTPHOST
export const smtpPort = parseNumbers(SMTPPORT)  
export const smtpUser = process.env.SMTPUSER
export const smtpPassword = process.env.SMTPPASSWORD
export const smtpEmail = process.env.SMTPEMAIL
export const smtpName = process.env.SMTPNAME

/* Line */
const lineConfigSet = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_TOKEN,
}
export const lineConfig = lineConfigSet
