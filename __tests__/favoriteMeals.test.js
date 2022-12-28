process.env.NODE_ENV = "test";
const request = require('supertest');
const db = require("../db.js");
const app = require("../app.js")

let token;

beforeEach(async () =>{
    const resp = await request(app)
        .post("/users/register")
        .send({
            username: "favoriteUser1",
            password: "password",
            firstName: "f1",
            lastName: "l1"
        })
    token = resp.body.token;
})

describe("GET /favorites/:username", function(){
    test("should not be able to retrieve favorite if unauthenticated.", async function(){
        const resp = await request(app)
        .get("/favorites/u1")

        expect(resp.statusCode).toEqual(401);
    })

    test("retrieve favorite after authenticated.", async function(){
        const resp = await request(app)
        .get("/favorites/u1")
        .set("Authorization", token)

        expect(resp.statusCode).toEqual(201);
    })
})

describe("POST /favorites/:username/:meal_id", function(){
    test("favorite a meal favorite after authenticated.", async function(){
        const resp = await request(app)
        .post("/favorites/u1/53065")
        .set("Authorization", token)

        expect(resp.statusCode).toEqual(200);
        expect(resp.body.message).toEqual('Meal favorited!');
    })
})

describe("DELETE /favorites/:username/:meal_id", function(){
    test("unfavorite a favorited meal.", async function(){
        const resp = await request(app)
        .delete("/favorites/u1/53065")
        .set("Authorization", `${token}`)

        expect(resp.statusCode).toEqual(200);
        expect(resp.body.message).toEqual('Unfavorited meal');
    })
})

afterEach(async function (){
    await db.query("DELETE FROM favoritemeal");
})

afterAll(async function(){
    await db.query("DELETE FROM users WHERE username = 'favoriteUser1'");
    await db.end();
})