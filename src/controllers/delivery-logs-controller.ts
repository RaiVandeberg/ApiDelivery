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
         if(delivery.status == "delivered"){
            throw new AppError("pedido já foi entregue", 401)
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

    async show(request: Request, response: Response){
        const paramSchema = z.object({
            delivery_id: z.string().uuid(),

            
        })

        const { delivery_id } = paramSchema.parse(request.params)
        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id },
            include: {
                logs: true, 
                user: true,
            }
        })

        if(request.user?.role === "customer" && request.user.id !== delivery?.userId){
            throw new AppError("the user can only view thier deliveries", 401)
        }

        return response.json(delivery)
    }
}
export { DeliveryLogsConstroller }