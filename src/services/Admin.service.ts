import { DBconnect } from '../util/dbconnect'
let sql: string;

export class AdminService extends DBconnect {
    constructor() {
        super()
    }

    queryHutByZoneId = async(zoneId: number) => {
        sql = `SELECT hut.*,hut_status.id as statusId,hut_status.title as statusTitle,hut_status.color as statusColor 
                FROM hut INNER JOIN hut_status ON hut.status_code = hut_status.id 
                WHERE hut.zone_id = ? ORDER BY hut_priority ASC`
        return this.findAll(sql, [zoneId]);
    }

    queryHutAll = async () =>{
        sql = `SELECT hut.*,zone.zone_title as zoneName, hut_status.id as statusId,hut_status.title as statusTitle,hut_status.color as statusColor 
                FROM hut 
                INNER JOIN hut_status ON hut.status_code = hut_status.id 
                INNER JOIN zone ON zone.id = hut.zone_id 
                ORDER BY hut_priority ASC`
        return this.findAll(sql, []);
    }
     
    queryHutById = async (id: number) =>{
        sql = `SELECT hut.*,zone.zone_title as zoneName, hut_status.id as statusId,hut_status.title as statusTitle,hut_status.color as statusColor 
                FROM hut 
                INNER JOIN hut_status ON hut.status_code = hut_status.id 
                INNER JOIN zone ON zone.id = hut.zone_id 
                WHERE hut.id = ?
                ORDER BY hut_priority ASC` 
        return this.findOne(sql, [id]);
    }

    queryDashboardUpdated = async (date: string, afterDate: string, limit: number = 0) => {
        let limits = (limit > 0)? " LIMIT 0,"+limit : ""; 
        sql = `SELECT *, admin_logs.created_at as dateTime FROM admin_logs 
                LEFT JOIN zone ON admin_logs.zone = zone.id
                LEFT JOIN hut_status ON admin_logs.status = hut_status.id
                WHERE  admin_logs.created_at BETWEEN ? AND ? ORDER BY dateTime DESC ${limits} `
        return this.findAll(sql, [date,afterDate])
    }

    queryHutStatus = async (date: string, afterDate: string) => {
        sql = `SELECT hut_status.title,hut_status.color, count(hut.id) as amount , hut.*
               FROM hut_status LEFT JOIN hut ON hut_status.id = hut.status_code GROUP BY hut_status.id;`
        return this.findAll(sql, [date,afterDate])
    }
    
    queryReportByHutAction = async (filter: any) =>{
        let filterHut = (filter.hut)?` AND admin_logs.hut_id = ${filter.hut}   `:"";
        let filterZone = (filter.zone)?` AND admin_logs.zone = ${filter.zone} `:"";
        let filterStaus = (filter.status)?` AND admin_logs.status = ${filter.status} `:"";
        let filterBegin = (filter.beginDate)?` AND admin_logs.created_at >= '${filter.beginDate}' ` :"";
        let filterEnd = (filter.endDate)?` AND admin_logs.created_at <=  '${filter.endDate}' `:"";
        sql = `SELECT admin_logs.*,zone.zone_type as zoneType,zone.zone_title as zoneName, 
                hut_status.id as statusId,
                hut_status.title as statusTitle,
                hut_status.color as statusColor 
                FROM hut 
                INNER JOIN admin_logs ON admin_logs.hut_id = hut.id
                INNER JOIN hut_status ON admin_logs.status = hut_status.id 
                INNER JOIN zone ON zone.id = hut.zone_id 
                WHERE admin_logs.id ${filterHut} ${filterZone} ${filterStaus} ${filterBegin} ${filterEnd}
                ORDER BY admin_logs.created_at DESC  ` 
                
        return this.findAll(sql, []);
    }

    queryBillReport = async (filter: any) => {
        let filterStaus = (filter.status)?`  admin_logs.status = ${filter.status} `:"";
        let filterHut = (filter.hut)?` AND  admin_logs.hut_id = ${filter.hut}   `:"";
        let filterZone = (filter.zone)?` AND admin_logs.zone = ${filter.zone} `:"";
        let filterBegin = (filter.beginDate)?` AND  admin_logs.created_at >= '${filter.beginDate}' ` :"";
        let filterEnd = (filter.endDate)?` AND admin_logs.created_at <=  '${filter.endDate}' `:"";
        sql = `SELECT admin_logs.*,zone.zone_type as zoneType,zone.zone_title as zoneName, 
                hut_status.id as statusId,
                hut_status.title as statusTitle,
                hut_status.color as statusColor,
                count(hut.order_code) as counts
                FROM hut 
                INNER JOIN admin_logs ON admin_logs.hut_id = hut.id
                INNER JOIN hut_status ON admin_logs.status = hut_status.id 
                INNER JOIN zone ON zone.id = hut.zone_id 
                WHERE ${filterStaus}  ${filterHut} ${filterZone} ${filterBegin} ${filterEnd}
                group by hut_id
                ORDER BY admin_logs.created_at DESC  `  
        return this.findAll(sql, []);
    }

    setFormReport = async (_data: any) => {
        const result:any = [];
        const checked:any = [];
        let ii = 0;
        for(let item of _data) {
            if(checked[`${item.order_code}`] > -1){
                let counting = result[checked[`${item.order_code}`]].length
                result[checked[`${item.order_code}`]][counting] = item
            } else {
                checked[`${item.order_code}`] = ii
                result[checked[`${item.order_code}`]] = Array();
                result[checked[`${item.order_code}`]][0] = item
                ii++
            } 
        }
        return result;
    }
}