"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/delivery-logs-controller.ts
var delivery_logs_controller_exports = {};
__export(delivery_logs_controller_exports, {
  DeliveryLogsConstroller: () => DeliveryLogsConstroller
});
module.exports = __toCommonJS(delivery_logs_controller_exports);

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"]
});

// src/utils/AppError.ts
var AppError = class {
  message;
  statusCode;
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/controllers/delivery-logs-controller.ts
var import_zod = require("zod");
var DeliveryLogsConstroller = class {
  async create(request, response) {
    const bodyShema = import_zod.z.object({
      delivery_id: import_zod.z.string().uuid(),
      description: import_zod.z.string()
    });
    const { delivery_id, description } = bodyShema.parse(request.body);
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id }
    });
    if (!delivery) {
      throw new AppError("delivery n\xE3o encontrado", 404);
    }
    if (delivery.status == "delivered") {
      throw new AppError("pedido j\xE1 foi entregue", 401);
    }
    if (delivery.status === "processing") {
      throw new AppError("change status to shipped", 401);
    }
    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description
      }
    });
    return response.status(201).json();
  }
  async show(request, response) {
    const paramSchema = import_zod.z.object({
      delivery_id: import_zod.z.string().uuid()
    });
    const { delivery_id } = paramSchema.parse(request.params);
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: {
        logs: true,
        user: true
      }
    });
    if (request.user?.role === "customer" && request.user.id !== delivery?.userId) {
      throw new AppError("the user can only view thier deliveries", 401);
    }
    return response.json(delivery);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeliveryLogsConstroller
});
