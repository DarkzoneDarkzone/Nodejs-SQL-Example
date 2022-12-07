"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLogs = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.AdminLogs = database_1.sequelize.define('AdminLogs', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    order_code: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    employee_name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    action_name: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    zone: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    hut_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    hut: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    status: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: Sequelize_1.DataTypes.DATE,
        defaultValue: Sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    ipaddress: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    agents: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'admin_logs',
    timestamps: false
});
