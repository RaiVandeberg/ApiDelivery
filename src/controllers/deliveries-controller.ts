import { Request, Response } from "express"

class DeliveriesController {
    create(requeste: Request, response: Response){
        return response.json({ messaege: "ok"})
    }
}

export { DeliveriesController}