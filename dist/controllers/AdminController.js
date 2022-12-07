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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const express_validator_1 = require("express-validator");
const Admin_service_1 = require("../services/Admin.service");
const Zones_1 = require("../models/Zones");
const Huts_1 = require("../models/Huts");
const md5_1 = require("ts-md5/dist/md5");
const moment_1 = __importDefault(require("moment"));
require("moment/locale/th");
const sequelize_1 = require("sequelize");
const HutStatus_1 = require("../models/HutStatus");
const Employees_1 = require("../models/Employees");
const AdminLogs_1 = require("../models/AdminLogs");
const Sockets_1 = require("../util/Sockets");
const Report_service_1 = require("../services/Report.service");
class AdminController extends Admin_service_1.AdminService {
    constructor() {
        super(...arguments);
        this.OnGetDashboard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let date = (0, moment_1.default)().format('YYYY-MM-DD 06:00:00');
            let afterDate = (0, moment_1.default)(date).add(1, 'days').format('YYYY-MM-DD 06:00:00');
            try {
                const empAmount = yield Employees_1.Employees.count();
                const actAmount = yield AdminLogs_1.AdminLogs.count({
                    where: { created_at: { [sequelize_1.Op.between]: [date, afterDate] } }
                });
                const hutAmount = yield Huts_1.Huts.count();
                const zoneAmount = yield Zones_1.Zones.count();
                const updatedLastest = yield this.queryDashboardUpdated(date, afterDate, 15);
                const updatedList = updatedLastest.map((logs) => {
                    return {
                        zone: logs.zone_title,
                        hut: logs.hut,
                        name: logs.employee_name,
                        statusColor: logs.color,
                        statusId: logs.status,
                        status: logs.title,
                        date: (0, moment_1.default)(logs.dateTime).format('LTS') + " น."
                    };
                });
                const onStatus = yield this.queryHutStatus(date, afterDate);
                let result = {
                    employeeAmount: empAmount,
                    actionAmount: actAmount,
                    hutAmount: hutAmount,
                    zoneAmount: zoneAmount,
                    updates: updatedList,
                    status: onStatus
                };
                return res.json({
                    status: true,
                    message: "ok",
                    data: result
                });
            }
            catch (error) {
                return res.json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnAdminClearHutStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let setValue = { status_code: 1, order_code: "" };
                yield Huts_1.Huts.update(setValue, {
                    where: {
                        status_code: {
                            [sequelize_1.Op.gt]: 1
                        }
                    }
                });
                return res.json({
                    status: true,
                    message: "ok",
                    description: "Clearing successfully"
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetZoneList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            try {
                const zoneCategory = yield Zones_1.Zones.findAll({
                    order: [['zone_priority', 'ASC']]
                });
                const zoneList = zoneCategory.map((zone) => {
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
                });
                return res.json({
                    status: true,
                    message: "ok",
                    data: zoneList
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetEmployees = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield Employees_1.Employees.findAll({ attributes: ['id', ['name', 'value']] });
                return res.json({
                    status: true,
                    message: 'ok',
                    data: finding
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetHuts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllHuts = yield this.queryHutAll();
                return res.json({
                    message: 'ok',
                    status: true,
                    data: getAllHuts
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnGenerateOrderCode = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let orderCode = md5_1.Md5.hashStr("create-order" + (0, moment_1.default)().unix());
                const finding = yield Huts_1.Huts.findOne({
                    where: { id: req.params.id }
                });
                finding.order_code = orderCode;
                yield finding.save();
                return res.json({
                    status: true,
                    message: "ok",
                    data: orderCode
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetHutById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllHuts = yield this.queryHutById(+req.params.id);
                return res.json({
                    message: 'ok',
                    status: true,
                    data: getAllHuts
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetHutsByZone = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            let ZoneId = +req.params.id;
            try {
                const queryHuts = yield this.queryHutByZoneId(ZoneId);
                const hutList = queryHuts.map((item) => {
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
                    };
                });
                return res.json({
                    status: true,
                    message: "ok",
                    data: hutList
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getStatus = yield HutStatus_1.HutStatus.findAll();
                return res.json({
                    status: true,
                    message: "ok",
                    data: getStatus
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnCreateZone = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            try {
                const creatingHut = new Zones_1.Zones();
                creatingHut.zone_code = md5_1.Md5.hashStr("zone-code" + (0, moment_1.default)().format('YYYYMMDDhmmss'));
                creatingHut.zone_title = req.body.title;
                creatingHut.zone_description = req.body.desc;
                creatingHut.zone_status = req.body.status;
                creatingHut.zone_priority = req.body.priority;
                creatingHut.zone_type = req.body.type;
                creatingHut.zone_color = req.body.color;
                yield creatingHut.save();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "Creating hut successfully.",
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetAllZone = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = yield Zones_1.Zones.findAll({ order: [['zone_priority', 'ASC']] });
                return res.json({
                    status: true,
                    message: "ok",
                    data: query
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Some thing went wrong."
                });
            }
        });
        this.OnGetZoneById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield Zones_1.Zones.findOne({ where: { id: req.params.id } });
                return res.json({
                    status: true,
                    message: "ok",
                    data: finding
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnUpdateZoneById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield Zones_1.Zones.findOne({ where: { id: req.params.id } });
                finding.zone_title = req.body.title;
                finding.zone_description = req.body.desc;
                finding.zone_status = req.body.status;
                finding.zone_priority = req.body.priority;
                finding.zone_type = req.body.type;
                finding.zone_color = req.body.color;
                yield finding.save();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "Updated zone successfully."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnDeleteByZoneId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield Zones_1.Zones.findOne({
                    where: { id: req.params.id }
                });
                yield finding.destroy();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "Deleted zone successfully."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnUpdateZone = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            try {
                const updating = yield Zones_1.Zones.findOne({ where: { id: req.body.zoneId } });
                if (!updating) {
                    return res.status(404).json({
                        status: false,
                        message: "error",
                        description: "Zone was not found."
                    });
                }
                updating.title = req.body.title;
                updating.desc = req.body.desc;
                updating.statusCode = req.body.statusCode;
                updating.priority = req.body.priority;
                updating.type = req.body.type;
                updating.color = req.body.color;
                yield updating.save();
                return res.json({
                    status: true,
                    message: 'ok',
                    description: "Updated zone successfully."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetAllStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield HutStatus_1.HutStatus.findAll({ order: [['created_at', 'ASC']] });
                return res.json({
                    status: true,
                    message: "ok",
                    data: finding
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetStatusById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield HutStatus_1.HutStatus.findOne({
                    where: { id: req.params.id }
                });
                return res.json({
                    status: true,
                    message: "ok",
                    data: finding
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: "Something went wrong."
                });
            }
        });
        this.OnCreateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            try {
                const creatingStatus = new HutStatus_1.HutStatus();
                creatingStatus.status_code = md5_1.Md5.hashStr("status-code" + (0, moment_1.default)().format('YYYYMMDDhmmss'));
                creatingStatus.title = req.body.title;
                creatingStatus.color = req.body.color;
                creatingStatus.display = (req.body.status == 1) ? 1 : 0;
                yield creatingStatus.save();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "The status has been created."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnUpdateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updating = yield HutStatus_1.HutStatus.findOne({
                    where: { id: req.params.id }
                });
                updating.title = req.body.title;
                updating.color = req.body.color;
                updating.display = (req.body.status == 1) ? 1 : 0;
                yield updating.save();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "Updated successfully."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnDeleteStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deleting = yield HutStatus_1.HutStatus.findOne({
                    where: { id: req.params.id }
                });
                yield deleting.destroy();
                return res.json({
                    status: true,
                    message: "ok",
                    description: " Deleted successfully/"
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnCreateHut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            try {
                const creatingHut = new Huts_1.Huts();
                creatingHut.hut_code = req.body.code;
                creatingHut.name = req.body.name;
                creatingHut.employee_name = req.body.employee;
                creatingHut.status_code = (req.body.status == 1) ? 1 : 0;
                creatingHut.hut_priority = req.body.priority;
                creatingHut.action_time = (0, moment_1.default)().format('LTS');
                creatingHut.zone_id = req.body.zoneId;
                yield creatingHut.save();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "The hut has been created."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnUpdateHut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            let _id = req.body.id;
            try {
                const updating = yield Huts_1.Huts.findOne({ where: { id: _id } });
                if (!updating) {
                    return res.status(404).json({
                        status: false,
                        message: "error",
                        description: "Hut not found."
                    });
                }
                const status = yield HutStatus_1.HutStatus.findOne({ where: { id: parseInt(req.body.status) } });
                if (!status) {
                    return res.status(404).json({
                        status: false,
                        message: "error",
                        description: "Status was not found."
                    });
                }
                let orderCode = updating.order_code;
                if (req.body.success == 1) {
                    updating.order_code = "";
                }
                updating.employee_name = req.body.name;
                updating.status_code = status.id;
                updating.action_time = (0, moment_1.default)().format('LTS');
                yield updating.save();
                let actionSuccess = ((req.body.success == 1)) ? " - เสร็จสิ้น " : "";
                const createLog = new AdminLogs_1.AdminLogs();
                createLog.order_code = orderCode;
                createLog.action_name = `${updating.name} อัพเดทสถานะเป็น ${status.title} ${actionSuccess}`;
                createLog.employee_name = req.body.name;
                createLog.zone = updating.zone_id;
                createLog.hut_id = updating.id;
                createLog.hut = updating.name;
                createLog.status = status.id;
                createLog.agents = req.get('User-Agent'),
                    createLog.ipaddress = req.socket.remoteAddress;
                yield createLog.save();
                yield Sockets_1.SIO.getIO().emit('employee_room', {
                    action: 'update',
                    zoneId: updating.zone_id,
                    hutCode: updating.hut_code,
                    hutTitle: updating.name,
                    description: `${updating.name} อัพเดทสถานะเป็น ${status.title} `
                });
                return res.json({
                    status: true,
                    message: "ok",
                    description: "updated successfully."
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetEmployeeById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const finding = yield Employees_1.Employees.findOne({
                    where: { id: req.params.id }
                });
                return res.json({
                    status: true,
                    message: 'ok',
                    data: finding
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnCreateEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const creating = new Employees_1.Employees();
                creating.name = req.body.name;
                yield creating.save();
                return res.json({
                    status: true,
                    message: 'ok',
                    description: 'Created employee successfully.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnUpdateEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: 'error',
                    errorMessages: errors.array()
                });
            }
            try {
                const finding = yield Employees_1.Employees.findOne({
                    where: { id: req.body.id }
                });
                finding.name = req.body.name;
                yield finding.save();
                return res.json({
                    status: true,
                    message: 'ok',
                    description: 'Created employee successfully.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnDeleteEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield Employees_1.Employees.findOne({
                where: { id: req.params.id }
            });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: ''
                });
            }
            try {
                yield finding.destroy();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "Delete successfully."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: "Something went wrong."
                });
            }
        });
        this.OnUpdateHutById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            const updating = yield Huts_1.Huts.findOne({ where: { id: req.params.id } });
            if (!updating) {
                return res.status(404).json({
                    message: "error",
                    status: false,
                    description: "Hut was not found."
                });
            }
            try {
                updating.name = req.body.name;
                updating.status = (req.body.status) ? 1 : 0;
                updating.priority = req.body.priority;
                updating.zoneId = req.body.zoneId;
                updating.employee = req.body.employee;
                updating.updated_at = (0, moment_1.default)().format('YYYY-MM-DD h:mm:ss');
                updating.updated_by = req.authCode;
                yield updating.save();
                return res.json({
                    status: true,
                    message: 'ok',
                    description: "Updated successfully."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetReports = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            let searchCondition = {
                hut: (req.query.hut != "") ? req.query.hut : null,
                zone: (req.query.zone != "") ? req.query.zone : null,
                status: (req.query.status != "") ? req.query.status : null,
                beginDate: (req.query.begin != "") ? (0, moment_1.default)(req.query.begin).format('YYYY-MM-DD h:mm:ss') : null,
                endDate: (req.query.end != "") ? (0, moment_1.default)(req.query.end).add(1, 'days').format('YYYY-MM-DD h:mm:ss') : null,
            };
            try {
                const queryReport = yield this.queryReportByHutAction(searchCondition);
                const result = yield this.setFormReport(queryReport);
                const resultData = [];
                for (let _data of result) {
                    resultData.push(_data);
                }
                return res.json({
                    status: true,
                    message: "ok",
                    data: resultData
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnExportReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.query);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            let searchCondition = {
                hut: (req.query.hut != "") ? req.query.hut : null,
                zone: (req.query.zone != "") ? req.query.zone : null,
                status: (req.query.status != "") ? req.query.status : null,
                beginDate: (req.query.begin != "") ? (0, moment_1.default)(req.query.begin).format('YYYY-MM-DD h:mm:ss') : null,
                endDate: (req.query.end != "") ? (0, moment_1.default)(req.query.end).add(1, 'days').format('YYYY-MM-DD h:mm:ss') : null,
            };
            try {
                const queryReport = yield this.queryReportByHutAction(searchCondition);
                const result = yield this.setFormReport(queryReport);
                const resultData = [];
                for (let data of result) {
                    for (let objects of data) {
                        if (data[0].created_at == objects.created_at) {
                            resultData.push([
                                objects.hut,
                                objects.zoneType,
                                objects.zoneName,
                                (0, moment_1.default)(objects.created_at).format('LL'),
                                (0, moment_1.default)(objects.created_at).format('LTS'),
                                objects.employee_name,
                                objects.statusTitle,
                            ]);
                        }
                        else {
                            resultData.push([
                                "",
                                "",
                                "",
                                "",
                                (0, moment_1.default)(objects.created_at).format('LTS'),
                                objects.employee_name,
                                objects.statusTitle,
                            ]);
                        }
                    }
                }
                const link = yield (0, Report_service_1.createExcel)(resultData, null, "mySheet");
                return res.json({
                    status: true,
                    message: "ok",
                    data: link
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
    }
}
exports.AdminController = AdminController;
