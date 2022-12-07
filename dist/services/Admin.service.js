"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const dbconnect_1 = require("../util/dbconnect");
let sql;
class AdminService extends dbconnect_1.DBconnect {
    constructor() {
        super();
        this.queryHutByZoneId = (zoneId) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT hut.*,hut_status.id as statusId,hut_status.title as statusTitle,hut_status.color as statusColor 
                FROM hut INNER JOIN hut_status ON hut.status_code = hut_status.id 
                WHERE hut.zone_id = ? ORDER BY hut_priority ASC`;
            return this.findAll(sql, [zoneId]);
        });
        this.queryHutAll = () => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT hut.*,zone.zone_title as zoneName, hut_status.id as statusId,hut_status.title as statusTitle,hut_status.color as statusColor 
                FROM hut 
                INNER JOIN hut_status ON hut.status_code = hut_status.id 
                INNER JOIN zone ON zone.id = hut.zone_id 
                ORDER BY hut_priority ASC`;
            return this.findAll(sql, []);
        });
        this.queryHutById = (id) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT hut.*,zone.zone_title as zoneName, hut_status.id as statusId,hut_status.title as statusTitle,hut_status.color as statusColor 
                FROM hut 
                INNER JOIN hut_status ON hut.status_code = hut_status.id 
                INNER JOIN zone ON zone.id = hut.zone_id 
                WHERE hut.id = ?
                ORDER BY hut_priority ASC`;
            return this.findOne(sql, [id]);
        });
        this.queryDashboardUpdated = (date, afterDate, limit = 0) => __awaiter(this, void 0, void 0, function* () {
            let limits = (limit > 0) ? " LIMIT 0," + limit : "";
            sql = `SELECT *, admin_logs.created_at as dateTime FROM admin_logs 
                LEFT JOIN zone ON admin_logs.zone = zone.id
                LEFT JOIN hut_status ON admin_logs.status = hut_status.id
                WHERE  admin_logs.created_at BETWEEN ? AND ? ORDER BY dateTime DESC ${limits} `;
            return this.findAll(sql, [date, afterDate]);
        });
        this.queryHutStatus = (date, afterDate) => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT hut_status.title,hut_status.color, count(hut.id) as amount , hut.*
               FROM hut_status LEFT JOIN hut ON hut_status.id = hut.status_code GROUP BY hut_status.id;`;
            return this.findAll(sql, [date, afterDate]);
        });
        this.queryReportByHutAction = (filter) => __awaiter(this, void 0, void 0, function* () {
            let filterHut = (filter.hut) ? ` AND admin_logs.hut_id = ${filter.hut}   ` : "";
            let filterZone = (filter.zone) ? ` AND admin_logs.zone = ${filter.zone} ` : "";
            let filterStaus = (filter.status) ? ` AND admin_logs.status = ${filter.status} ` : "";
            let filterBegin = (filter.beginDate) ? ` AND admin_logs.created_at >= '${filter.beginDate}' ` : "";
            let filterEnd = (filter.endDate) ? ` AND admin_logs.created_at <=  '${filter.endDate}' ` : "";
            sql = `SELECT admin_logs.*,zone.zone_type as zoneType,zone.zone_title as zoneName, 
                hut_status.id as statusId,
                hut_status.title as statusTitle,
                hut_status.color as statusColor 
                FROM hut 
                INNER JOIN admin_logs ON admin_logs.hut_id = hut.id
                INNER JOIN hut_status ON admin_logs.status = hut_status.id 
                INNER JOIN zone ON zone.id = hut.zone_id 
                WHERE admin_logs.id ${filterHut} ${filterZone} ${filterStaus} ${filterBegin} ${filterEnd}
                ORDER BY admin_logs.created_at DESC  `;
            return this.findAll(sql, []);
        });
        this.setFormReport = (_data) => __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const checked = [];
            let ii = 0;
            for (let item of _data) {
                if (checked[`${item.order_code}`] > -1) {
                    let counting = result[checked[`${item.order_code}`]].length;
                    result[checked[`${item.order_code}`]][counting] = item;
                }
                else {
                    checked[`${item.order_code}`] = ii;
                    result[checked[`${item.order_code}`]] = Array();
                    result[checked[`${item.order_code}`]][0] = item;
                    ii++;
                }
            }
            return result;
        });
    }
}
exports.AdminService = AdminService;
