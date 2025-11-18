# Insert data into the tables

USE berties_books;

INSERT INTO users (username, first_name, last_name, email, hashed_password)
VALUES ('gold', 'Gillian', 'Oldman', 'gold@bertiesbooks.com', '$2b$10$OgykfOmqHZXaOUmJgc8IF.GMJQw2C8BWuMcqwlNMcP/VnfnntA6hq');

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;