import { Sequelize , DataTypes } from 'Sequelize'
import { sequelize } from '../util/database'

export const Admins = sequelize.define('Admins',
{
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  admin_token: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  admin_code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  admin_username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  admin_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  admin_fullname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  admin_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  admin_phone: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  admin_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  admin_facebook: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  admin_line: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  admin_status: {
    type: "SET('pending','active','banned','inactive')",
    allowNull: false,
    defaultValue: "pending"
  },
  admin_level: {
    type: DataTypes.TINYINT,
    defaultValue: 2
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  created_by: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updated_by: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'admin',
  timestamps: false
});
 