/* imports */ 
import express, { Application } from 'express'
import * as path from 'path';
import { socketPort, serverPort } from  './util/config'
import * as SyncModels from './models/SyncModels'
import { webRoute } from './routes/webRoute'
import { SIO } from './util/Sockets'


/* เปิด SyncModels เมื่อเปลี่ยนแปลง Database Structure */
// SyncModels.OnInit()

/* *****************  Applcaition ****************** */
const app: Application = express()
app.use(express.static(path.join(__dirname, './../dist/public/')));

/*  -------- converting json -------- */  
app.use(express.urlencoded({extended: true})); 
app.use(express.json()) 

/* Middleware */
app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*' );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

/* Routes */
app.use( webRoute );

/* Socket Start */
const server = app.listen(socketPort)
const io = SIO.init(server)
io.on('connection' , (socket: any) => { 
    socket.on('employee_room', (data:any) => {
    });
})

/* Start Cronjob */
require('./cronjob')

/* Server Start */
app.listen(serverPort);