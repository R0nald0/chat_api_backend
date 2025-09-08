import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()
class ConversationContoller {
    async findByUser(req: Request, res: Response) {
        const {id} = req.query as { id : string}

        try {
            const conversations = await prisma.conversation.findMany({
                where: {
                    users: {
                        some: {
                            id: parseInt(id),
                        }
                    },
                },
                include : {
                    users:{
                        omit :{
                            createdAt :true,
                            email : true ,
                        
                            password :true ,
                            updatedAt : true,
                        },
                        where :{
                          NOT:[{id : parseInt(id)}]
                        }
                    },
                   messages :{
                      
                      omit : {
                        conversationId :true,
                        id : true
                      },
                      
                   }
                },
                
                omit :{
                    createdAt : true,
                    updatedAt:true
                }
              
            })

            return res.json(conversations);
        } catch (e) {
            res.status(403).json({ error: "Failed to get conversations by this user" })
        }
    }
    
}

export default new ConversationContoller()