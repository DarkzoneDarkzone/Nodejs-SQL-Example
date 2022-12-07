import { sequelize } from '../util/database';
import { Admins } from './Admins';
import { Zones } from './Zones'
import { Huts } from './Huts'
import { HutStatus } from './HutStatus'
import { Employees } from './Employees'
import { AdminLogs } from './AdminLogs'

export function OnInit(){
    const declaredModel = {
        Admins,
        Zones,
        Huts,
        HutStatus,
        Employees,
        AdminLogs
    }
    sequelize.sync(); 
}
