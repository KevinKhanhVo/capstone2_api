const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

/** GET /  =>
 *   { meals: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */
 router.get('/', async (req, res, next) => {
    const { name } = req.query;
    let url = name === undefined ? 
        `https://www.themealdb.com/api/json/v1/1/search.php?s=` 
    : 
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}` ;

    const options = {
		    method: 'GET'
    }

    fetch(url, options)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));

    try{
        let response = await fetch(url, options);
        response = await response.json();

        return res.json(response);
    }catch(err){
        return next(new ExpressError("Cannot fetch data .."), 404);
    }
})

/**
 * GET /meals/:id => { meal }
 * Retrieve a meal by id.
 * 
 * Return an object of the meal.
 */
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const options = {
        method: 'GET'
    }

    fetch(url, options)
		.then(res => res.json())
		.catch(err => console.error('error:' + err));

    try{
        let response = await fetch(url, options);
        response = await response.json();

        return res.json(response);
    }catch(err){
        return next(new ExpressError("Cannot fetch data .."), 404);
    }
})

module.exports = router;