import { Sequelize , DataTypes } from 'Sequelize'
import { sequelize } from '../util/database'

export const Employees = sequelize.define('Employees',
{
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
}, {
  sequelize,
  tableName: 'employee',
  timestamps: false
});
 