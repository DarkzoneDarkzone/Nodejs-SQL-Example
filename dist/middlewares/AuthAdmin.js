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
exports.AuthAdmin = void 0;
const Config = __importStar(require("../util/config"));
const jwt = __importStar(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
require("moment/locale/th");
const AuthAdmin = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Not Authenicated" });
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    if (token != "null") {
        try {
            decodedToken = jwt.verify(token, `${Config.secretKey}`);
            if ((0, moment_1.default)().unix() > decodedToken.exp) {
                return res.status(401).json({ status: false, message: 'error', description: "Token was expired" });
            }
            req.authToken = token;
            req.authCode = decodedToken.code;
            req.authEmail = decodedToken.email;
            req.authLevel = decodedToken.level;
            next();
        }
        catch (err) {
            return res.status(401).json({ status: false, message: 'error', description: "Authentication failed, token was expired!" });
        }
    }
    if (!decodedToken) {
        return res.status(401).json({ status: false, message: 'error', description: "Invalid credentials" });
    }
};
exports.AuthAdmin = AuthAdmin;
