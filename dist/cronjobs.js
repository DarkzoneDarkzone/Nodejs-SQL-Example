var cron = require('node-cron');
const Huts = require('./models/Huts');
const { Op } = require("sequelize");

cron.schedule('0 6 * * *', async () => {
    /* ทุก 6 โมงเช้าทำตรงนี้ */
    let setValue = { 
        status_code: 1, 
        order_code: "" , 
        action_time: null 
    }
    await Huts.update(setValue, {
        where: {   
            status_code: { [Op.gt]: 1  }
        }
    })
}); 

cron.schedule('* * * * * *', async () => {
    /* ทุก 6 โมงเช้าทำตรงนี้ */
    try {

        const test = await  Huts.findOne();
        console.log(test)

        // let setValue = { status_code: 1, order_code: "" , employee_name: "", action_time: null }
        // await Huts.update(setValue, {
        //     where: {
        //         status_code: { [Op.ne]: 0 }
        //     }
        // })
        // console.log('work')
    } catch (error){
        console.log(error)
    }
}); 