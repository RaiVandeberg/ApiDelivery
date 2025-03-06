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

// src/controllers/deliveries-status-controller.ts
var deliveries_status_controller_exports = {};
__export(deliveries_status_controller_exports, {
  DeliveriesStatusController: () => DeliveriesStatusController
});
module.exports = __toCommonJS(deliveries_status_controller_exports);

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"]
});

// src/controllers/deliveries-status-controller.ts
var import_zod = require("zod");
var DeliveriesStatusController = class {
  async update(request, response) {
    const paramsShema = import_zod.z.object({
      id: import_zod.z.string().uuid()
    });
    const bodySchema = import_zod.z.object({
      status: import_zod.z.enum(["processing", "shipped", "delivered"])
    });
    const { id } = paramsShema.parse(request.params);
    const { status } = bodySchema.parse(request.body);
    await prisma.delivery.update({
      data: {
        status
      },
      where: {
        id
      }
    });
    await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description: status
      }
    });
    return response.json();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeliveriesStatusController
});
