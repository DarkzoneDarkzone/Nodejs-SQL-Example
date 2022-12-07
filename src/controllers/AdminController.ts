import { validationResult } from 'express-validator'
import { AdminService } from '../services/Admin.service'
import { Zones } from '../models/Zones'
import { Huts } from '../models/Huts'
import { Md5 } from 'ts-md5/dist/md5';
import moment from 'moment';
import 'moment/locale/th';
import { Op } from 'sequelize'

import { HutStatus } from '../models/HutStatus';
import { Employees } from '../models/Employees';
import { AdminLogs } from '../models/AdminLogs';
import { SIO } from '../util/Sockets';
import { createExcel , createBillExcel } from '../services/Report.service'
 
export class AdminController extends AdminService {

    OnGetDashboard = async (req: any, res: any) => {
        let date = moment().format('YYYY-MM-DD 06:00:00')
        let afterDate = moment(date).add(1, 'days').format('YYYY-MM-DD 06:00:00')

        try {
            const empAmount = await Employees.count();
            const actAmount = await AdminLogs.count({
                where: { created_at: { [Op.between]: [date, afterDate] } }
            });
            const hutAmount = await Huts.count();
            const zoneAmount = await Zones.count();

            const updatedLastest: any = await this.queryDashboardUpdated(date, afterDate, 15)
            const updatedList = updatedLastest.map((logs: any) => {
                return {
                    zone: logs.zone_title,
                    hut: logs.hut,
                    name: logs.employee_name,
                    statusColor: logs.color,
                    statusId: logs.status,
                    status: logs.title,
                    date: moment(logs.dateTime).format('LTS') + " น."
                }
            })

            const onStatus: any = await this.queryHutStatus(date, afterDate)
        
            let result = {
                employeeAmount: empAmount, // พนักงานทั้งหมดในระบบกี่คน
                actionAmount: actAmount, //ทำกิจกรรมไปแล้วทั้งหมดกี่ครั้ง
                hutAmount: hutAmount, // จำนวนซุ้มทั้งหมด
                zoneAmount: zoneAmount, // จำนวนโซนทั้งหมด
                updates: updatedList,
                status: onStatus
            }

            return res.json({
                status: true,
                message: "ok",
                data: result
            })

        } catch (error) {
            return res.json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnAdminClearHutStatus = async (req: any, res:any) => {
        
        try {
            let setValue = { status_code: 1, order_code: "" , employee_name: "", action_time: null }
            await Huts.update(setValue, {
                where: {
                    status_code: { [Op.gt]: 0 }
                }
            })
            return res.json({
                status: true,
                message: "ok",
                description:"Clearing successfully"
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description:"Something went wrong."
            })
        }
    }

    OnGetZoneList = async (req: any, res: any) => {
        const errors = validationResult(req.body)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessages: errors.array()
            })
        }
        try {
            const zoneCategory = await Zones.findAll({
                order: [['zone_priority', 'ASC']]
            });

            const zoneList = zoneCategory.map((zone: any) => {
                return {
                    id: zone.id,
                    code: zone.zone_code,
                    title: zone.zone_title,
                    description: zone.zone_description,
                    status: zone.zone_status,
                    priority: zone.zone_priority,
                    type: zone.zone_type,
                    color: zone.zone_color,
                };
            })

            return res.json({
                status: true,
                message: "ok",
                data: zoneList
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnGetEmployees = async (req: any, res: any) => {
        try {
            const finding = await Employees.findAll({ attributes: ['id', ['name', 'value']] });
            return res.json({
                status: true,
                message: 'ok',
                data: finding
            })

        } catch (error) {

            return res.status(500).json({
                status: false,
                message: 'error',
                description: "Something went wrong."
            })
        }
    }

    OnGetHuts = async (req: any, res: any) => {
        try {
            const getAllHuts = await this.queryHutAll();
            return res.json({
                message: 'ok',
                status: true,
                data: getAllHuts
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnGenerateOrderCode = async (req:any, res: any) => {
        try {
            let orderCode = Md5.hashStr("create-order" + moment().unix() )
            const finding = await Huts.findOne({ 
                where: { id: req.params.id }
            })
            finding.order_code = orderCode;
            await finding.save()

            return res.json({
                status: true,
                message: "ok",
                data: orderCode 
            })
        } catch (error){
            return res.status(500).json({
                status: false,
                message:'error',
                description:"Something went wrong."
            })

        }
    }

    OnGetHutById = async (req: any, res: any) => {
        try {
            const getAllHuts = await this.queryHutById(+req.params.id);
            return res.json({
                message: 'ok',
                status: true,
                data: getAllHuts
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnGetHutsByZone = async (req: any, res: any) => {
        const errors = validationResult(req.body)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessages: errors.array()
            })
        }
        let ZoneId: number = +req.params.id;
        try {

            const queryHuts: any = await this.queryHutByZoneId(ZoneId)
            const hutList = queryHuts.map((item: any) => {
                return {
                    id: item.id,
                    hutCode: item.hut_code,
                    name: item.name,
                    zoneId: item.zone_id,
                    orderCode: item.order_code,
                    priority: item.hut_priority,
                    receivedName: item.employee_name,
                    statusCode: item.status_code,
                    statusId: item.statusId,
                    statusName: item.statusName,
                    statusColor: item.statusColor,
                    time: item.action_time
                }
            })

            
            return res.json({
                status: true,
                message: "ok",
                data: hutList
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }


    OnGetStatus = async (req: any, res: any) => {

        try {
            const getStatus = await HutStatus.findAll()
            return res.json({
                status: true,
                message: "ok",
                data: getStatus
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnCreateZone = async (req: any, res: any) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessages: errors.array()
            })
        }

        try {

            const creatingHut = new Zones();
            creatingHut.zone_code = Md5.hashStr("zone-code" + moment().format('YYYYMMDDhmmss'))
            creatingHut.zone_title = req.body.title
            creatingHut.zone_description = req.body.desc
            creatingHut.zone_status = req.body.status
            creatingHut.zone_priority = req.body.priority
            creatingHut.zone_type = req.body.type
            creatingHut.zone_color = req.body.color
            await creatingHut.save()

            return res.json({
                status: true,
                message: "ok",
                description: "Creating hut successfully.",
            })
        } catch (error) {

            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }
    OnGetAllZone = async (req: any, res: any) => {
        try {
            const query = await Zones.findAll({ order: [['zone_priority', 'ASC']] })
            return res.json({
                status: true,
                message: "ok",
                data: query
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Some thing went wrong."
            })
        }
    }
    OnGetZoneById = async (req: any, res: any) => {
        try {
            const finding = await Zones.findOne({ where: { id: req.params.id } })

            return res.json({
                status: true,
                message: "ok",
                data: finding
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnUpdateZoneById = async (req: any, res: any) => {
        try {
            const finding = await Zones.findOne({ where: { id: req.params.id } })
            finding.zone_title = req.body.title
            finding.zone_description = req.body.desc
            finding.zone_status = req.body.status
            finding.zone_priority = req.body.priority
            finding.zone_type = req.body.type
            finding.zone_color = req.body.color
            await finding.save()

            return res.json({
                status: true,
                message: "ok",
                description: "Updated zone successfully."
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnDeleteByZoneId = async (req: any, res: any) => {
        try {

            const finding = await Zones.findOne({
                where: { id: req.params.id }
            })

            await finding.destroy()

            return res.json({
                status: true,
                message: "ok",
                description: "Deleted zone successfully."
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    ClearZoneById = async (req: any, res: any) => {
        try {
            /* ถ้า zone = ค่าว่างจะล้างทั้งหมด */
            let setValue = { status_code: 1, order_code: "" , employee_name: "", action_time: null }
            let whereElse = (req.query.zone > 0)? { where: { zone_id: req.query.zone } } : { where: {} }
            await Huts.update(setValue, whereElse)

            return res.json({
                status: true,
                message: "ok",
                description:"Clearing successfully"
            })
        } catch(error){
            console.log(error)
            return res.status(500).json({
                status: false,
                message:"error",
                description:"Something went wrong."
            })
        }
    }

    OnUpdateZone = async (req: any, res: any) => {
        const errors = validationResult(req.body)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessages: errors.array()
            })
        }
        try {
            const updating = await Zones.findOne({ where: { id: req.body.zoneId } })

            if (!updating) {
                return res.status(404).json({
                    status: false,
                    message: "error",
                    description: "Zone was not found."
                })
            }

            updating.title = req.body.title
            updating.desc = req.body.desc
            updating.statusCode = req.body.statusCode
            updating.priority = req.body.priority
            updating.type = req.body.type
            updating.color = req.body.color
            await updating.save()

            return res.json({
                status: true,
                message: 'ok',
                description: "Updated zone successfully."
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: "Something went wrong."
            })
        }
    }

    OnGetAllStatus = async (req: any, res: any) => {
        try {
            const finding = await HutStatus.findAll({ order: [['created_at', 'ASC']] })
            return res.json({
                status: true,
                message: "ok",
                data: finding
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: "Something went wrong."
            })
        }
    }
    OnGetStatusById = async (req: any, res: any) => {
        try {

            const finding = await HutStatus.findOne({
                where: { id: req.params.id }
            })
            return res.json({
                status: true,
                message: "ok",
                data: finding
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: "Something went wrong."
            })
        }
    }

    OnCreateStatus = async (req: any, res: any) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessages: errors.array()
            })
        }
        try {

            const creatingStatus = new HutStatus();
            creatingStatus.status_code = Md5.hashStr("status-code" + moment().format('YYYYMMDDhmmss'))
            creatingStatus.title = req.body.title
            creatingStatus.color = req.body.color
            creatingStatus.display = (req.body.status == 1) ? 1 : 0
            await creatingStatus.save()

            return res.json({
                status: true,
                message: "ok",
                description: "The status has been created."
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }
    OnUpdateStatus = async (req: any, res: any) => {
        try {

            const updating = await HutStatus.findOne({
                where: { id: req.params.id }
            })

            updating.title = req.body.title
            updating.color = req.body.color
            updating.display = (req.body.status == 1) ? 1 : 0
            await updating.save()

            return res.json({
                status: true,
                message: "ok",
                description: "Updated successfully."
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }
    OnDeleteStatus = async (req: any, res: any) => {
        try {
            const deleting = await HutStatus.findOne({
                where: { id: req.params.id }
            })
            await deleting.destroy()
            return res.json({
                status: true,
                message: "ok",
                description: " Deleted successfully/"
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnCreateHut = async (req: any, res: any) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessages: errors.array()
            })
        }
        try {

            const creatingHut = new Huts();
            creatingHut.hut_code = req.body.code
            creatingHut.name = req.body.name
            creatingHut.employee_name = req.body.employee
            creatingHut.status_code = (req.body.status == 1) ? 1 : 0
            creatingHut.hut_priority = req.body.priority
            creatingHut.action_time = moment().format('LTS')
            creatingHut.zone_id = req.body.zoneId
            await creatingHut.save()

            return res.json({
                status: true,
                message: "ok",
                description: "The hut has been created."
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnUpdateHut = async (req: any, res: any) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessages: errors.array()
            })
        }
        let _id: number = req.body.id;
        try {
            const updating = await Huts.findOne({ where: { id: _id } })
            if (!updating) {
                return res.status(404).json({
                    status: false,
                    message: "error",
                    description: "Hut not found."
                })
            }
            const status = await HutStatus.findOne({ where: { id: parseInt(req.body.status) } })
            if(!status){
                return res.status(404).json({
                    status: false,
                    message:"error",
                    description:"Status was not found."
                })
            }
            let orderCode = updating.order_code
            let actionMove = "";
            /* สถานะย้าย */
            if(req.body.move == 1){
                /* อัพเดทซุ้มที่ต้องการย้าย */
                const moving = await Huts.findOne({ where: { id: req.body.moveTo } })
                moving.order_code = orderCode
                moving.employee_name = updating.employee_name
                moving.status_code = updating.status_code
                moving.action_time = moment().format('LTS')
                await moving.save()

                actionMove = " ไปยัง " + moving.name

                /* อัพเดทซุ้มที่เลิกใช้ */
                updating.order_code = ""
                updating.employee_name = "";
                updating.status_code = 1
                updating.action_time = moment().format('LTS')
                await updating.save()

            } else {
                updating.employee_name = req.body.name
                updating.status_code = status.id
                updating.action_time = moment().format('LTS')

                if(req.body.success == 1){
                    /* สถานะเสร็จสิ้นออเดอร์ */
                    updating.order_code = ""
                    updating.employee_name = ""
                }

                await updating.save()
            }
           
            let actionSuccess = ((req.body.success == 1))?" - เสร็จสิ้น " : "";
            const createLog = new AdminLogs()
            createLog.order_code = orderCode
            createLog.action_name = `${updating.name} อัพเดทสถานะเป็น ${status.title} ${actionMove} ${actionSuccess} `
            createLog.employee_name = req.body.name
            createLog.zone = updating.zone_id
            createLog.hut_id = updating.id
            createLog.hut = updating.name
            createLog.status = status.id
            createLog.agents = req.get('User-Agent'),
            createLog.ipaddress = req.socket.remoteAddress
            await createLog.save()

            await SIO.getIO().emit('employee_room', {
                action: 'update',
                zoneId: updating.zone_id,
                hutCode: updating.hut_code,
                hutTitle: updating.name,
                description: `${updating.name} อัพเดทสถานะเป็น ${status.title} `
            })

            return res.json({
                status: true,
                message: "ok",
                description: "updated successfully."
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: "Something went wrong."
            })
        }
    }

    OnGetEmployeeById = async (req: any, res: any) => {
        try {
            const finding = await Employees.findOne({
                where: { id: req.params.id }
            })
            return res.json({
                status: true,
                message: 'ok',
                data: finding
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            });
        }
    }
    OnCreateEmployee = async (req: any, res: any) => {

        try {
            const creating = new Employees()
            creating.name = req.body.name
            await creating.save()

            return res.json({
                status: true,
                message: 'ok',
                description: 'Created employee successfully.'
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnUpdateEmployee = async (req: any, res: any) => {
        const errors = validationResult(req.body)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'error',
                errorMessages: errors.array()
            })
        }

        try {
            const finding = await Employees.findOne({
                where: { id: req.body.id }
            })
            finding.name = req.body.name
            await finding.save()

            return res.json({
                status: true,
                message: 'ok',
                description: 'Created employee successfully.'
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnDeleteEmployee = async (req: any, res: any) => {
        const finding = await Employees.findOne({
            where: { id: req.params.id }
        })
        if (!finding) {
            return res.status(404).json({
                status: false,
                message: 'error',
                description: ''
            })
        }

        try {

            await finding.destroy()
            return res.json({
                status: true,
                message: "ok",
                description: "Delete successfully."
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: "Something went wrong."
            })
        }
    }

    OnUpdateHutById = async (req: any, res: any) => {

        const errors = validationResult(req.body)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessages: errors.array()
            })
        }

        const updating = await Huts.findOne({ where: { id: req.params.id } })
        if (!updating) {
            return res.status(404).json({
                message: "error",
                status: false,
                description: "Hut was not found."
            })
        }

        try {
            updating.name = req.body.name
            updating.status_code =  parseInt(req.body.status)
            updating.priority = req.body.priority
            updating.zoneId = req.body.zoneId
            updating.employee = req.body.employee
            updating.updated_at = moment().format('YYYY-MM-DD h:mm:ss')
            updating.updated_by = req.authCode
            await updating.save()

            return res.json({
                status: true,
                message: 'ok',
                description: "Updated successfully."
            })


        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: "Something went wrong."
            })
        }

    }

    OnGetReports = async (req: any, res: any) => {
        const errors = validationResult(req.body)
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message:"error",
                errorMessages: errors.array()
            })
        } 
        let searchCondition: any = {
            hut: (req.query.hut!="")?req.query.hut:null,
            zone: (req.query.zone!="")?req.query.zone:null, 
            status: (req.query.status!="")?req.query.status:null, 
            beginDate: (req.query.begin!="")?moment(req.query.begin).format('YYYY-MM-DD 00:00:00'):null, 
            endDate: (req.query.end!="")?moment(req.query.end).format('YYYY-MM-DD 23:59:59'):null, 
        }
        try {
            const queryReport: any = await this.queryReportByHutAction(searchCondition)
            const result: any = await this.setFormReport(queryReport)
            const resultData: any = [];
            for(let _data of result) { 
                resultData.push(_data)
            } 

            return res.json({
                status: true,
                message: "ok",
                data: resultData
            })

        } catch (error) {

            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnExportReport = async (req: any, res: any)  => {
        const errors = validationResult(req.query)
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message:"error",
                errorMessages: errors.array()
            })
        } 
        let searchCondition: any = {
            hut: (req.query.hut!="")?req.query.hut:null,
            zone: (req.query.zone!="")?req.query.zone:null, 
            status: (req.query.status!="")?req.query.status:null, 
            beginDate: (req.query.begin!="")?moment(req.query.begin).format('YYYY-MM-DD 00:00:00'):null, 
            endDate: (req.query.end!="")?moment(req.query.end).format('YYYY-MM-DD 23:59:59'):null, 
        }
        try {
            const queryReport: any = await this.queryReportByHutAction(searchCondition)
            const result: any = await this.setFormReport(queryReport)
            const resultData: any = [];
            for(let data of result) {
                for(let objects of data){ 
                    if(data[0].created_at == objects.created_at){
                        resultData.push([ 
                            objects.hut,
                            this.ConvertHutType(objects.zoneType),
                            objects.zoneName,
                            moment(objects.created_at).format('LL'), 
                            moment( objects.created_at).format('LTS'),
                            objects.employee_name,
                            objects.statusTitle,
                            objects.statusColor
                        ])
                    } else {
                        resultData.push([ 
                            "",
                            "",
                            "",
                            "", 
                            moment( objects.created_at).format('LTS'),
                            objects.employee_name,
                            objects.statusTitle,
                            objects.statusColor
                        ])
                    }
                }
                
            } 
          
            const link = await createExcel(resultData,  searchCondition ,null, "mySheet")
            return res.json({
                status: true,
                message: "ok",
                data: link
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }

    }


    OnGetBillReports = async (req: any, res: any) => {
        const errors = validationResult(req.body)
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message:"error",
                errorMessages: errors.array()
            })
        } 
        let searchCondition: any = {
            hut: (req.query.hut!="")?req.query.hut:null,
            zone: (req.query.zone!="")?req.query.zone:null, 
            status: (req.query.status!="")?req.query.status:null, 
            beginDate: (req.query.begin!="")?moment(req.query.begin).format('YYYY-MM-DD 00:00:00'):null, 
            endDate: (req.query.end!="")?moment(req.query.end).format('YYYY-MM-DD 23:59:59'):null, 
        }
        try {
            const queryReport: any = await this.queryBillReport(searchCondition)
            const result: any = await this.setFormReport(queryReport)
            const resultData: any = [];
            for(let _data of result) { 
                resultData.push(_data)
            } 

            return res.json({
                status: true,
                message: "ok",
                data: resultData
            })

        } catch (error) {
            console.log(error)

            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnExportBillReport = async (req: any, res: any)  => {
        const errors = validationResult(req.query)
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message:"error",
                errorMessages: errors.array()
            })
        } 
        let searchCondition: any = {
            hut: (req.query.hut!="")?req.query.hut:null,
            zone: (req.query.zone!="")?req.query.zone:null, 
            status: (req.query.status!="")?req.query.status:null, 
            beginDate: (req.query.begin!="")?moment(req.query.begin).format('YYYY-MM-DD 00:00:00'):null, 
            endDate: (req.query.end!="")?moment(req.query.end).format('YYYY-MM-DD 23:59:59'):null, 
        }
        try {
            const queryReport: any = await this.queryBillReport(searchCondition)
            const result: any = await this.setFormReport(queryReport)
            if(result.length < 1) {
                return  res.status(400).json({
                    status: false,
                    message:"error",
                    description:"No data."
                })
            }

            const resultData: any = [];
            for(let data of result) {
                for(let objects of data){
                    resultData.push([ 
                        this.ConvertHutType(objects.zoneType),
                        objects.zoneName,   
                        objects.hut,
                        objects.counts
                    ])
                }
            } 
          
            if(resultData.length < 1) {
                return  res.status(400).json({
                    status: false,
                    message:"error",
                    description:"No result data."
                })
            }
            
            const link = await createBillExcel(resultData, searchCondition, null)
            return res.json({
                status: true,
                message: "ok",
                data: link
            })
         
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }
 
    ConvertHutType(text: string) {
        let value
         switch(text.toLowerCase()){
            case"hut": value = "ซุ้ม"; break;
            case"table": value = "โต๊ะ"; break;
            case"vip": value = "VIP"; break;
        }
        return value
    }

} 