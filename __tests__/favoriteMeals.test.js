process.env.NODE_ENV = "test";
const request = require('supertest');
const db = require("../db.js");
const app = require("../app.js")

let token;

beforeAll(() =>{
    request(app)
        .post("/users/login")
        .send({
            "username": "u1",
            "password": "p1"
        })
        .end((err, response) => {
            token = response.body.token;
        });
})

describe("GET /favorites/", function(){
    test("should not be able to retrieve favorite if unauthenticated.", async function(){
        const resp = await request(app)
        .get("/favorites")

        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('Login required.');
    })

    test("retrieve favorite after authenticated.", async function(){
        const resp = await request(app)
        .get("/favorites")
        .set("Authorization", `${token}`)

        expect(resp.statusCode).toEqual(200);
    })
})

describe("POST /favorites/:meal_id", function(){
    test("favorite a meal favorite after authenticated.", async function(){
        const resp = await request(app)
        .post("/favorites/53065")
        .set("Authorization", `${token}`)

        expect(resp.statusCode).toEqual(200);
        expect(resp.body.message).toEqual('Meal favorited!');
    })
})

describe("DELETE /favorites/:meal_id", function(){
    test("unfavorite a favorited meal.", async function(){
        const resp = await request(app)
        .delete("/favorites/53065")
        .set("Authorization", `${token}`)

        expect(resp.statusCode).toEqual(200);
        expect(resp.body.message).toEqual('Unfavorited meal');
    })
})

afterEach(async function (){
    await db.query("DELETE FROM favoritemeal");
})

afterAll(async function(){
    await db.end();
})