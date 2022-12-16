const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');
const { loginRequired } = require('../middleware/auth');
const jsonschema = require("jsonschema");
const userRegisterSchema = require("../schemas/userRegister.json");
const userLoginSchema = require("../schemas/userLogin.json");

const bcrypt = require('bcrypt')
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config')
const jwt = require('jsonwebtoken');

/**
 * POST /user/register => { message }
 * Registration for new users. 
 * 
 * Returns authenticated token and redirect to login page.
 */
router.post('/register', async (req, res, next) => {
    try{
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            return next(new ExpressError(errs, 401));
        }

        const { username, password, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
    
        const newUser = await db.query(
            `INSERT INTO users (username, password, firstName, lastName)
            VALUES ($1, $2, $3, $4)`, 
            [username, hashedPassword, firstName, lastName]);

        let token = jwt.sign({ username }, SECRET_KEY);
        return res.status(201).json({ token });
    }catch(err){
        if(err.code === '23505'){
            return next(new ExpressError("Username is taken. Please choose another username.", 400));
        }
    }
})

/**
 * POST /user/login => { user, token }
 * Registration for new users. 
 * 
 * Returns authenticated token and redirect to user page.
 */
router.post('/login', async (req, res, next) => {
    try{
        const validator = jsonschema.validate(req.body, userLoginSchema);
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            return next(new ExpressError(errs, 401));
        }

        const { username, password } = req.body

        const result = await db.query(
            `SELECT username, password, firstName, lastName 
            FROM users 
            WHERE username = $1`, 
            [username]);
        
        const user = result.rows[0];

        if(user && await bcrypt.compare(password, user.password) === true){
            let token = jwt.sign({ username }, SECRET_KEY);
            return res.status(201).json({ token });
        }

        return next(new ExpressError(["Invalid username / password"], 401));

    }catch(err){
        return next(err);
    }
})

/**
 * GET /user/ => { users }
 * Retrieve all users.
 * 
 * Returns object of all users.
 */
router.get('/', loginRequired, async (req, res, next) => {
    try{
        const results = await db.query(
            `SELECT id, username, name FROM users`
        );

        return res.json(results.rows);
    }catch(err){
        return next(err);
    }
})

module.exports = router;