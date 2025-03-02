import { Router } from "express";
import { DeliveriesController } from "@/controllers/deliveries-controller";
import { ensureAuthenticate } from "@/middlewares/ensure-authenticate";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller";

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()
const deliveriesStatusController = new DeliveriesStatusController()

deliveriesRoutes.use(ensureAuthenticate, verifyUserAuthorization(["sale"]))
deliveriesRoutes.post("/",deliveriesController.create)
deliveriesRoutes.get("/",deliveriesController.index)
deliveriesRoutes.patch("/:id/status", deliveriesStatusController.update)

export { deliveriesRoutes}