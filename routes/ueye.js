const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/girisYap', (req, res) => {
    res.render("girisYap");
})

router.post('/girisYap', catchAsync(async (req, res) => {
    try {
        const { email, password } = req.body;
        const ueyeDB = await Ueye.findOne({ email: email });
        if (ueyeDB !== null) {
            req.flash('success', 'Hoşgeldiniz!');
            res.redirect(`/${ueyeDB._id}`);
        } else {
            req.flash('error', 'Böyle bir üye yok');
            res.redirect('/ueyeOl');
        }
    } catch (e) {
        console.log("Hata: " + e.mssage);
        req.flash('error', e.message);
    }
}));

router.get('/ueyeOl', (req, res) => {

    res.render("ueyeOl");
})

router.post('/ueyeOl', catchAsync(async (req, res) => {
    try {
        const { isim, soyisim, email, password, ceptelefonu } = req.body;
        //emailkiyasla(email);
        const ueye = new Ueye({ isim, soyisim, email, ceptelefonu });
        const kayitUeye = await Ueye.register(ueye, password);
        console.log("kayitUeye:" + kayitUeye);
        /*         req.login(kayitUeye, err => {
                    if (err) return next(err);
                    req.flash('success', 'You have been Successfully registered');
                    res.redirect('/');
                }) */
        //ueye.save();
        req.flash('success', 'Tebrikler, yeni üye oldunuz!');
        res.redirect('/');
    } catch (e) {
        console.log("Hata: " + e.message);
        req.flash('error', 'Bu email üzerine bir kayit var');
        res.redirect('/ueyeOl');
    }
}));


module.exports = router;