"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HutStatus = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.HutStatus = database_1.sequelize.define('HutStatus', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    status_code: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    title: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    color: {
        type: Sequelize_1.DataTypes.STRING(15),
        allowNull: false
    },
    display: {
        type: Sequelize_1.DataTypes.TINYINT,
        allowNull: false
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
    tableName: 'hut_status',
    timestamps: false
});
