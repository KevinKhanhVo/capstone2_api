process.env.NODE_ENV = "test";
const request = require('supertest');
const db = require("../db.js");
const app = require("../app.js")

let token;

beforeAll(async () =>{
    const resp = await request(app)
        .post("/users/register")
        .send({
            username: "reviewUser1",
            password: "password",
            firstName: "f1",
            lastName: "l1"
        })
    token = resp.body.token;
})

describe("GET /reviews/:meal_id", function(){
    test("should be able to retrieve all reviews for a meal.", async function(){
        const resp = await request(app)
        .get("/reviews/53065")

        expect(resp.statusCode).toEqual(200);
    })
})

describe("POST /reviews/:username/:meal_id", function(){
    test("add a new review.", async function(){
        const resp = await request(app)
        .post("/reviews/u1/53065")
        .set("Authorization", token)
        .send({
            comment: "GREAT RECIPE AND FOOD!",
            rating: 5
        })

        expect(resp.statusCode).toEqual(200);
        expect(resp.body.message).toEqual('Review successfully added.');
    })
})

describe("DELETE /reviews/:meal_id", function(){
    test("should be able to delete review.", async function(){
        const resp = await request(app)
        .delete("/reviews/u1/53065")
        .set("Authorization", token)

        expect(resp.statusCode).toEqual(200);
    })
})

afterEach(async function (){
    await db.query("DELETE FROM review");
})

afterAll(async function(){
    await db.query("DELETE FROM users WHERE username = 'reviewUser1'");
    await db.end();
})