const express = require('express');
const ExpressError = require('./expressError');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/users');
const mealRoutes = require('./routes/meals');
const ingredientRoutes = require('./routes/ingredients');
const reviewRoutes = require('./routes/reviews');
const favoriteMealRoutes = require('./routes/favoriteMeals');

app.use("/users", userRoutes);
app.use("/meals", mealRoutes);
app.use("/ingredients", ingredientRoutes);
app.use("/reviews", reviewRoutes);
app.use("/favorites", favoriteMealRoutes);

//404 Handler
app.use(function(req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});

//General error handler
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });

module.exports = app;