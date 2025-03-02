import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod"

class DeliveryLogsConstroller{
    async create(request: Request, response: Response) {
        const bodyShema = z.object({
            delivery_id: z.string().uuid(),
            description: z.string()
        })

        const { delivery_id, description } = bodyShema.parse(request.body)

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id}
        })

        if(!delivery ){
            throw new AppError ("delivery não encontrado",404)      
         }
         if(delivery.status === "processing"){
            throw new AppError ("change status to shipped",401)
         }

         await prisma.deliveryLog.create({
            data: {
                deliveryId: delivery_id,
                description,
            },
         })
        return response.status(201).json()
    }
}
export { DeliveryLogsConstroller }