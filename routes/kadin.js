const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');

router.get('/', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const kadinUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'kadinGiyim');

    res.render("ueruenler/tuemUeruen", { kadinUeruenler });
}))

router.get('/:id/detay', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ueruen = await UeruenGiyim.findById(id);
    res.render("ueruenler/ueruenDetay", { ueruen });
}))

router.get('/tshirt', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const kadinUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'kadinGiyim' || ueruen.kategori === 'unisexGiyim');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }

    res.render("ueruenler/giyim/tshirt", { kadinUeruenler, isAdmin });
}))

router.get('/sapka', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const kadinUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'kadinGiyim' || ueruen.kategori === 'unisexGiyim');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }
    res.render("ueruenler/giyim/sapka", { kadinUeruenler, isAdmin });
}))

router.get('/canta', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const kadinUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'kadinGiyim' || ueruen.kategori === 'unisexGiyim');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }
    res.render("ueruenler/giyim/canta", { kadinUeruenler, isAdmin });
}))


module.exports = router;