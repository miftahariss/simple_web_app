CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  age INTEGER,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  hobby_id INTEGER REFERENCES hobbies(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hobbies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  active BOOLEAN
);