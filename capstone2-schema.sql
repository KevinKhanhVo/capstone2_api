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
    meal_id INTEGER   NOT NULL,
    username TEXT   NOT NULL,
    CONSTRAINT fk_user_review
        FOREIGN KEY(username)
            REFERENCES users(username)

);

CREATE TABLE favoritemeal (
    id SERIAL PRIMARY KEY,
    meal_id INTEGER   NOT NULL,
    username TEXT NOT NULL,
    CONSTRAINT fk_user_favoritemeal
        FOREIGN KEY(username)
            REFERENCES users(username)
);

