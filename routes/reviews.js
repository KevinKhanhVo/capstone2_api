const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');
const { loginRequired } = require('../middleware/auth');

/**
 * GET /reviews/:meal_id => { reviews }
 * Retrieve all reviews for a meal.
 * 
 * Return an object of all reviews
 */
 router.get('/:meal_id', async (req, res, next) => {
    try{
        const meal_id = req.params.meal_id;

        const results = await db.query(
            `SELECT c.comment, c.rating, c.user_id, c.meal_id, u.username, u.firstName, u.lastName 
            FROM review c
            JOIN users u
            ON c.user_id = u.id
            WHERE meal_id = $1`, [meal_id]
        );

        return res.json(results.rows);
    } catch(err){
        return next(new ExpressError("Cannot retrieve reviews", 401));
    }
})

/**
 * POST /reviews/:meal_id => { message }
 * Add a new review for the meal.
 * Only users who are authenticated and logged in can add/update their reviews.
 * 
 * Return message object.
 */

 router.post('/:meal_id', loginRequired, async (req, res, next) => {
    try{
        const { comment, rating } = req.body;

        const meal_id = req.params.meal_id;

        const current_review = await db.query(
            `SELECT user_id, meal_id 
            FROM review
            WHERE user_id = $1
            AND meal_id = $2`, 
            [req.current_user_id, meal_id]
        );

        if(current_review.rows.length > 0){
            return next(new ExpressError("You have already written a review for this meal."), 401);
        }

        if(!comment || !rating){
            return next(new ExpressError("Please fill out comment and rating."), 401);
        }else{
            await db.query(
                `INSERT INTO review (comment, rating, user_id, meal_id) 
                VALUES ($1, $2, $3, $4)`, 
                [comment, rating, req.current_user_id, meal_id]);
        }

        return res.json({ message: "Review successfully added." });
    } catch(err){
        return next(new ExpressError("We are unable to process your review."), 401);
    }
})

/**
 * DELETE /reviews/:meal_id => { message }
 * Delete review from logged in user on a specific meal.
 * Only users who are authenticated and logged in can delete their reviews.
 * 
 * Return message object.
 */

router.delete('/:meal_id', loginRequired, async (req, res, next) => {
    try{
        const meal_id = req.params.meal_id;

        await db.query(
            `DELETE 
            FROM review
            WHERE user_id = $1
            AND meal_id = $2`,
            [req.current_user_id, meal_id]);

        return res.json({ message: "Successfully removed review." });
    } catch(err){
        return next(new ExpressError("We were unable to process your removal request."), 401);
    }
})

module.exports = router;