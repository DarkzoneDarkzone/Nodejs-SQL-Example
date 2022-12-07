"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zones = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Zones = database_1.sequelize.define('Zones', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    zone_code: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    zone_title: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    zone_description: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    zone_status: {
        type: Sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    zone_priority: {
        type: Sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    zone_type: {
        type: Sequelize_1.DataTypes.STRING(50),
        defaultValue: 0
    },
    zone_color: {
        type: Sequelize_1.DataTypes.STRING(15),
        defaultValue: 0
    },
    created_at: {
        type: Sequelize_1.DataTypes.DATE,
        allowNull: false,
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
    tableName: 'zone',
    timestamps: false
});
