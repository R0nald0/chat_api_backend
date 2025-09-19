import { Router } from "express";
import ConversastionController from "../controller/ConversastionController";

 const conversationRouter = Router();

 conversationRouter.get('/conversation',ConversastionController.findByUser)
 conversationRouter.get('/conversation/:id_contact',ConversastionController.findConversationByUsers)
 conversationRouter.post('/conversation',ConversastionController.createConversation)
 conversationRouter.delete('/conversation/:converstation_id',ConversastionController.delete)
 conversationRouter.put('/readConversatio/:id_conversation',ConversastionController.readConversation);

 
 export default conversationRouter;
