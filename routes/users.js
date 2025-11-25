const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Validation tools
const { check, validationResult } = require('express-validator');

// Access control
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login');
    } else {
        next();
    }
};

// Records a login attempt in the audit log
function logLoginAttempt(username, status) {
    const sqlquery = "INSERT INTO audit_log (username, status) VALUES (?, ?)";
    db.query(sqlquery, [username, status], (err) => {
        if (err) {
            console.error("Audit log insertion error:", err);
        }
    });
}

// ROUTE: Register Page 
router.get('/register', function (req, res, next) {
    res.render('register', {
        errors: [],
        formData: {}
    });
});

// ROUTE: Handle Registration + Validation + Sanitisation + Password Hashing
router.post(
    '/registered',

    // Validation rules
    [
        check('email').isEmail().withMessage("Invalid email format"),
        check('username')
            .isLength({ min: 5, max: 20 })
            .withMessage("Username must be 5–20 characters"),
        check('password')
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters")
    ],

    function (req, res, next) {

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.render('register', { 
                errors: errors.array(),
                formData: req.body
            });
        }

        // Sanitise inputs 
        const cleanFirst = req.sanitize(req.body.first);
        const cleanLast = req.sanitize(req.body.last);
        const cleanEmail = req.sanitize(req.body.email);
        const cleanUsername = req.sanitize(req.body.username);

        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
            if (err) return next(err);

            const sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)";
            const newRecord = [
                cleanUsername,
                cleanFirst,
                cleanLast,
                cleanEmail,
                hashedPassword
            ];

            db.query(sqlquery, newRecord, (err, result) => {
                if (err) return next(err);

                res.send(
                    `Hello ${cleanFirst} ${cleanLast}, you are now registered!`
                );
            });
        });
    }
);

// ROUTE: List all users 
router.get('/list', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT id, username, first_name, last_name, email FROM users";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        const users = result.map(user => ({
            id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email
        }));

        res.render("listusers", { availableUsers: users });
    });
});

// ROUTE: Display Login Form
router.get('/login', function (req, res, next) {
    res.render('login');
});

// ROUTE: Handle Login Verification
router.post('/loggedin', function (req, res, next) {
    const username = req.body.username;
    const plainPassword = req.body.password;

    const sqlquery = "SELECT hashed_password FROM users WHERE username = ?";
    
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            logLoginAttempt(username, 'FAILURE');
            return next(err);
        }

        if (result.length === 0) {
            logLoginAttempt(username, 'FAILURE');
            return res.send("Login failed: Username not found.");
        }

        const hashedPassword = result[0].hashed_password;
        
        bcrypt.compare(plainPassword, hashedPassword, function(err, compareResult) {
            if (err) {
                logLoginAttempt(username, 'FAILURE');
                return next(err);
            }

            if (compareResult === true) {
                req.session.userId = username;

                logLoginAttempt(username, 'SUCCESS'); 
                res.send(`Login Successful! Welcome back, ${username}.`);
            } else {
                logLoginAttempt(username, 'FAILURE'); 
                res.send("Login failed: Incorrect password.");
            }
        });
    });
});

// ROUTE: Display Audit Log 
router.get('/audit', redirectLogin, function(req, res, next) {
    const sqlquery = "SELECT id, username, status, attempt_time FROM audit_log ORDER BY attempt_time DESC";

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);

        const auditRecords = result.map(record => ({
            id: record.id,
            username: record.username,
            status: record.status,
            time: record.attempt_time
        }));

        res.render("audit", { auditRecords: auditRecords });
    });
});

// Export the router object
module.exports = router;


