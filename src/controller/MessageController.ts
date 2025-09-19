import { Message, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ErrorHandler } from "../models/ErrorHandler";

const prisma = new PrismaClient();

class MessageController {
     async readUpdateConversation( id_conversation :number ){
             try {

            const conversationUpadted = await prisma.conversation.update(
                {
                    data: {
                        updatedAt: new Date(),
                        unreadMessages:0,
                    },
                    where: {
                        id: id_conversation,
                       
                    },
                    include: {
                        users: {
                            omit: {
                                createdAt: true,
                                email: true,
                                password: true,
                                updatedAt: true,
                            },
                        },
                        messages: {
                        orderBy :  {
                            createdAt  : 'desc'
                        },
                        take : 1,
                        omit: {
                            conversationId: true,
                            id: true
                        },
                    }
                    },
                    omit: {
                        createdAt: true,
                        updatedAt: true
                    }
                }
            )
          
            console.log(`conversatio updated ${conversationUpadted.id}`)
            return { conversationUpadted }

        }catch(err){
                 console.error('erro ao atualizar  mensagens lidas' + err)
             }
         }

    async findMessagesByConversation(req: Request, res: Response) {
        const { id_conversation } = req.query as { id_conversation: string }
        try {            
           await prisma.conversation.update({
                     where: {
                         id: parseInt(id_conversation)
                     },
                     data: {
                         unreadMessages: 0
                     }
                 });
           const messages = await prisma.message.findMany({
                where: {
                    conversationId: parseInt(id_conversation)
                },
            })
            if (!messages) {
                console.error(messages)
                return res.status(404).json({ error: 'Not Found' })
            }

            return res.json(messages);
        } catch (err) {
            return res.status(403).json({ error: 'Failed to get messages' });
        }

    }

    async createMessage(senderid: string, content: string, conversationId: number): Promise<Message> {
        try {
            const message = await prisma.message.create({
                data: {
                    content,
                    sender: { connect: { id: parseInt(senderid) } },
                    conversation: { connect: { id: conversationId } }
                }
            })


            console.log(`content id ${message.id}`)
            console.log(`content ${message.content}`)
            return message
        } catch (err) {
            console.error(err);
            throw new Error(`Erro when create message ${err}`)
        }
    }

    async updatedConversation(conversationId: number, message: Message, senderId: number) {
        try {

            const conversationUpadted = await prisma.conversation.update(
                {
                    data: {
                        updatedAt: new Date(),
                        lastMessage: message.content,
                        unreadMessages: { increment: 1 },
                    },
                    where: {
                        id: conversationId,
                        users: {
                            some: {
                                id: {
                                    not: message.senderId
                                }
                            }
                        }
                    },
                    include: {
                        users: {
                            omit: {
                                createdAt: true,
                                email: true,
                                password: true,
                                updatedAt: true,
                            },
                        },
                        messages: {
                        orderBy :  {
                            createdAt  : 'desc'
                        },
                        take : 1,
                        omit: {
                            conversationId: true,
                            id: true
                        },
                    }
                    },
                    omit: {
                        createdAt: true,
                        updatedAt: true
                    }
                }
            )
            const { content } = message;
            console.log(`conversatio updated ${conversationUpadted.id}`)
            return { conversationUpadted }

        } catch (err) {
            const errorHandler: ErrorHandler = {
                code: 403,
                detail: "Error when updated conversation " + err,
                error: `${err}`,
                timestamp: new Date().toISOString(),
            };
            throw new Error("Failed to update Conversation: " + err);
        }
    }


   
}

export default new MessageController();