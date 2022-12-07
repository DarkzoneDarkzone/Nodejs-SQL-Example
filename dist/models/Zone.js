"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zone = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Zone = database_1.sequelize.define('Zone', {
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
    tableName: 'zones',
    timestamps: false
});
