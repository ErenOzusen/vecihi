const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');

router.get('/', (req, res) => {
    res.render("erkek/erkekGiyim");
})

router.get('/tshirt', (req, res) => {
    const currentUser = req.user;
    res.render("erkek/tshirt", { currentUser });
})

router.get('/:id/yeniUeruen', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const ueyeDB = await Ueye.findById(req.params.id);
    res.render("erkek/yeniUeruen", { ueyeDB });
}))

router.post('/:id/yeniUeruen', isLoggedIn, isAdmin, (req, res) => {
    res.redirect("/");
})

module.exports = router;