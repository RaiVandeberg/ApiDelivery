import { Router } from "express";
import { DeliveriesController } from "@/controllers/deliveries-controller";
import { ensureAuthenticate } from "@/controllers/ensure-authenticate";

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()

deliveriesRoutes.use(ensureAuthenticate)
deliveriesRoutes.post("/",deliveriesController.create)

export { deliveriesRoutes}