import { Sequelize , DataTypes } from 'Sequelize'
import { sequelize } from '../util/database'

export const AdminLogs = sequelize.define('AdminLogs',
{
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  order_code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  employee_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  action_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  zone: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  hut_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hut: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  ipaddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  agents: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'admin_logs',
  timestamps: false
});
 