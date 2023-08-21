const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');



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
        //emailkiyasla(email);
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

module.exports = router;