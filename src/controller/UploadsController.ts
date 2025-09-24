import { Request, Response } from "express";
import {StatusCodes} from 'http-status-codes'
import uploadService from "../services/uploadService/uploadService";

class UploadsController {

 async imageUpload(req: Request,res: Response){
     const file =  req.file
     const {id} = req.user as { id : number}
     const {type} = req.query as {type : 'profile'}
    
     if (!file) {
        return res.status(StatusCodes.BAD_REQUEST).json({message : 'No file'})
     }     

     const protocol= req.protocol 
     let url = `${protocol}://10.0.2.2:3000/uploads/${file.filename}`
   
     const user = await  uploadService.saveImagePefil(url,id)

     if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({erro : 'Erro ao atualizar o usuário'})
     }
   
     
     
     if (type === 'profile') {
       url  = `${protocol}://${req.host}${req.baseUrl}/profile/${file.filename}`
     } 
     
     res.status(StatusCodes.CREATED).json({ file : file,
        url : url
     })
 }   
    
}

export default new UploadsController()