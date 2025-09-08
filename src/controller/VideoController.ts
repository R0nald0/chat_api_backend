import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


class VideoController {
    async create(req: Request, res: Response) {
        const { description, duration, urlVideo, ownerId } = req.body
        try {
            const video = await prisma.video.create({
                data: {
                    duration: duration,
                    description: description,
                    url_video: urlVideo,
                    ownerId: ownerId
                },
                
            })

            if (!video) {
                return res.status(403).json({ erro: 'Erro when create video' });
            }


            return res.json(video);
        } catch (error) {
            throw new Error('erro when create new video');
        }
    }

    async findAllByUser(req: Request, res: Response) {
       const {ownerId} =req.query as {ownerId : string}  
           
        try{
             prisma.video.findMany({
                where : {
                   ownerId :parseInt(ownerId)
                }
             }) 
           }
           catch(err){

           }
    }
}

export default new VideoController()