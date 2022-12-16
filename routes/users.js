const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');
const { loginRequired, authUser } = require('../middleware/auth');

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
        const { username, password, firstName, lastName } = req.body;

        if(!username || !password){
            return next(new ExpressError("Username or Password is required.", 400));
        }else{
            const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        
            await db.query(
                `INSERT INTO users (username, password, firstName, lastName)
                VALUES ($1, $2, $3, $4)`, 
                [username, hashedPassword, firstName, lastName]);
            
            
            return res.json({ message: "User registration successful!"});
        }
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
        const { username, password } = req.body

        const result = await db.query(
            `SELECT id, username, password, firstName, lastName FROM users WHERE username = $1`, 
            [username]);
        
        let user = result.rows[0];
        if(user && await bcrypt.compare(password, user.password) === true){
            let user_id = result.rows[0].id
            let token = jwt.sign({ username, user_id }, SECRET_KEY);

            return res.json({ token, 
                id: user.id,
                username: user.username,
                name: user.name
            });
        }

        else{
            throw new ExpressError("Invalid username / password", 400);
        }

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
router.get('/', authUser, loginRequired, async (req, res, next) => {
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