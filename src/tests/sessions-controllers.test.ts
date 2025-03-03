import request from "supertest";

import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("SessionsController", ()=>{

    let user_id: string

    afterAll(async () =>{
        await prisma.user.delete({
            where: { id: user_id }
        })
    })

    it("shoul authenticate a and get acces token", async () =>{
        const user = await request(app).post("/users").send({
            name: "Teste User",
            email: "testeuser@gmail.com",
            password: "password123",
        })

        user_id = user.body.id

        const sessions = await request(app).post("/sessions").send({
            email: "testeuser@gmail.com",
            password: "password123",
        })

        expect(sessions.status).toBe(200)
        expect(sessions.body.token).toEqual(expect.any(String))
    })
})