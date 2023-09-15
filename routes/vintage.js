const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');

router.get('/', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const vintageUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'vintageUeruenler');

    res.render("ueruenler/tuemUeruen", { vintageUeruenler });
}))

router.get('/:id/detay', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ueruen = await UeruenGiyim.findById(id);
    res.render("ueruenler/ueruenDetay", { ueruen });
}))


router.get('/ahsap', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const vintageUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'vintageUeruenler');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }
    res.render("ueruenler/vintage/ahsap", { vintageUeruenler, isAdmin });
}))

router.get('/anahtarlik', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const vintageUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'vintageUeruenler');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }
    res.render("ueruenler/vintage/anahtarlik", { vintageUeruenler, isAdmin });
}))

router.get('/sues', catchAsync(async (req, res, next) => {
    const ueruenler = await UeruenGiyim.find();
    const vintageUeruenler = ueruenler.filter((ueruen) => ueruen.kategori === 'suesueruen');
    const currentUser = req.user;
    const admin = process.env.ADMIN;
    var isAdmin = false;
    if (currentUser !== undefined && admin.match(currentUser.email)) {
        isAdmin = true;
    } else {
        isAdmin = false;
    }
    res.render("ueruenler/vintage/sues", { vintageUeruenler, isAdmin });
}))


module.exports = router;