import * as Config from '../util/config'
import * as jwt from 'jsonwebtoken'
import moment from 'moment'
import 'moment/locale/th';

export const AuthAdmin = (req:any,res:any,next:any) => {
    const authHeader = req.get("Authorization");
    if(!authHeader){ 
        return res.status(401).json({message: "Not Authenicated"});
    }
    const token = authHeader.split(' ')[1];
    let decodedToken: any;
    if(token != "null") {
        try {  
            
            decodedToken = jwt.verify(token, `${Config.secretKey}`);
    
            if(moment().unix() >  decodedToken.exp){
                return res.status(401).json({ status: false, message:'error', description: "Token was expired"});
            }   
         
            req.authToken = token;
            req.authCode = decodedToken.code;
            req.authEmail = decodedToken.email;
            req.authLevel = decodedToken.level;
            next();

        } catch (err) {
            return res.status(401).json({ status: false, message:'error', description: "Authentication failed, token was expired!"});
        }
    }
    if(!decodedToken) {
        return res.status(401).json({status: false, message:'error', description: "Invalid credentials"});
    }
}