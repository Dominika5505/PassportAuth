const router = require('express').Router();
const {
    registerValidation,
    loginValidation
} = require('../validation');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Register Page
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
    let errors = [];

    // Validate
    const {
        error
    } = registerValidation(req.body);
    if (error) {
        errors.push({
            msg: error.details[0].message
        })
    }

    if (req.body.password !== req.body.password2) {
        errors.push({
            msg: 'Passwords do not match!'
        })
    }

    const emailExists = await User.findOne({
        email: req.body.email
    });
    if (emailExists) {
        errors.push({
            msg: 'Email is already registered!'
        });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        });
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save()
            .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login')
            }).catch(err => console.log(err));
    }

});

// Login Page
router.get('/login', (req, res) => res.render('Login'));

router.post('/login', async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Page
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login');
});

module.exports = router;