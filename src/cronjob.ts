var cron = require('node-cron');
import { Huts } from './models/Huts'
import { Op } from 'sequelize'

cron.schedule('0 6 * * *', async () => {
    /* ทุก 6 โมงเช้าทำตรงนี้ */
    try {
        let setValue = { status_code: 1, order_code: "" , employee_name: "", action_time: null }
        await Huts.update(setValue, {
            where: {
                status_code: { [Op.ne]: 0 }
            }
        })
        console.log('Server has been reseting status.')
    } catch (error){
        console.log(error)
    }
}); 

 