import { Sequelize , DataTypes } from 'Sequelize'
import { sequelize } from '../util/database'

export const Huts = sequelize.define('Huts',
{
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  order_code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  hut_code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  employee_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  zone_id: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  status_code: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  hut_priority: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  action_time: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
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
  tableName: 'hut',
  timestamps: false
});
 