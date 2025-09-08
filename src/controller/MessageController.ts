import { Request, Response } from "express";
import { Message, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class MessageController {
    async findMessagesByConversation(req: Request, res: Response) {
        const { id_conversation } = req.query as { id_conversation: string }
        console.log(id_conversation)
        try {
            const messages = await prisma.message.findMany({
                where: {
                    conversationId : parseInt(id_conversation)
                },
            })
           if(!messages){
            console.error(messages)
            return res.status(404).json({error : 'Not Found'})
            
           }
           
            return res.json(messages);
        }catch(err){
          return res.status(403).json({error : 'Failed to get messages'});
        }
    }

       async createMessage(senderid: string, content: string, conversationId: number) :Promise<Message>{
        const message = await prisma.message.create({
            data: {
                content,
                sender: { connect: { id: parseInt(senderid) } },
                conversation: { connect: { id: conversationId } }
            }
        })
        return message
    }
     
    async updatedConversation(conversationId : number,message :Message){
        try{
            
      const conversationUpadted  = await prisma.conversation.update({
            data :{
                messages :{
                    create : {
                        content : message.content,
                        sender : {
                            connect : {
                                id : message.senderId
                            }
                        }
                    }
                }
            },
            where : {
                id : conversationId
            }
         })
        console.log(`conversatio updated ${conversationUpadted}`)
         return conversationUpadted
        }catch(err){
            throw new Error('Failed do update Conversation' + err)
        }
    }

    async createConversation(user:number , contactId : number,subject : string | null) :Promise<number> {
        try{
            const {id} = await prisma.conversation.create({
                data : {
                    subject : subject,
                    users : { 
                        connect :[{id : user},{ id:contactId}]
                    },
                },
                include :{
                    users : true,
                }
            })
            return id
        }catch(err){
            throw new Error("erro ao criar converstation " + err,);
           
        }

    }
}

export default new MessageController();