const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');


router.get('/girisYap', (req, res) => {
    res.render("ueye/girisYap");
})

router.post('/girisYap', passport.authenticate('local', { failureFlash: true, failureRedirect: '/girisYap', keepSessionInfo: true }), catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const ueyeDB = await Ueye.findOne({ email: email });
    const redirectUrl = req.session.returnTo || '/';
    req.flash('success', 'Hoşgeldiniz ' + ueyeDB.isim + '!');
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}));



router.get('/ueyeOl', (req, res) => {

    res.render("ueye/ueyeOl");
})

router.post('/ueyeOl', catchAsync(async (req, res, next) => {
    try {
        const { isim, soyisim, email, password, ceptelefonu } = req.body;
        const ueye = new Ueye({ isim, soyisim, email, ceptelefonu });
        const kayitUeye = await Ueye.register(ueye, password);
        console.log("kayitUeye:" + kayitUeye);
        req.login(kayitUeye, err => {
            if (err) return next(err);
            req.flash('success', 'Tebrikler ' + kayitUeye.isim + ', ' + 'yeni üye oldunuz!');
            res.redirect('/');
        })
    } catch (e) {
        console.log("Hata: " + e.message);
        req.flash('error', 'Bu email üzerine bir kayit var');
        res.redirect('/ueyeOl');
    }
}));

router.get('/cikis', (req, res, next) => {
    const currentUserName = req.user.isim;
    req.logOut(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Görüşmek üzere ' + currentUserName + '!');
        res.redirect('/');
    });
})

router.get('/hesabim', (req, res) => {

    res.render("ueye/hesabim");
})

router.get('/yorumlarim', (req, res) => {

    res.render("ueye/yorumlarim");
})

router.get('/ueyelikBilgilerim', (req, res) => {

    res.render("ueye/ueyelikBilgilerim");
})

router.get('/adreslerim', (req, res) => {

    res.render("ueye/adreslerim");
})

router.get('/favorilerim', (req, res) => {

    res.render("ueye/favorilerim");
})

router.get('/alisverisSepetiFatura', (req, res) => {

    res.render("ueye/alisverisSepetiFatura");
})

router.get('/alisverisSepetiOedeme', (req, res) => {

    res.render("ueye/alisverisSepetiOedeme");
})

router.post('/sepeteEkle', catchAsync(async (req, res, next) => {
    // if (!req.isAuthenticated()) {
    const ueruenID = req.body.ueruenID;
    if (!req.session.ueruenIDs) {
        req.session.ueruenIDs = [];
    }
    req.session.ueruenIDs.push(ueruenID);
    res.redirect('/alisverisSepeti');
}))

router.get('/alisverisSepeti', catchAsync(async (req, res) => {
    let ueruenler = [];

    if (req.session.ueruenIDs) {
        const ueruenIDs = req.session.ueruenIDs;
        for (let id of ueruenIDs) {
            ueruen = await UeruenGiyim.findById(id);
            ueruenler.push(ueruen);
        }
    }

    res.render("ueye/alisverisSepeti", { ueruenler });
}))

router.post('/alisverisSepeti', catchAsync(async (req, res) => {
    const idToRemove = req.body.ueruenID;
    console.log("idToRemove = " + idToRemove);
    const ueruenToRemove = await UeruenGiyim.findById(idToRemove);
    console.log("Ürün To Remove: " + ueruenToRemove);

    if (req.session.ueruenIDs && idToRemove) {
        req.session.ueruenIDs = req.session.ueruenIDs.filter((ueruenID) => ueruenID !== idToRemove);
    }
    res.redirect('/alisverisSepeti');
}))

module.exports = router;