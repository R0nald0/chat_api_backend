import { Router } from "express";
import authController from '../controller/authController'
import ConversastionController from "../controller/ConversastionController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
const router = Router();


 router.post('/register',authController.register);
 router.post('/login',authController.login)


export default router;

