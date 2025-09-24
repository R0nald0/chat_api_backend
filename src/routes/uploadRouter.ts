import { Router } from "express";
import UploadsController from "../controller/UploadsController";
import multer from "multer";
import uploadService from "../services/uploadService/uploadService";

const storage =  uploadService.createStorage()

const upload = multer({storage})

const uploadsRouter = Router();


uploadsRouter.post('/image',upload.single("file"),UploadsController.imageUpload)

export default uploadsRouter;