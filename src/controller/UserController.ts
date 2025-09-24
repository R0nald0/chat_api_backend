import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client"
import { ErrorHandler } from '../models/ErrorHandler'


const prisma = new PrismaClient({
    omit: {
        user: {
            password: true
        }
    }
})
class UserController {
    async findByEmail(req: Request, res: Response) {
        const { email } = req.query as { email: string }
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        })
            
        if (!user) {
            return res.status(404).json({ message: 'User not Found' })
        }
        
       
        res.json(user);
    }
    async updateUser(req:Request ,res :Response){
       const {id}  = req.body.user
        try {
        //  UserService.update()
       } catch (error) {
        
       }

    }

    async findStoryOfMyContacts(req: Request, res: Response) {
        const { id } = req.params

        try {
            const contacts = await prisma.user.findUnique({
                where: {
                    id: parseInt(id)
                },
               select :{
                contacts :{
                    select :{
                        id :true,
                        image_url :true,
                        name :true,
                        
                        email : false,
                        videos :{
                            omit: {
                                updatedAt :true,
                                expiresAt:true
                            }
                        }
                    },
                }
               }
            });

        const contactWithStory  =  contacts?.contacts.filter((cont) => cont.videos.length !== 0)
         
      /* const story  =  contacts?.contacts?.map((v) => ({
            'owner_image' : v.image_url,
            'owner_name' : v.name,
             ...v
        }) );
         */
            return res.json(contactWithStory);
        } catch (error) {
            console.error('Error ao videos do contato ', error)
            const errorHandler: ErrorHandler = {
                error: 'User not found',
                code: 404,
                detail: "Failed to fetch  all video of contatcts by user' + id ",
                timestamp: new Date().toISOString()

            }
            res.status(400).json(error)
        }
    }
    async findMyContacts(req: Request, res: Response) {
        const { id } = req.params

        try {
            const contacts = await prisma.user.findUnique({
                where: {
                    id: parseInt(id)
                },
                select: {
                    contacts: {
                        select: {
                            email: true,
                            id: true,
                            image_url: true,
                            name: true,
                        }
                    }
                }
            });

            return res.json(contacts);
        } catch (error) {
            console.error('Error ao buscar contato ', error)
            const errorHandler: ErrorHandler = {
                error: 'User not found',
                code: 404,
                detail: "Failed to fetch contatcts by user' + id ",
                timestamp: new Date().toISOString()

            }

            res.status(400).json(error)

        }
    }

    async addUserToContact(req: Request, res: Response) {
        const { id } = req.user as { id: string }
        const { contact_id } = req.body;

        if (id === contact_id) {
            console.log('id :' + id)
            console.log('id contact :' + contact_id)
            return res.status(404).json({ error: 'Bad request' })
        }
        try {
            const user = await prisma.user.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    contacts: {
                        connect: { id: contact_id }
                    }
                }
            })


            return res.status(200).json({
                message: `user ${contact_id} added to list of contact`,
                'contact_id': contact_id
            });

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    const error: ErrorHandler = {
                        error: 'User not found',
                        code: 404,
                        detail: "Id do contato inexistente.",
                        timestamp: new Date().toISOString()

                    }
                    return res.status(404).json(error)
                }
            }

            const errorHandler: ErrorHandler = {
                error: "Internal server error",
                code: 500,
                detail: "Ocorreu um erro inesperado ao processar sua requisição.",
                timestamp: new Date().toISOString()
            }
            console.error(error);


            return res.status(500).json()
        }

    }
}

export default new UserController()