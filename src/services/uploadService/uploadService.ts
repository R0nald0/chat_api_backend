import { extname, resolve, join } from "path";
import fs from "fs";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const getImageFile = () => { }

class UploadService {
   createStorage(): multer.StorageEngine {
    const storage =  multer.diskStorage({
      destination(req, file, callback) {
        const { type } = req.query as { type?: string };
        
        const basPath = resolve(__dirname, '..', "..", "..", 'tmp', 'uploads')
        
        const uploadPath = type ? join(basPath, type) : basPath
         
        if (type) {
          fs.mkdirSync(uploadPath, { recursive: true })
        } 
        callback(null, uploadPath)
      },
      filename(req, file, callback) {
        const fileModifiedName = Date.now();
        const ext = extname(file.originalname)
        callback(null, `${fileModifiedName}${ext}`)
      },
    })
    return storage;
  }

  async saveImagePefil(imageName: string, idUser: number) {
    try {
      const user = await prisma.user.update({
        data: {
          image_url: imageName
        },
        where: {
          id: idUser
        }
      })
      return user;

    } catch (err) {
      console.error(err)
    }
  }

}

export default new UploadService()



