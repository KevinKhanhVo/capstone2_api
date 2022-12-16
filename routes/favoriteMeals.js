const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');
const { loginRequired, authUser } = require('../middleware/auth');

/**
 * GET /favorite/ => { favoriteMeals object }
 * Retrieve all meals that are favorited by user.
 * Only users who are authenticated and logged in can view all their favorites.
 * 
 * Return an object of all favorite meals.
 */
 router.get('/', authUser, loginRequired, async (req, res, next) => {
    try{
        const results = await db.query(
            `SELECT meal_id
            FROM favoritemeal
            WHERE favoritemeal.user_id = $1
            ORDER BY meal_id`, [req.current_user_id]
        );

        return res.json(results.rows);
    } catch(err){
        return next(new ExpressError("Cannot retrieve favorite meals"), 401);
    }
})

/**
 * POST /favorite/:meal_id => { message }
 * Add meal to favorite list for user. 
 * Only users who are authenticated and logged in can favorite their meals.
 * 
 * Return message message.
 */

 router.post('/:meal_id', authUser, loginRequired, async (req, res, next) => {
    try{
        const meal_id = req.params.meal_id;
        
        const current_favorite = await db.query(
            `SELECT id, user_id, meal_id 
            FROM favoritemeal
            WHERE user_id = $1
            AND meal_id = $2`, 
            [req.current_user_id, meal_id]
        );

        if(current_favorite.rows.length > 0){
            return next(new ExpressError("Meal already favorited"), 401);

        }else{
            await db.query(
                `INSERT INTO favoritemeal (user_id, meal_id) VALUES ($1, $2)`, 
                [req.current_user_id, meal_id]);
        }

        return res.json({ message: "Meal favorited!" });
    } catch(err){
        return next(new ExpressError("Cannot favorite meal"), 401);
    }
})

/**
 * DELETE /favorite/:meal_id => { message }
 * Unfavorite meals. 
 * Only users who are authenticated and logged in can unfavorite their meals.
 * 
 * Return message message.
 */

 router.delete('/:meal_id', authUser, loginRequired, async (req, res, next) => {
    try{
        const meal_id = req.params.meal_id;

        await db.query(
            `DELETE FROM favoritemeal 
            WHERE user_id = $1
            AND meal_id = $2`, 
            [req.current_user_id, meal_id]);

        return res.json({ message: "Unfavorited meal" });
    } catch(err){
        return next(new ExpressError("Cannot delete meal"), 401);
    }
})

module.exports = router;