import { dbHost, dbPort, dbName, dbUser, dbPassword } from './config';
/* Manual Query */
const mysql = require("mysql2")
let dbconn: any = mysql.createConnection({
    connectionLimit: 10,
    host: dbHost,  
    port: dbPort, 
    database: dbName,
    user: dbUser,
    password: dbPassword 
});

export class DBconnect {
    /* เช็คการเชื่อมต่อ Database สำเร็จหรือไม่ */
    isConnect = () => {
        dbconn.connect(function(err: any) {
            if (err) {
                throw err;
            }
        });
    }

    /* ค้นหาข้อมูลแบบ single row */
    findOne = (sql: string, values: any = []) => {
        return new Promise((resolve, reject) => {
            dbconn.query(sql + " LIMIT 1 ", values, (err: any, result: any) => {
                if(err) return reject(err);
              ;
                return resolve(result[0])
            });
        });
    }

    /* ค้นหาข้อมูลแบบ multiple row */
    findAll = (sql: string, values: any = []) => {
        return new Promise((resolve, reject) => {
            dbconn.query(sql, values, (err: any, result: any) => {
                if(err) return reject(err);
              ;
                return resolve(result)
            });
        });
    }

    /**
     * @param table = 'tableName'
     * @param columns = 'fieldA,fieldB,fileC'
     * @param values = ['value1','value2','value3']
     */
    onInsert = ( table: string, columns: string, values: any) => { 
        return new Promise((resolve, reject) => {
            dbconn.query(`INSERT INTO ${table} (${columns}) values ? `, values, (err:any, result:any, fields:any) => {
                if(err) return reject(err);
              ;
                return resolve(result)
            });
        });
    }
    
    /**
     * @param table = 'tableName'
     * @param columns = 'fieldA = :fieldA,fieldB = :fieldB, fileC = :fileC'
     * @param where = 'UserID = :UserID'
     * @param values = { fieldA: value1, fieldB: value2, fieldC: value 3 }
     */
    onUpdate = ( table: string, columns: string, where: string, values: any ) => {
        return new Promise((resolve, reject) => {
            dbconn.query( `UPDATE  ${table} SET ${columns} WHERE ${where} `, values, (err:any, result:any, fields:any) => {
                if(err) return reject(err);
              ;
                return resolve(result)
            });
        });
    }

    /**
     * @param table = 'tableName'
     * @param where = 'UserID = :UserID'
     * @param values = ['UserID']
     */
    onDelete = (table: string, where: string, values: any ) => {
        return new Promise((resolve, reject) => {
            dbconn.query( `DELETE  FROM ${table} WHERE ${where} `, values, (err:any, result: any, fields:any) => {
                if(err) return reject(err);
              ;
                return resolve(result)
            });
        });
    }
}