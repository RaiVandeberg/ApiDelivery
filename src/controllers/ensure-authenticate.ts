import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

interface TokenPayLoad {
    role: string
    sub: string
}

function ensureAuthenticate( requeste: Request, response: Response, next: NextFunction){

    try {
        const authHeader = requeste.headers.authorization

        if(!authHeader){
            throw new AppError("JWT token não autorizado",401)
        }


        const [, token] = authHeader.split(" ")

        const { role, sub: user_id} = verify(token, authConfig.jwt.secret) as TokenPayLoad

        requeste.user = {
            id: user_id,
            role,
        }
        return next()

    } catch (error) {
        throw new AppError("Token invalido", 401);
        
    }
}

export { ensureAuthenticate}