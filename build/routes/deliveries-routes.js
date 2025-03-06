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

// src/routes/deliveries-routes.ts
var deliveries_routes_exports = {};
__export(deliveries_routes_exports, {
  deliveriesRoutes: () => deliveriesRoutes
});
module.exports = __toCommonJS(deliveries_routes_exports);
var import_express = require("express");

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"]
});

// src/controllers/deliveries-controller.ts
var import_zod = require("zod");
var DeliveriesController = class {
  async create(requeste, response) {
    const bodySchema = import_zod.z.object({
      user_id: import_zod.z.string().uuid(),
      description: import_zod.z.string()
    });
    const { user_id, description } = bodySchema.parse(requeste.body);
    await prisma.delivery.create({
      data: {
        userId: user_id,
        description
      }
    });
    return response.status(201).json();
  }
  async index(requeste, response) {
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: { select: { name: true, email: true } }
      }
    });
    return response.json(deliveries);
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

// src/utils/AppError.ts
var AppError = class {
  message;
  statusCode;
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
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

// src/controllers/deliveries-status-controller.ts
var import_zod3 = require("zod");
var DeliveriesStatusController = class {
  async update(request, response) {
    const paramsShema = import_zod3.z.object({
      id: import_zod3.z.string().uuid()
    });
    const bodySchema = import_zod3.z.object({
      status: import_zod3.z.enum(["processing", "shipped", "delivered"])
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

// src/routes/deliveries-routes.ts
var deliveriesRoutes = (0, import_express.Router)();
var deliveriesController = new DeliveriesController();
var deliveriesStatusController = new DeliveriesStatusController();
deliveriesRoutes.use(ensureAuthenticate, verifyUserAuthorization(["sale"]));
deliveriesRoutes.post("/", deliveriesController.create);
deliveriesRoutes.get("/", deliveriesController.index);
deliveriesRoutes.patch("/:id/status", deliveriesStatusController.update);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deliveriesRoutes
});
