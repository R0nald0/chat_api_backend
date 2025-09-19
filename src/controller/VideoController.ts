import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "../models/ErrorHandler";

const prisma = new PrismaClient()


class VideoController {
    async create(req: Request, res: Response) {
        const { description, duration, urlVideo, ownerId, is_private } = req.body
        try {
            const video = await prisma.video.create({
                data: {
                    duration: duration,
                    description: description,
                    url_video: urlVideo,
                    ownerId: ownerId,
                    private: is_private
                },
                include: {
                    owner: {
                        select: {
                            name: true,
                            image_url: true
                        }
                    }
                }

            })

            const videoCreated = {
                id: video.id,
                duration: video.duration,
                url_video: video.url_video,
                description:video.description,
                private  :video.private,
                ownerId: video.ownerId,
                ownerName : video.owner.name,
                ownerUrlImage : video.owner.image_url,
                createdAt: video.createdAt,
            }

            return res.json(videoCreated);
        } catch (error) {
            throw new Error('erro when create new video');
        }
    }

    async findAllByUser(req: Request, res: Response) {
        const { ownerId } = req.params as { ownerId: string }

        try {
            const video = await prisma.video.findMany({
                where: {
                    ownerId: parseInt(ownerId)
                }
            })

            if (!video) {
                res.status(404).json({ error: 'user not found' });
            }

            res.json(video);
        }
        catch (err) {

            const erro: ErrorHandler = {
                code: 404,
                detail: 'Failed when find videos data by user ' + ownerId,
                error: 'Not Found',
                timestamp: new Date().toISOString()
            }
            console.error(err);
            res.status(404).json(erro);
        }
    }
}

export default new VideoController()