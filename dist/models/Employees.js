"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employees = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Employees = database_1.sequelize.define('Employees', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    created_at: {
        type: Sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'employee',
    timestamps: false
});
