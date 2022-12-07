"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Huts = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Huts = database_1.sequelize.define('Huts', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    order_code: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    hut_code: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    name: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    employee_name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    zone_id: {
        type: Sequelize_1.DataTypes.TINYINT,
        allowNull: true
    },
    status_code: {
        type: Sequelize_1.DataTypes.TINYINT,
        allowNull: true
    },
    hut_priority: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    action_time: {
        type: Sequelize_1.DataTypes.TIME,
        allowNull: true,
        defaultValue: Sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_at: {
        type: Sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_by: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    updated_at: {
        type: Sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_by: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: true
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'hut',
    timestamps: false
});
