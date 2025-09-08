import { NextFunction, Request, Response } from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import authConfig from "../config/authConfig";


class AuthMiddleware {
    async vetryToken(req:Request,res:Response, next : NextFunction){
       const token  =  req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({error :'Invalid Token'})
        }
         
        try{
          const decoded  =  jwt.verify(token,authConfig.secret) as JwtPayload & { id: string };; 
          req.user = decoded 
          next();
        }
         catch(e){
           return res.status(401).json({ erro: "Invalid Token" });
         }
    }
}
export default new AuthMiddleware()