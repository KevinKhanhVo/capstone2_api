process.env.NODE_ENV = "test";
const request = require('supertest');

const db = require("../db.js");
const app = require("../app.js")

describe("GET /meals/", function(){
    test("retrieve all meals", async function(){
        const resp = await request(app).get('/meals/')

        expect(resp.statusCode).toEqual(200);
    })

    test("retrieve a meal by id", async function(){
        const resp = await request(app).get('/meals/53032')

        expect(resp.statusCode).toEqual(200);
    })

    test("retrieve a meal by name", async function(){
        const resp = await request(app).get('/meals/sushi')

        expect(resp.statusCode).toEqual(200);
    })
})

afterEach(async function (){
    await db.query("DELETE FROM users");
})

afterAll(async function(){
    await db.end();
})