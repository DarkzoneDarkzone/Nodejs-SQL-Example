"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIO = void 0;
let io;
exports.SIO = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: ["http://192.168.1.54:3000", "http://192.168.1.54:3001", "https://stately-kitten-3777e3.netlify.app"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
};
