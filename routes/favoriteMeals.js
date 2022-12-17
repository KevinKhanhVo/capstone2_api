"use strict";

const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');
const { loginRequired } = require('../middleware/auth');

/**
 * GET /favorite/:username => { favoriteMeals object }
 * Retrieve all meals that are favorited by user.
 * Only users who are authenticated and logged in can view all their favorites.
 * 
 * Return an object of all favorite meals.
 */
 router.get('/:username', loginRequired, async (req, res, next) => {
    try{
        const username = req.params.username;
        const results = await db.query(
            `SELECT meal_id
            FROM favoritemeal
            WHERE favoritemeal.username = $1
            ORDER BY meal_id`, [username]
        );

        return res.status(201).json(results.rows);
    } catch(err){
        return next(new ExpressError("Cannot retrieve favorite meals"), 401);
    }
})

/**
 * POST /favorite/:username/:meal_id => { message }
 * Add meal to favorite list for user. 
 * Only users who are authenticated and logged in can favorite their meals.
 * 
 * Return message message.
 */

 router.post('/:username/:meal_id', loginRequired, async (req, res, next) => {
    try{
        const meal_id = req.params.meal_id;
        const username = req.params.username;
        
        const current_favorite = await db.query(
            `SELECT id, username, meal_id
            FROM favoritemeal
            WHERE username = $1
            AND meal_id = $2`, 
            [username, meal_id]
        );

        if(current_favorite.rows.length > 0){
            return next(new ExpressError("Meal already favorited"), 401);

        }else{
            await db.query(
                `INSERT INTO favoritemeal (username, meal_id) VALUES ($1, $2)`, 
                [username, meal_id]);
        }

        return res.json({ message: "Meal favorited!" });
    } catch(err){
        return next(new ExpressError("Cannot favorite meal"), 401);
    }
})

/**
 * DELETE /favorite/:username/:meal_id => { message }
 * Unfavorite meals. 
 * Only users who are authenticated and logged in can unfavorite their meals.
 * 
 * Return message message.
 */

 router.delete('/:username/:meal_id', loginRequired, async (req, res, next) => {
    try{
        const meal_id = req.params.meal_id;
        const username = req.params.username;

        await db.query(
            `DELETE FROM favoritemeal 
            WHERE username = $1
            AND meal_id = $2`, 
            [username, meal_id]);

        return res.json({ message: "Unfavorited meal" });
    } catch(err){
        return next(new ExpressError("Cannot delete meal"), 401);
    }
})

module.exports = router;