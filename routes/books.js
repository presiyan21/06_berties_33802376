const express = require("express");
const router = express.Router();

// Route: List all books
router.get('/list', function(req, res, next) {
    const sqlquery = "SELECT * FROM books";

    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return next(err);
        }

        const books = result.map(book => ({
            ...book,
            price: Number(book.price)
        }));

        res.render("list", { availableBooks: books });
    });
});

// Route: Bargain books (< £20)
router.get('/bargainbooks', function(req, res, next) {
    const sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        const books = result.map(book => ({
            ...book,
            price: Number(book.price)
        }));

        res.render("list", { availableBooks: books });
    });
});

// Route: Search page
router.get('/search', function(req, res, next) {
    res.render("search.ejs");
});

// Route: Search result (advanced search, partial match)
router.get('/search-result', function(req, res, next) {
    const keyword = req.query.keyword;
    const sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    const searchTerm = `%${keyword}%`;

    db.query(sqlquery, [searchTerm], (err, result) => {
        if (err) return next(err);

        const books = result.map(book => ({
            ...book,
            price: Number(book.price)
        }));

        res.render("list", { availableBooks: books });
    });
});

// Route: Show add book form
router.get('/addbook', function(req, res, next) {
    res.render("addbook"); 
});

// Route: Handle form submission and save to database
router.post('/bookadded', function(req, res, next) {
    const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    const newRecord = [req.body.name, req.body.price];

    db.query(sqlquery, newRecord, (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return next(err);
        }

        res.send(
            `This book is added to database, name: ${req.body.name}, price: ${req.body.price}`
        );
    });
});

module.exports = router;




