import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";
import { AppError } from "@/utils/AppError";


// validação de dados para cadastro
class UsersController{
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            name: z.string().trim().min(3),
            email: z.string().email(),
            password: z.string().min(6),
        })

        const { name, email, password} = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.user.findFirst( {
            where: { email }
        })

        if(userWithSameEmail){
            throw new AppError("Já tem um usuário com este email", 400)
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        // destruturando a senha para não retornar no response
        // ... pegando todos os dados do usuario e removendo a senha
        const { password:_, ...userWithouPassword } = user
        
        return response.status(201).json(userWithouPassword)
    }
}

export { UsersController}