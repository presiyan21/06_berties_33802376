# Insert data into the tables

USE berties_books;

INSERT INTO users (username, first_name, last_name, email, hashed_password)
VALUES ('gold', 'Gillian', 'Oldman', 'gold@bertiesbooks.com', '$2b$10$J.ma6fYv6RCFdWQRcSHPMu8jQT.wewDDozK/mTCwwV1PuO76vW5fG');

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;