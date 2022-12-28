process.env.NODE_ENV = "test";
const request = require('supertest');
const db = require("../db.js");
const app = require("../app.js")

const bcrypt = require('bcrypt');
const { SECRET_KEY } = require('../config')
const jwt = require('jsonwebtoken');

const tokens = {};

beforeEach(async function() {
    async function _pwd(password) {
      return await bcrypt.hash(password, 1);
    }

    function createToken(username) {
        let payload = {username};
        return jwt.sign(payload, SECRET_KEY);
    }
  
    let sampleUsers = [
      [1, "u1", await _pwd("p1"), "f1", "l1"],
      [2, "u2", await _pwd("p2"), "f2", "l2"],
      [3, "u3", await _pwd("p3"), "f3", "l3"]
    ];
  
    for (let user of sampleUsers) {
      await db.query(
        `INSERT INTO users VALUES ($1, $2, $3, $4, $5)`,
        user
      );

      tokens[user[0]] = createToken(user[0]);
    }
  });

describe("POST /users/register", function(){
    test("should be able to register", async function(){
        const resp = await request(app)
        .post("/users/register")
        .send({
            username: "new_user",
            password: "new_password",
            firstName: "new_firstName",
            lastName: "new_lastName"
        });
        expect(resp.statusCode).toEqual(201);
    })

    test("invalid username", async function(){
        const resp = await request(app)
            .post("/users/register")
            .send({
                "password": "test_password",
                "name": "test_name",
            })
        expect(resp.statusCode).toEqual(400);
    })

    test("invalid password", async function(){
        const resp = await request(app)
            .post("/users/register")
            .send({
                "username": "test_username",
                "name": "test_name",
            })
        expect(resp.statusCode).toEqual(400);
    })

    test("should not allow username duplication", async function(){
        const resp = await request(app)
        .post("/users/register")
        .send({
            username: "u1",
            password: "new_password",
            firstName: "new_firstName",
            lastName: "new_lastName"
        });
      expect(resp.statusCode).toBe(400);
      expect(resp.body.error).toEqual({ message: ["Username is taken. Please choose another."], status: 400});

    })
})

describe("POST /users/login", () => {
    test("login should work", async function(){
        const resp = await request(app)
            .post("/users/login")
            .send({
                "username": "u1",
                "password": "p1"
            })
        expect(resp.statusCode).toEqual(201);

        let { username } = jwt.verify(resp.body.token, SECRET_KEY);
        expect(username).toBe("u1");
    })

    test("invalid username / password", async function(){
        const resp = await request(app)
            .post("/users/login")
            .send({
                "username": "u1",
                "password": "wrong_password"
            })
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.error).toEqual({ message: ['Invalid username / password'], status: 400});
    })
})

afterEach(async function (){
    await db.query("DELETE FROM users");
})

afterAll(async function(){
    await db.end();
})