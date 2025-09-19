import { Request, response, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "../models/ErrorHandler";
import { json } from "stream/consumers";


const prisma = new PrismaClient()
class ConversationContoller {
    async readConversation(req: Request, res: Response) {
        const { id_conversation } = req.params as { id_conversation: string }
        const { id } = req.user as { id: string }
        console.log('id conversation t' + id_conversation);
        console.log('id senderId t' + id);
        try {
            const conversationUpadted = await prisma.conversation.update(
                {
                    data: {
                        updatedAt: new Date(),
                        unreadMessages: 0,
                    },
                    where: {
                        id: parseInt(id_conversation),

                    },
                    include: {
                        users: {
                            omit: {
                                createdAt: true,
                                email: true,
                                password: true,
                                updatedAt: true,
                            },
                            where: {
                                id: {
                                    not: parseInt(id)
                                }
                            }
                        },
                        messages: {
                            orderBy: {
                                createdAt: 'desc'
                            },
                            take: 1,
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
            );
            return res.json(conversationUpadted)
        }
        catch (err) {
            console.error(err)
            const errorHandler: ErrorHandler = {
                code: 403,
                detail: 'Erro when update status messages of conversation',
                error: '',
                timestamp: new Date().toISOString()
            }

        }
    }

    async findConversationByUsers(req: Request, res: Response) {
        const { id_contact } = req.params as { id_contact: string }
        const { id } = req.user as { id: string }
        console.log(`id ${id}  -- ${id_contact}`)

        try {
            const conversation = await prisma.conversation.findFirst({
                where: {
                    AND: [
                        { users: { some: { id: parseInt(id) } } },
                        { users: { some: { id: parseInt(id_contact) } } }
                    ]
                }
            });

            return res.json({ id : conversation?.id });
        } catch (err) {
            console.error('erro when find conersation by users')

            const errorHandler: ErrorHandler = {
                code: 400,
                detail: 'erro when find conersatio by users',
                error: 'Not found',
                timestamp: new Date().toISOString()
            }
        }
    }

    async findByUser(req: Request, res: Response) {
        const { id } = req.query as { id: string }

        try {
            const conversations = await prisma.conversation.findMany({
                where: {
                    users: {
                        some: {
                            id: parseInt(id),
                        },
                    },
                },
                orderBy: {
                    updatedAt: 'desc'
                },

                include: {
                    users: {
                        omit: {
                            createdAt: true,
                            email: true,

                            password: true,
                            updatedAt: true,
                        },
                        where: {
                            NOT: [{ id: parseInt(id) }]
                        }
                    },
                    messages: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1,
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
            })

            return res.json(conversations);
        } catch (e) {
            res.status(403).json({ error: "Failed to get conversations by this user" })
        }
    }
    
    async delete(req :Request , res :Response) {
        const {converstation_id} = req.params as {converstation_id :string}
        try{    
            await prisma.conversation.delete({
                where :{
                    id : parseInt(converstation_id)
                }
            })
           
            return  res.json({sucess : 'conversation deleted ' + converstation_id})
        }catch(err){
            console.error('erroo ' + err)
        }
    }
    async createConversation(req :Request,res :Response){
      const  {contact_id, subject,message } = req.body;
      const{id} =req.user as { id : string};
       
        try {
            const conversation  = await prisma.conversation.create({
                data: {
                    subject: subject,
                    unreadMessages : 0,
                    users: {
                        connect: [{ id: id }, { id: contact_id }]
                    },
                },
            })
            console.log(`conversatio Created ${id}`)
            return  res.json({'id' : conversation.id})

        } catch (err) {
            console.error('erro when create conersaion')

            const errorHandler: ErrorHandler = {
                code: 400,
                detail: 'erro when find conersatio by users',
                error: 'Not found',
                timestamp: new Date().toISOString()
            }
           
            return res.json(errorHandler);

        }

    }

}

export default new ConversationContoller()