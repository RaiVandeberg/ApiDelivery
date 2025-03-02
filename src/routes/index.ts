import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { deliveriesRoutes } from "./deliveries-routes";
import { deliveryLogsRoutes } from "./delivery-logs";

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/deliveries", deliveriesRoutes)
routes.use("/delivery-logs", deliveryLogsRoutes)

export { routes}