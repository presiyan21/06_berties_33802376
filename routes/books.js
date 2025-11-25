const express = require("express");
const router = express.Router();

// Access control — restrict adding books to logged-in users
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login')
    } else {
        next()
    }
}

// Route: List all books (public)
router.get('/list', function(req, res, next) {
    const sqlquery = "SELECT * FROM books";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        const books = result.map(book => ({
            ...book,
            price: Number(book.price)
        }));

        res.render("list", { availableBooks: books });
    });
});

// Route: Bargain books (public)
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

// Route: Search page (public)
router.get('/search', function(req, res, next) {
    res.render("search.ejs");
});

// Route: Search result (public)
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

// Protected Route: Show add book form
router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render("addbook"); 
});

// Protected Route: Handle add book form with sanitisation
router.post('/bookadded', redirectLogin, function(req, res, next) {
    // Sanitise the book name to prevent XSS
    const cleanName = req.sanitize(req.body.name);
    const price = req.body.price;

    const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    const newRecord = [cleanName, price];

    db.query(sqlquery, newRecord, (err, result) => {
        if (err) return next(err);

        res.send(
            `This book is added to database, name: ${cleanName}, price: ${price}`
        );
    });
});

module.exports = router;





