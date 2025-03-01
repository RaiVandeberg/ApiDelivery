import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { compare } from "bcrypt";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";
import { UserRole } from "@prisma/client";


class SessionsController {
   async create(request: Request, response: Response){
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        const {email, password} = bodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: { email},
        })

        if(!user){
            throw new AppError("email  invalido", 401)
        }
       

        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){
            throw new AppError("senha invalida", 401)
        }

        const {secret, expiresIn} = authConfig.jwt

        const token = sign({role: user.role ?? "customer"}, secret, {
            subject: user.id,
            expiresIn
        })

        return response.json( {token})
    }
}

export { SessionsController }