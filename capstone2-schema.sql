CREATE TABLE users (
	id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL ,
    password TEXT   NOT NULL,
    firstName TEXT   NOT NULL,
    lastName TEXT NOT NULL
);

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    comment TEXT   NOT NULL,
    rating INTEGER   NOT NULL,
    user_id INTEGER   NOT NULL REFERENCES users ON DELETE CASCADE,
    meal_id INTEGER   NOT NULL
);

CREATE TABLE favoritemeal (
    id SERIAL PRIMARY KEY,
    user_id INTEGER   NOT NULL REFERENCES users ON DELETE CASCADE,
    meal_id INTEGER   NOT NULL
);