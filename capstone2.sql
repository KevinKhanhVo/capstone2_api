\echo 'Delete and recreate capstone2 db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE capstone2;
CREATE DATABASE capstone2;
\connect capstone2;

\i jobly-schema.sql