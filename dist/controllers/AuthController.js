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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
/* Imports */
const express_validator_1 = require("express-validator");
const Admin_service_1 = require("../services/Admin.service");
const Config = __importStar(require("../util/config"));
const md5_1 = require("ts-md5/dist/md5");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
require("moment/locale/th");
const sequelize_1 = require("sequelize");
const Admins_1 = require("../models/Admins");
class AuthController extends Admin_service_1.AdminService {
    constructor() {
        super(...arguments);
        this.OnCreateAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessage: errors.array()
                });
            }
            let username = req.body.username;
            let password = req.body.password;
            let fullName = req.body.fullName;
            const check = yield Admins_1.Admins.findOne({ where: { admin_username: username } });
            /* ถ้ามี account อยู่แล้ว return error */
            if (check)
                return res.status(405).json({ status: false, message: "error", description: "An account already exists." });
            /* hash password */
            const hashedPWD = yield bcrypt_1.default.hash(password, 10);
            const adminCode = md5_1.Md5.hashStr(username + (0, moment_1.default)().format('YYYYMMDDhmmss'));
            const tokenUser = jwt.sign({
                admin_username: username,
                level: 2,
                at: new Date().getTime()
            }, `${Config.secretKey}`, { expiresIn: '1d' });
            try {
                yield Admins_1.Admins.create({
                    admin_token: tokenUser,
                    admin_code: adminCode,
                    admin_username: username,
                    admin_fullname: fullName,
                    admin_password: hashedPWD,
                    admin_status: 'pending',
                    admin_level: 2,
                    created_at: (0, moment_1.default)().format('YYYY-MM-DD h:mm:ss'),
                    updated_at: (0, moment_1.default)().format('YYYY-MM-DD h:mm:ss'),
                    create_by: adminCode
                });
                return res.json({
                    status: true,
                    message: 'ok',
                    description: "Admin was created successfully."
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'Something went wrong.'
                });
            }
        });
        this.OnAdminSignin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessage: errors.array()
                });
            }
            let username = req.body.username;
            let password = req.body.password;
            const queryAdmin = yield Admins_1.Admins.findOne({ where: { admin_username: username } });
            if (!queryAdmin) {
                return res.status(401).json({
                    status: false,
                    message: "error",
                    description: "Username or password is invalid."
                });
            }
            const isPasswordCorrect = yield bcrypt_1.default.compare(password, queryAdmin.admin_password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    status: false,
                    message: "error",
                    description: "Username or password is invalid."
                });
            }
            try {
                const adminToken = jwt.sign({
                    code: queryAdmin.admin_code,
                    username: queryAdmin.admin_username,
                    email: queryAdmin.admin_email,
                    level: queryAdmin.admin_level,
                }, `${Config.secretKey}`, { expiresIn: '1d' });
                queryAdmin.token = adminToken;
                queryAdmin.update_date = (0, moment_1.default)().format('YYYY-MM-DD h:mm:ss');
                yield queryAdmin.save();
                return res.status(200).json({
                    status: true,
                    message: "ok",
                    data: {
                        token: adminToken,
                        info: {
                            code: queryAdmin.admin_code,
                            image: queryAdmin.admin_image,
                            username: queryAdmin.admin_username,
                            email: queryAdmin.admin_email,
                            fullName: queryAdmin.admin_fullname,
                            phone: queryAdmin.admin_phone,
                            facebook: queryAdmin.admin_facebook,
                            line: queryAdmin.admin_line,
                            status: queryAdmin.admin_status
                        },
                    },
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnResetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: 'error',
                    errorMessages: errors.array()
                });
            }
            let oldPassword = req.body.oldPassword;
            let newPassword = req.body.newPassword;
            try {
                const finding = yield Admins_1.Admins.findOne({
                    admin_code: req.authCode,
                    admin_status: 'active'
                });
                if (!finding) {
                    return res.status(401).json({
                        status: false,
                        message: "error",
                        description: "Admin Not found."
                    });
                }
                const isPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, finding.admin_password);
                if (!isPasswordCorrect) {
                    return res.status(400).json({
                        status: false,
                        message: "error",
                        description: "Your password is incorrect."
                    });
                }
                finding.hashedPWD = yield bcrypt_1.default.hash(newPassword, 10);
                finding.updated_at = (0, moment_1.default)().format('YYYY-MM-DD h:mm:ss');
                yield finding.save();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "Your password has been changed."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnAdminGetProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield Admins_1.Admins.findOne({ where: { admin_code: req.authCode } });
                return res.json({
                    status: true,
                    message: "ok",
                    data: profile
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnGetAdminById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield Admins_1.Admins.findOne({ where: { id: req.params.id } });
                return res.json({
                    status: true,
                    message: "ok",
                    data: profile
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnUpdateAdminById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: "error",
                    errorMessages: errors.array()
                });
            }
            try {
                const profile = yield Admins_1.Admins.findOne({ where: { id: req.params.id } });
                profile.admin_username = req.body.username,
                    profile.admin_fullname = req.body.fullName,
                    profile.admin_status = req.body.status;
                profile.admin_level = req.body.level,
                    profile.admin_email = req.body.email,
                    profile.admin_phone = req.body.phone,
                    profile.admin_facebook = req.body.facebook,
                    profile.admin_line = req.body.line,
                    profile.updated_at = (0, moment_1.default)().format('YYYY-MM-DD h:mm:ss'),
                    profile.updated_by = req.authCode;
                yield profile.save();
                return res.json({
                    status: true,
                    message: "ok",
                    data: profile
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnDeleteAdminById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminList = yield Admins_1.Admins.findOne({
                    where: {
                        id: req.params.id,
                        admin_level: { [sequelize_1.Op.gte]: req.authLevel }
                    }
                });
                yield adminList.destroy();
                return res.json({
                    status: true,
                    message: "ok",
                    description: "Admin was deleted."
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnManageAdmins = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const adminList = yield Admins_1.Admins.findAll({
                    where: { admin_level: { [sequelize_1.Op.gte]: req.authLevel } }
                });
                return res.json({
                    status: true,
                    message: "ok",
                    data: adminList
                });
            }
            catch (error) {
                return res.json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
        this.OnAdminSignOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                /* invoke token */
                return res.json({
                    status: true,
                    message: "ok"
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "error",
                    description: "Something went wrong."
                });
            }
        });
    }
}
exports.AuthController = AuthController;
