/* Imports */
import { validationResult } from 'express-validator'
import { AdminService } from '../services/Admin.service'
import * as Config from '../util/config'
import { SIO } from '../util/Sockets' 
import { Md5 } from 'ts-md5/dist/md5' 
import moment from 'moment'
import bcrypt from 'bcrypt' 
import * as jwt from 'jsonwebtoken'
import 'moment/locale/th';
import { Op } from 'sequelize'

/* Models */
import { Zones } from '../models/Zones'
import { Huts } from '../models/Huts'
import { HutStatus } from '../models/HutStatus' 
import { Employees } from '../models/Employees' 
import { AdminLogs } from '../models/AdminLogs' 
import { Admins } from '../models/Admins'

export class AuthController extends AdminService {
     
    OnCreateAdmin = async (req: any, res:any) => {
        const errors  = validationResult(req.body);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessage: errors.array()            
            })
        }

        let username = req.body.username;
        let password = req.body.password;
        let fullName = req.body.fullName;
        
        const check = await Admins.findOne({ where: { admin_username: username } });
        /* ถ้ามี account อยู่แล้ว return error */
        if (check) return res.status(405).json({ status: false, message:"error", description: "An account already exists." });

        /* hash password */
        const hashedPWD = await bcrypt.hash(password, 10);
        const adminCode = Md5.hashStr(username + moment().format('YYYYMMDDhmmss')) 
        const tokenUser = jwt.sign({ 
            admin_username: username, 
            level: 2,
            at: new Date().getTime() 
        }, `${Config.secretKey}` , { expiresIn: '1d' });

        try {
            await Admins.create({
                admin_token: tokenUser,
                admin_code: adminCode,
                admin_username: username,
                admin_fullname: fullName,
                admin_password: hashedPWD,
                admin_status: 'pending',
                admin_level: 2,
                created_at: moment().format('YYYY-MM-DD h:mm:ss'),
                updated_at: moment().format('YYYY-MM-DD h:mm:ss'),
                create_by: adminCode
            });
    
            return res.json({
                status: true,
                message: 'ok',
                description: "Admin was created successfully."
            });
    
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'Something went wrong.'
            });
        }
    }

    OnAdminSignin = async (req: any, res:any) => {

        const errors  = validationResult(req.body);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message: "error",
                errorMessage: errors.array()            
            })
        }

        let username = req.body.username;
        let password = req.body.password;

        const queryAdmin = await Admins.findOne({ where: { admin_username: username } })
        if (!queryAdmin) {
            return res.status(401).json({
                status: false,
                message: "error",
                description: "Username or password is invalid."
            });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, queryAdmin.admin_password)
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
            }, `${Config.secretKey}` , { expiresIn: '1d' });
    
            queryAdmin.token = adminToken;
            queryAdmin.update_date = moment().format('YYYY-MM-DD h:mm:ss');
            await queryAdmin.save();
    
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
        } catch (error){
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }


    }

    OnResetPassword = async (req: any, res:any) => {

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message:'error',
                errorMessages: errors.array()
            })
        }

        let oldPassword: string = req.body.oldPassword
        let newPassword: string = req.body.newPassword
        try {
            const finding = await Admins.findOne({
                admin_code: req.authCode,
                admin_status: 'active'
            })
            if (!finding) {
                return res.status(401).json({
                    status: false,
                    message: "error",
                    description: "Admin Not found."
                });
            }

            const isPasswordCorrect = await bcrypt.compare(oldPassword, finding.admin_password)
            if (!isPasswordCorrect) {
                return res.status(400).json({
                    status: false,
                    message: "error",
                    description: "Your password is incorrect."
                });
            }
            finding.hashedPWD = await bcrypt.hash(newPassword, 10);
            finding.updated_at = moment().format('YYYY-MM-DD h:mm:ss')
            await finding.save()

            return res.json({
                status: true,
                message:"ok",
                description:"Your password has been changed."
            })

        } catch (error){
            return res.status(500).json({
                status: false,
                message:"error",
                description:"Something went wrong."
            })
        }

    }


    OnAdminGetProfile = async (req: any, res:any) => {
        try {
            const profile = await Admins.findOne({ where: { admin_code: req.authCode } })
            return res.json({
                status: true,
                message: "ok",
                data: profile
            })
        } catch (error){
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }
    OnGetAdminById = async (req: any, res:any) => {
        try {
            const profile = await Admins.findOne({ where: { id: req.params.id } })

            return res.json({
                status: true,
                message: "ok",
                data: profile
            })

        } catch (error){
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }
    
    OnUpdateAdminById = async (req: any, res:any) => {
        const errors = validationResult(req.body)
        if(!errors.isEmpty()){
             return res.status(422).json({
                 status: false,
                 message:"error",
                 errorMessages: errors.array()  
             })
        }
        try {
            const profile = await Admins.findOne({ where: { id: req.params.id } })

            profile.admin_username = req.body.username,
            profile.admin_fullname = req.body.fullName,
            profile.admin_status = req.body.status
            profile.admin_level = req.body.level,
            profile.admin_email = req.body.email,
            profile.admin_phone = req.body.phone,
            profile.admin_facebook = req.body.facebook,
            profile.admin_line = req.body.line,
            profile.updated_at = moment().format('YYYY-MM-DD h:mm:ss'),
            profile.updated_by = req.authCode
            await profile.save()

            return res.json({
                status: true,
                message: "ok",
                data: profile
            })

        } catch (error){
            return res.status(500).json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnDeleteAdminById = async (req: any, res: any) => {
        try {
            const adminList = await Admins.findOne({
                where:{ 
                    id: req.params.id,
                    admin_level: { [Op.gte]: req.authLevel } 
                }
            })

            await adminList.destroy()
            return res.json({
                status: true,
                message:"ok",
                description:"Admin was deleted."
            })

        } catch (error){ 
            return res.status(500).json({
                status: false,
                message: "error",
                description:"Something went wrong."
            })
        }
    }

    OnManageAdmins = async (req: any, res:any) => {

        try {
            const adminList = await Admins.findAll({
                where:{ admin_level: { [Op.gte]: req.authLevel } }
            })
            return res.json({
                status: true,
                message: "ok",
                data: adminList
            })

        } catch (error){
            return res.json({
                status: false,
                message: "error",
                description: "Something went wrong."
            })
        }
    }

    OnAdminSignOut = async (req: any, res:any) => {

        try {

            /* invoke token */
            return res.json({
                status: true,
                message: "ok"
            })

        } catch( error) {
            return res.status(500).json({
                status: false,
                message:"error",
                description: "Something went wrong."
            })
        }
    }

}

 
