const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const catchAsync = require('../utils/catchAsync');

router.get('/girisYap', (req, res) => {
    res.render("girisYap");
})

router.post('/girisYap', catchAsync(async (req, res) => {
    try {
        const { email, sifre1 } = req.body;
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
        const { isim, soyisim, email, sifre1, ceptelefonu } = req.body;
        //emailkiyasla(email);
        const ueye = new Ueye({ isim, soyisim, email, sifre1, ceptelefonu });
        ueye.save();
        req.flash('success', 'Tebrikler, yeni üye oldunuz!');
        res.redirect('/');
    } catch (e) {
        console.log("Hata: " + e.mssage);
        req.flash('error', e.message);
    }
}));


module.exports = router;