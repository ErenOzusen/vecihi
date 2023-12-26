const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const Rating = require('../models/rating');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');

router.get('/', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const erkekUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'erkekGiyim' || ueruen.kategori === 'unisexGiyim');
    res.render("ueruenler/tuemUeruen", { erkekUeruenler });
}))

router.get('/tshirt', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const erkekUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'erkekGiyim' || ueruen.kategori === 'unisexGiyim');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }

    res.render("ueruenler/giyim/tshirt", { erkekUeruenler, isAdmin });
}))

router.get('/sapka', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const erkekUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'erkekGiyim' || ueruen.kategori === 'unisexGiyim');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }
    res.render("ueruenler/giyim/sapka", { erkekUeruenler, isAdmin });
}))

router.get('/canta', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const erkekUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'erkekGiyim' || ueruen.kategori === 'unisexGiyim');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }
    res.render("ueruenler/giyim/canta", { erkekUeruenler, isAdmin });
}))


router.get('/:id/detay', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ratingUeruenDB = await Rating.find({ ueruenGiyim: id }).populate('ueye');
    const ueruen = await UeruenGiyim.findById(id);
    res.render("ueruenler/ueruenDetay", { ueruen, ratingUeruenDB });
}))

module.exports = router;