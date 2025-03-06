"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/delivery-logs.ts
var delivery_logs_exports = {};
__export(delivery_logs_exports, {
  deliveryLogsRoutes: () => deliveryLogsRoutes
});
module.exports = __toCommonJS(delivery_logs_exports);
var import_express = require("express");

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

// src/middlewares/ensure-authenticate.ts
var import_jsonwebtoken = require("jsonwebtoken");

// src/env.ts
var import_zod2 = require("zod");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var envSchema = import_zod2.z.object({
  DATABASE_URL: import_zod2.z.string().url(),
  JWT_SECRET: import_zod2.z.string(),
  PORT: import_zod2.z.coerce.number().default(3333)
});
var env = envSchema.parse(process.env);

// src/configs/auth.ts
var authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d"
  }
};

// src/middlewares/ensure-authenticate.ts
function ensureAuthenticate(requeste, response, next) {
  try {
    const authHeader = requeste.headers.authorization;
    if (!authHeader) {
      throw new AppError("JWT token n\xE3o autorizado", 401);
    }
    const [, token] = authHeader.split(" ");
    const { role, sub: user_id } = (0, import_jsonwebtoken.verify)(token, authConfig.jwt.secret);
    requeste.user = {
      id: user_id,
      role
    };
    return next();
  } catch (error) {
    throw new AppError("Token invalido", 401);
  }
}

// src/middlewares/verifyUserAuthorization.ts
function verifyUserAuthorization(role) {
  return (request, response, next) => {
    if (!request.user) {
      throw new AppError("Usu\xE1rio n\xE3o autorizado", 401);
    }
    if (!role.includes(request.user.role)) {
      throw new AppError("Usu\xE1rio n\xE3o autorizado", 401);
    }
    return next();
  };
}

// src/routes/delivery-logs.ts
var deliveryLogsRoutes = (0, import_express.Router)();
var deliveryLogsConstroller = new DeliveryLogsConstroller();
deliveryLogsRoutes.post(
  "/",
  ensureAuthenticate,
  verifyUserAuthorization(["sale"]),
  deliveryLogsConstroller.create
);
deliveryLogsRoutes.get(
  "/:delivery_id/show",
  ensureAuthenticate,
  verifyUserAuthorization(["sale", "customer"]),
  deliveryLogsConstroller.show
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deliveryLogsRoutes
});
