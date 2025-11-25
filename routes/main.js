const express = require("express")
const router = express.Router()

// Access-control middleware for logout
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login')
    } else {
        next()
    }
}

// Home page
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

// About page
router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

// Logout Route
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
        res.send("You are now logged out. <a href='./'>Home</a>");
    })
})

module.exports = router
