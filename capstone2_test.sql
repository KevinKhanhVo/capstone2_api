/**
    # DB SCHEMA FOR TESTING.
*/

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
    username text UNIQUE NOT NULL ,
    password text   NOT NULL,
    firstName text   NOT NULL,
    lastName text NOT NULL
);

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    comment text   NOT NULL,
    rating int   NOT NULL,
    user_id int   NOT NULL REFERENCES users,
    meal_id int   NOT NULL
);

CREATE TABLE favoritemeal (
    id SERIAL PRIMARY KEY,
    user_id int   NOT NULL REFERENCES users,
    meal_id int   NOT NULL
);