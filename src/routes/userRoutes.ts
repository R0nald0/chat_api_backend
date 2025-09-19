import { Router } from "express";
import UserController from "../controller/UserController";
const userRouter = Router()

userRouter.get('/users',UserController.findByEmail);
userRouter.get("/users/:id",UserController.findMyContacts)
userRouter.put('/users',UserController.addUserToContact)
userRouter.get("/users/videos/:id",UserController.findStoryOfMyContacts)


export default userRouter;