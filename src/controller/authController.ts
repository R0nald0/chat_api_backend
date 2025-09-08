import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import authConfig from "../config/authConfig";

const prisma = new PrismaClient()

class AuthController {

    async register(req: Request, res: Response) {
        const {  name, email, password,image_url } = req.body
        try {
            const result = await bcrypt.hash(password, 8)
            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: result,
                    image_url :image_url
                },
            });
            const { name: nameCreate, email: emailCreat, createdAt, updatedAt } = user

            return res.status(201).json({message : 'user registred with success'})

        } catch (erro) {
            console.error(erro)
            return res.status(500).json({ error: 'Erro when create' })
        }
    }
    async login(req: Request, res: Response) {
        const { email: email_create, password : password_create } = req.body
        try {

            if (!email_create || !password_create) {
                return res.status(404).json({ error: 'Falha ao realizar login' })
            }

            const user = await prisma.user.findUnique ({
                where: { email: email_create }
            })

            if (!user) {
                return res.status(404).json({ error: 'Falha ao realizar login' })
            }

            const isMatch = await bcrypt.compare(password_create, user.password)
            if (!isMatch) {
                return res.status(404).json({ error: 'Email ou senha inválido' })
            }

            const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: '7d' });

            const { id,name, email, image_url } = user

            return res.status(201).json({
                user: { id,name, email ,image_url },
                token: token 
            },)
        } catch (error) {
            console.error("erro ao realizaazr login" ,error)
           return res.status(404).json({
                 erro : "Falha ao ao realizar login",
            },)
        }

    }

}

export default new AuthController()