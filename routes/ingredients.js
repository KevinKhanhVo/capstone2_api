const express = require('express');
const router = express.Router();
const ExpressError = require('../expressError');

/**
 * GET /ingredients/:name => { ingredient }
 * Retrieve an ingredient.
 * 
 * Return an object of ingredient.
 */
 router.get('/:name', async (req, res, next) => {
    const name = req.params.name;

    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`;
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