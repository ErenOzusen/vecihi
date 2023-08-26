const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');

router.get('/', (req, res) => {
    res.render("erkek/erkekGiyim");
})

router.get('/:id/yeniUeruen', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const ueyeDB = await Ueye.findById(req.params.id);
    res.render("erkek/yeniUeruen", { ueyeDB });
}))

router.post('/:id/yeniUeruen', isLoggedIn, isAdmin, (req, res) => {
    res.redirect("/");
})

router.get('/tshirt', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const currentUser = req.user;
    res.render("erkek/tshirt", { ueruenler });
}))

router.get('/sapka', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    res.render("erkek/sapka", { ueruenler });
}))

router.get('/canta', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    res.render("erkek/canta", { ueruenler });
}))

router.get('/sues', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    res.render("erkek/sues", { ueruenler });
}))

router.get('/:id/detay', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ueruen = await UeruenGiyim.findById(id);
    res.render("erkek/ueruenDetay", { ueruen });
}))



module.exports = router;