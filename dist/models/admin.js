"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Admin = database_1.sequelize.define('Admin', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    admin_token: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    admin_code: {
        type: Sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    admin_username: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    admin_password: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    admin_fullname: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    admin_image: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    admin_phone: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: true
    },
    admin_email: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    admin_facebook: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    admin_line: {
        type: Sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    admin_status: {
        type: "SET('pending','active','banned','inactive')",
        allowNull: false,
        defaultValue: "pending"
    },
    admin_level: {
        type: Sequelize_1.DataTypes.TINYINT,
        defaultValue: 2
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
    tableName: 'admin',
    timestamps: false
});
