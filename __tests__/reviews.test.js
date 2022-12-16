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

describe("GET /reviews/:meal_id", function(){
    test("should be able to retrieve all reviews for a meal.", async function(){
        const resp = await request(app)
        .get("/reviews/53065")

        expect(resp.statusCode).toEqual(200);
    })
})

describe("POST /reviews/:meal_id", function(){
    test("add a new review.", async function(){
        const resp = await request(app)
        .post("/reviews/53065")
        .set("Authorization", `${token}`)
        .send({
            comment: "GREAT RECIPE AND FOOD!",
            rating: 5
        })

        expect(resp.statusCode).toEqual(200);
        expect(resp.body.message).toEqual('Review successfully added.');
    })

    test("missing comment / rating should error.", async function(){
        const resp = await request(app)
        .post("/reviews/53065")
        .set("Authorization", `${token}`)
        .send({
            rating: 5
        })

        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('Please fill out comment and rating.');
    })
})

describe("DELETE /reviews/:meal_id", function(){
    test("should be able to delete review.", async function(){
        const resp = await request(app)
        .delete("/reviews/53065")
        .set("Authorization", `${token}`)

        expect(resp.statusCode).toEqual(200);
    })
})

afterEach(async function (){
    await db.query("DELETE FROM review");
})

afterAll(async function(){
    await db.end();
})