"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRoute = void 0;
/* Imports */
const express_1 = require("express");
const AdminController_1 = require("./../controllers/AdminController");
const AuthController_1 = require("./../controllers/AuthController");
const express_validator_1 = require("express-validator");
const AuthAdmin_1 = require("../middlewares/AuthAdmin");
/* Declares */
const router = (0, express_1.Router)();
const adminController = new AdminController_1.AdminController();
const authController = new AuthController_1.AuthController();
/* Routes */
router.get('/zones', adminController.OnGetZoneList);
router.get('/zone/:id', adminController.OnGetHutsByZone);
router.get('/status', adminController.OnGetStatus);
router.get('/employees', adminController.OnGetEmployees);
router.get('/huts', adminController.OnGetHuts);
router.patch('/hut/:id/new_order', adminController.OnGenerateOrderCode);
router.patch('/hut/update', [
    (0, express_validator_1.check)('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({
        error: 'Invalid Character',
        detail: 'name can be only string [a-Z][0-9][ก-๙]'
    }),
    (0, express_validator_1.check)('status').isNumeric(),
    (0, express_validator_1.check)('id').isNumeric()
], adminController.OnUpdateHut);
/* Admin Routes */
router.get('/admin/employees', adminController.OnGetEmployees);
router.get('/admin/employee/:id', AuthAdmin_1.AuthAdmin, adminController.OnGetEmployeeById);
router.post('/admin/employee/create', [
    (0, express_validator_1.check)('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({
        error: 'Invalid Character',
        detail: 'name can be only string [a-Z][0-9][ก-๙]'
    })
], AuthAdmin_1.AuthAdmin, adminController.OnCreateEmployee);
router.patch('/admin/employee/:id', [
    (0, express_validator_1.check)('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({
        error: 'Invalid Character',
        detail: 'name can be only string [a-Z][0-9][ก-๙]'
    })
], AuthAdmin_1.AuthAdmin, adminController.OnUpdateEmployee);
router.delete('/admin/employee/:id', AuthAdmin_1.AuthAdmin, adminController.OnDeleteEmployee);
router.post('/admin/create', [
    (0, express_validator_1.check)('username').isString().matches(/^[a-zA-Z0-9]+$/i),
    (0, express_validator_1.check)('password').isString().isLength({ min: 8 }).withMessage({
        error: 'Invalid length',
        detail: 'Invalid Length! Password length atleast 8 characters are allowed'
    }),
    (0, express_validator_1.check)('fullName').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({
        error: 'Invalid Character',
        detail: 'fullName can be only string [a-Z][0-9][ก-๙]'
    }),
], authController.OnCreateAdmin);
router.post('/admin/login', [
    (0, express_validator_1.check)('username').isString().matches(/^[a-zA-Z0-9]+$/i).withMessage({
        error: 'Invalid Character',
        detail: 'username can be only [a-Z][0-9] characters'
    }),
    (0, express_validator_1.check)('password').isString().isLength({ min: 8 }),
], authController.OnAdminSignin);
router.post('/admin/logout', AuthAdmin_1.AuthAdmin, authController.OnAdminSignOut);
router.patch('/admin/reset_password', [
    (0, express_validator_1.check)('oldPassword').isString().isLength({ min: 8 }),
    (0, express_validator_1.check)('newPassword').isString().isLength({ min: 8 }),
], AuthAdmin_1.AuthAdmin, authController.OnResetPassword);
router.get('/admin/profile', AuthAdmin_1.AuthAdmin, authController.OnAdminGetProfile);
router.get('/admin/lists', AuthAdmin_1.AuthAdmin, authController.OnManageAdmins);
router.get('/admin/list/:id', AuthAdmin_1.AuthAdmin, authController.OnGetAdminById);
router.patch('/admin/list/:id', [
    (0, express_validator_1.check)('username').isString().matches(/^[a-zA-Z0-9]+$/i),
    (0, express_validator_1.check)('fullName').isString().matches(/^[a-zA-Z0-9]+$/i),
    (0, express_validator_1.check)('status').isString(),
    (0, express_validator_1.check)('level').isString(),
    (0, express_validator_1.check)('email').isString(),
    (0, express_validator_1.check)('phone').isString(),
    (0, express_validator_1.check)('line').isString(),
], AuthAdmin_1.AuthAdmin, authController.OnUpdateAdminById);
router.delete('/admin/list/:id', AuthAdmin_1.AuthAdmin, authController.OnDeleteAdminById);
router.get('/admin/zones', AuthAdmin_1.AuthAdmin, adminController.OnGetAllZone);
router.get('/admin/zone/:id', AuthAdmin_1.AuthAdmin, adminController.OnGetZoneById);
router.post('/admin/zone/create', [
    (0, express_validator_1.check)('title').isString(),
    (0, express_validator_1.check)('desc').isString(),
    (0, express_validator_1.check)('status').isNumeric(),
    (0, express_validator_1.check)('priority').isNumeric(),
    (0, express_validator_1.check)('type').isString(),
    (0, express_validator_1.check)('color').isString()
], AuthAdmin_1.AuthAdmin, adminController.OnCreateZone);
router.patch('/admin/zone/:id', [
    (0, express_validator_1.check)('title').isString(),
    (0, express_validator_1.check)('desc').isString(),
    (0, express_validator_1.check)('status').isNumeric(),
    (0, express_validator_1.check)('priority').isNumeric(),
    (0, express_validator_1.check)('type').isString(),
    (0, express_validator_1.check)('color').isString()
], AuthAdmin_1.AuthAdmin, adminController.OnUpdateZoneById);
router.delete('/admin/zone/:id', AuthAdmin_1.AuthAdmin, adminController.OnDeleteByZoneId);
router.get('/admin/status', adminController.OnGetAllStatus);
router.get('/admin/status/:id', AuthAdmin_1.AuthAdmin, adminController.OnGetStatusById);
router.post('/admin/status/create', [
    (0, express_validator_1.check)('title').isString(),
    (0, express_validator_1.check)('color').isString(),
    (0, express_validator_1.check)('status').isNumeric(),
], AuthAdmin_1.AuthAdmin, adminController.OnCreateStatus);
router.patch('/admin/status/:id', [
    (0, express_validator_1.check)('title').isString(),
    (0, express_validator_1.check)('color').isString(),
    (0, express_validator_1.check)('status').isNumeric(),
], AuthAdmin_1.AuthAdmin, adminController.OnUpdateStatus);
router.delete('/admin/status/:id', AuthAdmin_1.AuthAdmin, adminController.OnDeleteStatus);
router.get('/admin/huts', adminController.OnGetHuts);
router.get('/admin/hut/:id', adminController.OnGetHutById);
router.post('/admin/hut/create', [
    (0, express_validator_1.check)('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({
        error: 'Invalid Character',
        detail: 'name can be only string [a-Z][0-9][ก-๙]'
    }),
    (0, express_validator_1.check)('employee').isString(),
    (0, express_validator_1.check)('status').isNumeric(),
    (0, express_validator_1.check)('priority').isNumeric(),
    (0, express_validator_1.check)('zoneId').isNumeric()
], AuthAdmin_1.AuthAdmin, adminController.OnCreateHut);
router.patch('/admin/hut /:id', [
    (0, express_validator_1.check)('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({
        error: 'Invalid Character',
        detail: 'name can be only string [a-Z][0-9][ก-๙]'
    }),
    (0, express_validator_1.check)('employee').isString(),
    (0, express_validator_1.check)('status').isNumeric(),
    (0, express_validator_1.check)('priority').isNumeric(),
    (0, express_validator_1.check)('zoneId').isNumeric()
], AuthAdmin_1.AuthAdmin, adminController.OnUpdateHutById);
router.get('/admin/dashboard', AuthAdmin_1.AuthAdmin, adminController.OnGetDashboard);
router.get('/admin/report', [
    (0, express_validator_1.check)('hut').isString(),
    (0, express_validator_1.check)('zone').isString(),
    (0, express_validator_1.check)('status').isString(),
    (0, express_validator_1.check)('begin').isString(),
    (0, express_validator_1.check)('end').isString(),
], AuthAdmin_1.AuthAdmin, adminController.OnGetReports);
router.get('/admin/export', [
    (0, express_validator_1.check)('hut').isString(),
    (0, express_validator_1.check)('zone').isString(),
    (0, express_validator_1.check)('status').isString(),
    (0, express_validator_1.check)('begin').isString(),
    (0, express_validator_1.check)('end').isString(),
], AuthAdmin_1.AuthAdmin, adminController.OnExportReport);
router.patch('/admin/clear/status', AuthAdmin_1.AuthAdmin, adminController.OnAdminClearHutStatus);
exports.webRoute = router;
