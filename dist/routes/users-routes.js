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

// src/routes/users-routes.ts
var users_routes_exports = {};
__export(users_routes_exports, {
  usersRoutes: () => usersRoutes
});
module.exports = __toCommonJS(users_routes_exports);
var import_express = require("express");

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"]
});

// src/controllers/users-controller.ts
var import_bcrypt = require("bcrypt");
var import_zod = require("zod");

// src/utils/AppError.ts
var AppError = class {
  message;
  statusCode;
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/controllers/users-controller.ts
var UsersController = class {
  async create(request, response) {
    const bodySchema = import_zod.z.object({
      name: import_zod.z.string().trim().min(3),
      email: import_zod.z.string().email(),
      password: import_zod.z.string().min(6)
    });
    const { name, email, password } = bodySchema.parse(request.body);
    const userWithSameEmail = await prisma.user.findFirst({
      where: { email }
    });
    if (userWithSameEmail) {
      throw new AppError("J\xE1 tem um usu\xE1rio com este email", 400);
    }
    const hashedPassword = await (0, import_bcrypt.hash)(password, 8);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    const { password: _, ...userWithouPassword } = user;
    return response.status(201).json(userWithouPassword);
  }
};

// src/routes/users-routes.ts
var usersRoutes = (0, import_express.Router)();
var usersController = new UsersController();
usersRoutes.post("/", usersController.create);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usersRoutes
});
