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
            res.redirect(`/${ueyeDB._id}`);
        } else {
            console.log("böyle bir uye yok");
        }
    } catch (e) {
        console.log("Hata: " + e.mssage);
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
        res.redirect('/');
    } catch (e) {
        console.log("Hata: " + e.mssage);
    }
}));


module.exports = router;