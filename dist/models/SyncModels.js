"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnInit = void 0;
const database_1 = require("../util/database");
const Admins_1 = require("./Admins");
const Zones_1 = require("./Zones");
const Huts_1 = require("./Huts");
const HutStatus_1 = require("./HutStatus");
const Employees_1 = require("./Employees");
const AdminLogs_1 = require("./AdminLogs");
function OnInit() {
    const declaredModel = {
        Admins: Admins_1.Admins,
        Zones: Zones_1.Zones,
        Huts: Huts_1.Huts,
        HutStatus: HutStatus_1.HutStatus,
        Employees: Employees_1.Employees,
        AdminLogs: AdminLogs_1.AdminLogs
    };
    database_1.sequelize.sync();
}
exports.OnInit = OnInit;
