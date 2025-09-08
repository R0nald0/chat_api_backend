import { Router } from "express";
import MessageController from "../controller/MessageController";

const messageRouter =  Router();

messageRouter.get('/messages',MessageController.findMessagesByConversation);

export default messageRouter;