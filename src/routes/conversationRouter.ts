import { Router } from "express";
import ConversastionController from "../controller/ConversastionController";

 const conversationRouter = Router();
 conversationRouter.get('/conversation',ConversastionController.findByUser)

 export default conversationRouter;
