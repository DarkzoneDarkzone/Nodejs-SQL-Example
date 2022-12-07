import { Sequelize , DataTypes } from 'Sequelize'
import { sequelize } from '../util/database'

export const Zones = sequelize.define('Zones',
{
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  zone_code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  zone_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  zone_description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  zone_status: {
    type: DataTypes.TINYINT,  
    defaultValue: 0
  },
  zone_priority: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  zone_type: {
    type: DataTypes.STRING(50),
    defaultValue: 0
  },
  zone_color: {
    type: DataTypes.STRING(15),
    defaultValue: 0
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
  tableName: 'zone',
  timestamps: false
});
 