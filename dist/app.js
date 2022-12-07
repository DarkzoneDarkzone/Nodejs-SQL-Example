"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* imports */
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const config_1 = require("./util/config");
const webRoute_1 = require("./routes/webRoute");
const Sockets_1 = require("./util/Sockets");
/* เปิด SyncModels เมื่อเปลี่ยนแปลง Database Structure */
// SyncModels.OnInit()
/* *****************  Applcaition ****************** */
const app = (0, express_1.default)();
app.use(express_1.default.static(path.join(__dirname, './../dist/public/')));
/*  -------- converting json -------- */
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
/* Middleware */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
/* Routes */
app.use(webRoute_1.webRoute);
/* Socket Start */
const server = app.listen(config_1.socketPort);
const io = Sockets_1.SIO.init(server);
io.on('connection', (socket) => {
    socket.on('employee_room', (data) => {
    });
});
/* Server Start */
app.listen(config_1.serverPort);
/* อย่าลืมรัน cronjob : node dist/cronjob.js */
