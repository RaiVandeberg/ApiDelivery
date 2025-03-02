import { Router } from "express";
import { DeliveriesController } from "@/controllers/deliveries-controller";
import { ensureAuthenticate } from "@/middlewares/ensure-authenticate";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()

deliveriesRoutes.use(ensureAuthenticate, verifyUserAuthorization(["sale"]))
deliveriesRoutes.post("/",deliveriesController.create)
deliveriesRoutes.get("/",deliveriesController.index)

export { deliveriesRoutes}