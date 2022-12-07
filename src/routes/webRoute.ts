/* Imports */
import {  Router } from 'express';
import { AdminController } from "./../controllers/AdminController";
import { AuthController } from "./../controllers/AuthController";
import { check, param } from 'express-validator';
import { AuthAdmin } from '../middlewares/AuthAdmin'

/* Declares */
const  router =  Router()
const adminController = new AdminController(); 
const authController = new AuthController(); 

/* Routes */
 router.get('/zones', adminController.OnGetZoneList);
 router.get('/zone/:id', adminController.OnGetHutsByZone);
 router.get('/status', adminController.OnGetStatus);
 router.get('/employees', adminController.OnGetEmployees);
 router.get('/huts', adminController.OnGetHuts);

 router.patch('/hut/:id/new_order',adminController.OnGenerateOrderCode) 

 router.patch('/hut/update',[
            check('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({ 
                error: 'Invalid Character',
                detail: 'name can be only string [a-Z][0-9][ก-๙]'
            }),
            check('status').isNumeric(),
            check('id').isNumeric()
        ], adminController.OnUpdateHut);
 
/* Admin Routes */
 router.get('/admin/employees', adminController.OnGetEmployees);
 router.get('/admin/employee/:id', AuthAdmin, adminController.OnGetEmployeeById);
 router.post('/admin/employee/create', [
            check('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({ 
                error: 'Invalid Character',
                detail: 'name can be only string [a-Z][0-9][ก-๙]'
            })
        ], AuthAdmin, adminController.OnCreateEmployee);
 router.patch('/admin/employee/:id', [
            check('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({ 
                error: 'Invalid Character',
                detail: 'name can be only string [a-Z][0-9][ก-๙]'
            })
        ], AuthAdmin, adminController.OnUpdateEmployee);
 router.delete('/admin/employee/:id', AuthAdmin, adminController.OnDeleteEmployee);

 router.post('/admin/create',[
            check('username').isString().matches(/^[a-zA-Z0-9]+$/i),
            check('password').isString().isLength({ min: 8 }).withMessage({
                error: 'Invalid length',
                detail: 'Invalid Length! Password length atleast 8 characters are allowed'
            }), 
            check('fullName').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({ 
                error: 'Invalid Character',
                detail: 'fullName can be only string [a-Z][0-9][ก-๙]'
            }),
        ], authController.OnCreateAdmin)
 router.post('/admin/login',[
            check('username').isString().matches(/^[a-zA-Z0-9]+$/i).withMessage({
                error: 'Invalid Character',
                detail: 'username can be only [a-Z][0-9] characters'
            }),
            check('password').isString().isLength({ min: 8 }),
        ], authController.OnAdminSignin)
 router.post('/admin/logout', AuthAdmin , authController.OnAdminSignOut)
 router.patch('/admin/reset_password', [
            check('oldPassword').isString().isLength({ min: 8 }),
            check('newPassword').isString().isLength({ min: 8 }),
        ] , AuthAdmin, authController.OnResetPassword)                                         
 router.get('/admin/profile', AuthAdmin, authController.OnAdminGetProfile)
 router.get('/admin/lists', AuthAdmin, authController.OnManageAdmins)
 router.get('/admin/list/:id', AuthAdmin, authController.OnGetAdminById)
 router.patch('/admin/list/:id', [
            check('username').isString().matches(/^[a-zA-Z0-9]+$/i),
            check('fullName').isString().matches(/^[a-zA-Z0-9]+$/i),
            check('status').isString(),
            check('level').isString(),
            check('email').isString(),
            check('phone').isString(),
            check('line').isString(),
        ] , AuthAdmin, authController.OnUpdateAdminById) 
 router.delete('/admin/list/:id', AuthAdmin, authController.OnDeleteAdminById)

 router.get('/admin/zones', AuthAdmin, adminController.OnGetAllZone);
 router.get('/admin/zone/:id', AuthAdmin, adminController.OnGetZoneById);
 router.post('/admin/zone/create', [
            check('title').isString(),
            check('desc').isString(),
            check('status').isNumeric(),
            check('priority').isNumeric(),
            check('type').isString(),
            check('color').isString()
        ], AuthAdmin, adminController.OnCreateZone);
 router.patch('/admin/zone/:id', [
            check('title').isString(),
            check('desc').isString(),
            check('status').isNumeric(),
            check('priority').isNumeric(),
            check('type').isString(),
            check('color').isString()
        ] , AuthAdmin, adminController.OnUpdateZoneById) 
 router.delete('/admin/zone/:id', AuthAdmin, adminController.OnDeleteByZoneId);
 router.patch('/admin/clear/status', [
    check('zone').isNumeric(),
 ], AuthAdmin, adminController.ClearZoneById);


 router.get('/admin/status', adminController.OnGetAllStatus);
 router.get('/admin/status/:id', AuthAdmin, adminController.OnGetStatusById);
 router.post('/admin/status/create',[
            check('title').isString(),
            check('color').isString(),
            check('status').isNumeric(),
        ],AuthAdmin, adminController.OnCreateStatus);
 router.patch('/admin/status/:id',[
            check('title').isString(),
            check('color').isString(),
            check('status').isNumeric(),
        ],AuthAdmin, adminController.OnUpdateStatus);
 router.delete('/admin/status/:id', AuthAdmin, adminController.OnDeleteStatus);

 router.get('/admin/huts', adminController.OnGetHuts);
 router.get('/admin/hut/:id', adminController.OnGetHutById);
 router.post('/admin/hut/create',[
            check('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({ 
                error: 'Invalid Character',
                detail: 'name can be only string [a-Z][0-9][ก-๙]'
            }),
            check('employee').isString(),
            check('status').isNumeric(),
            check('priority').isNumeric(),
            check('zoneId').isNumeric()
        ], AuthAdmin, adminController.OnCreateHut);

 router.patch('/admin/hut/:id',[
            check('name').isString().matches(/^[a-zA-Z0-9ก-๙\s]+$/i).withMessage({ 
                error: 'Invalid Character',
                detail: 'name can be only string [a-Z][0-9][ก-๙]'
            }),
            check('employee').isString(),
            check('status').isNumeric(),
            check('priority').isNumeric(),
            check('zoneId').isNumeric()
        ], AuthAdmin, adminController.OnUpdateHutById);

router.get('/admin/dashboard', AuthAdmin, adminController.OnGetDashboard);
router.get('/admin/report', [
    check('hut').isString(),
    check('zone').isString(),
    check('status').isString(),
    check('begin').isString(),
    check('end').isString(),
] ,AuthAdmin, adminController.OnGetReports);

router.get('/admin/export', [
    check('hut').isString(),
    check('zone').isString(),
    check('status').isString(),
    check('begin').isString(),
    check('end').isString(),
] ,AuthAdmin, adminController.OnExportReport);


router.get('/admin/report/bill', [
    check('hut').isString(),
    check('zone').isString(),
    check('status').isString(),
    check('begin').isString(),
    check('end').isString(),
] ,AuthAdmin, adminController.OnGetBillReports);
router.get('/admin/export/bill', [
    check('hut').isString(),
    check('zone').isString(),
    check('status').isString(),
    check('begin').isString(),
    check('end').isString(),
] ,AuthAdmin, adminController.OnExportBillReport);

router.patch('/admin/clear/status', AuthAdmin, adminController.OnAdminClearHutStatus);

export const webRoute =  router  