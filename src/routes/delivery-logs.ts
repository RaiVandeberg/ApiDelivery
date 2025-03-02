import { Router } from "express";
import { DeliveryLogsConstroller } from "@/controllers/delivery-logs-controller";   
import { ensureAuthenticate } from "@/middlewares/ensure-authenticate";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveryLogsRoutes = Router()
const deliveryLogsConstroller = new DeliveryLogsConstroller()

deliveryLogsRoutes.post(
    "/", 
    ensureAuthenticate,
    verifyUserAuthorization(["sale"]),
    deliveryLogsConstroller.create)

    export { deliveryLogsRoutes}