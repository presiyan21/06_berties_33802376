# Insert data into the tables

USE berties_books;

INSERT INTO users (username, first_name, last_name, email, hashed_password)
VALUES ('gold', 'Gillian', 'Oldman', 'gold@bertiesbooks.com', '$2b$10$VBXYGfsxWAqfGo3ex8P7SexNgAxvsh1HjxYJZV9vy5nXTS70L3Lp');

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;