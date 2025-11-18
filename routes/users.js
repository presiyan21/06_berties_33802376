const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt') 
const saltRounds = 10 

// Records a login attempt in the audit log
function logLoginAttempt(username, status) {
    const sqlquery = "INSERT INTO audit_log (username, status) VALUES (?, ?)";
    // 'db' is available globally
    db.query(sqlquery, [username, status], (err) => {
        if (err) {
            console.error("Audit log insertion error:", err);
        }
    });
}

// ROUTE: Register Page 
router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

// ROUTE: Handle Registration and Password Hashing 
router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            console.error("Bcrypt hashing error:", err);
            return next(err); 
        }

        const sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)";
        const newRecord = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ];

        db.query(sqlquery, newRecord, (err, result) => {
            if (err) {
                console.error("Database insert error:", err);
                return next(err);
            }

            let resultText = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered! We will send an email to you at ' + req.body.email + '.';
            resultText += ' Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword;
            
            res.send(resultText);
        });
    });
});

// ROUTE: List all users
router.get('/list', function(req, res, next) {
    const sqlquery = "SELECT id, username, first_name, last_name, email FROM users";

    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return next(err);
        }

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
    res.render('login.ejs')
})


// ROUTE: Handle Login Verification
router.post('/loggedin', function (req, res, next) {
    const username = req.body.username;
    const plainPassword = req.body.password;

    const sqlquery = "SELECT hashed_password FROM users WHERE username = ?";
    
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            logLoginAttempt(username, 'FAILURE'); 
            return next(err);
        }

        // User not found
        if (result.length === 0) {
            logLoginAttempt(username, 'FAILURE'); 
            return res.send("Login failed: Username not found.");
        }

        const hashedPassword = result[0].hashed_password;
        
        // Compare the password
        bcrypt.compare(plainPassword, hashedPassword, function(err, compareResult) {
            if (err) {
                console.error("Bcrypt comparison error:", err);
                logLoginAttempt(username, 'FAILURE');
                return next(err); 
            }

            if (compareResult === true) {
                // Login successful
                logLoginAttempt(username, 'SUCCESS'); 
                res.send(`Login Successful! Welcome back, ${username}.`);
            } else {
                // Login failed (passwords do not match)
                logLoginAttempt(username, 'FAILURE'); 
                res.send("Login failed: Incorrect password.");
            }
        });
    });
});


// NEW ROUTE: Display Audit Log
router.get('/audit', function(req, res, next) {
    const sqlquery = "SELECT id, username, status, attempt_time FROM audit_log ORDER BY attempt_time DESC";

    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error("Audit query error:", err);
            return next(err);
        }

        const auditRecords = result.map(record => ({
            id: record.id,
            username: record.username,
            status: record.status,
            time: record.attempt_time
        }));

        res.render("audit", { auditRecords: auditRecords });
    });
});


// Export the router object so index.js can access it
module.exports = router