"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBconnect = void 0;
const config_1 = require("./config");
/* Manual Query */
const mysql = require("mysql2");
let dbconn = mysql.createConnection({
    connectionLimit: 10,
    host: config_1.dbHost,
    port: config_1.dbPort,
    database: config_1.dbName,
    user: config_1.dbUser,
    password: config_1.dbPassword
});
class DBconnect {
    constructor() {
        /* เช็คการเชื่อมต่อ Database สำเร็จหรือไม่ */
        this.isConnect = () => {
            dbconn.connect(function (err) {
                if (err) {
                    throw err;
                }
                console.log("Database connected!");
            });
        };
        /* ค้นหาข้อมูลแบบ single row */
        this.findOne = (sql, values = []) => {
            return new Promise((resolve, reject) => {
                dbconn.query(sql + " LIMIT 1 ", values, (err, result) => {
                    if (err)
                        return reject(err);
                    ;
                    return resolve(result[0]);
                });
            });
        };
        /* ค้นหาข้อมูลแบบ multiple row */
        this.findAll = (sql, values = []) => {
            return new Promise((resolve, reject) => {
                dbconn.query(sql, values, (err, result) => {
                    if (err)
                        return reject(err);
                    ;
                    return resolve(result);
                });
            });
        };
        /**
         * @param table = 'tableName'
         * @param columns = 'fieldA,fieldB,fileC'
         * @param values = ['value1','value2','value3']
         */
        this.onInsert = (table, columns, values) => {
            return new Promise((resolve, reject) => {
                dbconn.query(`INSERT INTO ${table} (${columns}) values ? `, values, (err, result, fields) => {
                    if (err)
                        return reject(err);
                    ;
                    return resolve(result);
                });
            });
        };
        /**
         * @param table = 'tableName'
         * @param columns = 'fieldA = :fieldA,fieldB = :fieldB, fileC = :fileC'
         * @param where = 'UserID = :UserID'
         * @param values = { fieldA: value1, fieldB: value2, fieldC: value 3 }
         */
        this.onUpdate = (table, columns, where, values) => {
            return new Promise((resolve, reject) => {
                dbconn.query(`UPDATE  ${table} SET ${columns} WHERE ${where} `, values, (err, result, fields) => {
                    if (err)
                        return reject(err);
                    ;
                    return resolve(result);
                });
            });
        };
        /**
         * @param table = 'tableName'
         * @param where = 'UserID = :UserID'
         * @param values = ['UserID']
         */
        this.onDelete = (table, where, values) => {
            return new Promise((resolve, reject) => {
                dbconn.query(`DELETE  FROM ${table} WHERE ${where} `, values, (err, result, fields) => {
                    if (err)
                        return reject(err);
                    ;
                    return resolve(result);
                });
            });
        };
    }
}
exports.DBconnect = DBconnect;
