const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const UeruenGiyimUeruen = require('../models/ueruenGiyimUeye');
const AlisverisSepeti = require('../models/alisverisSepeti');
const TeslimatAdres = require('../models/teslimatAdres');
const FaturaAdres = require('../models/faturaAdres');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');
const { findById } = require('../models/ueye');


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

router.get('/ueyelikBilgilerim', isLoggedIn, (req, res) => {
    curentUser = req.user;
    res.render("ueye/ueyelikBilgilerim", curentUser);
})

router.get('/ueyelikBilgiGuencelle', isLoggedIn, (req, res) => {
    curentUser = req.user;
    res.render("ueye/ueyelikBilgiGuencelle", curentUser);
})

router.get('/adreslerim', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const curentUser = await Ueye.findById(userId)
        .populate('teslimatAdres')
        .populate('faturaAdres');
    console.log('curentUser ' + curentUser);
    res.render("ueye/adreslerim", { curentUser });
}))

router.get('/yeniAdresEkle', isLoggedIn, (req, res) => {
    curentUser = req.user;
    res.render("ueye/yeniAdresEkle", curentUser);
})

router.get('/yeniTeslimatAdres', isLoggedIn, (req, res) => {
    curentUser = req.user;
    res.render("ueye/yeniTeslimatAdres", curentUser);
})

router.post('/yeniTeslimatAdres', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const curentUser = await Ueye.findById(userId);
    teslimatAdresForm = req.body.teslimatAdres;
    const teslimatAdres = new TeslimatAdres({ "isim": teslimatAdresForm.isim, "soyisim": teslimatAdresForm.soyisim, "tc": teslimatAdresForm.tc, "uelke": teslimatAdresForm.uelke, "sehir": teslimatAdresForm.sehir, "sokak": teslimatAdresForm.sokak, "evNumarasi": teslimatAdresForm.evNumarasi, "ceptelefonu": teslimatAdresForm.ceptelefonu });
    await teslimatAdres.save();
    curentUser.teslimatAdres.push(teslimatAdres);
    await curentUser.save();
    req.flash('success', 'Yeni teslimat adresi eklendi');
    res.redirect('/')
}))

router.get('/yeniFaturaAdres', isLoggedIn, (req, res) => {
    curentUser = req.user;
    res.render("ueye/yeniFaturaAdres", curentUser);
})

router.post('/yeniFaturaAdres', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const curentUser = await Ueye.findById(userId);
    faturaAdresForm = req.body.faturaAdres;
    const faturaAdres = new FaturaAdres({ "isim": faturaAdresForm.isim, "soyisim": faturaAdresForm.soyisim, "tc": faturaAdresForm.tc, "uelke": faturaAdresForm.uelke, "sehir": faturaAdresForm.sehir, "sokak": faturaAdresForm.sokak, "evNumarasi": faturaAdresForm.evNumarasi, "ceptelefonu": faturaAdresForm.ceptelefonu });
    await faturaAdres.save();
    curentUser.faturaAdres.push(faturaAdres);
    await curentUser.save();
    req.flash('success', 'Yeni fatura adresi eklendi');
    res.redirect('/')
}))

router.put('/ueyelikBilgiGuencelle', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const curentUser = await Ueye.findById(userId);
    let ueyeBilgiler = req.body.ueyeBilgi;
    //Ilk eşleştirme: üc sifre yazilmismi
    if (ueyeBilgiler.yeniSifre && ueyeBilgiler.yeniSifreTekrar && ueyeBilgiler.eskiSifre) {
        //Ikinci eşleştirme: yeni sifre ve tekrar yazilan yeni sifre uyuyorlarmi
        if (ueyeBilgiler.yeniSifre !== ueyeBilgiler.yeniSifreTekrar) {
            req.flash('error', 'Yazdiğiniz yeni şifreler birbirine uymuyor.');
            res.redirect("/");
        } else {
            //eski sifre kayit olan eski sifreylen uyuyormu
            curentUser.authenticate(ueyeBilgiler.eskiSifre, (err, result) => {
                if (err) {
                    return res.status(500).send('Şifre kıyaslamakda bi sorun yaşandı');
                } else if (result) {
                    //yeni sifre kayit ediliyor
                    curentUser.setPassword(ueyeBilgiler.yeniSifre, async (err) => {
                        if (err) {
                            return res.status(500).send('Güncellenmekde bi sorun yaşandı');
                        }
                        await curentUser.save();
                        const ueyeGüncellenmis = await Ueye.findByIdAndUpdate(id, { "$set": { "isim": ueyeBilgiler.isim, "soyisim": ueyeBilgiler.soyisim, "email": ueyeBilgiler.email, "ceptelefonu": ueyeBilgiler.ceptelefonu } });
                        await ueyeGüncellenmis.save();
                        req.flash('success', 'Üyelik bilgilerinis güncellenmişdir');
                        res.redirect("/");
                    });
                } else {
                    req.flash('error', 'Yazdiğiniz eski şifre yanliş');
                    res.redirect("/");
                }
            });
        }
    }
    //hic bir sifre verilmediginde geri kalan input lar kayit ediliyor
    else if (!ueyeBilgiler.yeniSifre && !ueyeBilgiler.yeniSifreTekrar && !ueyeBilgiler.eskiSifre) {
        const ueyeGüncellenmis = await Ueye.findByIdAndUpdate(userId, { "$set": { "isim": ueyeBilgiler.isim, "soyisim": ueyeBilgiler.soyisim, "email": ueyeBilgiler.email, "ceptelefonu": ueyeBilgiler.ceptelefonu } });
        await ueyeGüncellenmis.save();
        req.flash('success', 'Üyelik bilgilerinis güncellenmişdir');
        res.redirect("/");

    }
}))




router.get('/favorilerim', (req, res) => {

    res.render("ueye/favorilerim");
})

router.get('/alisverisSepeti', catchAsync(async (req, res) => {
    let ueruenler = [];
    curentUser = req.user;

    if (req.session.ueruenIDs) {
        const ueruenIDs = req.session.ueruenIDs;
        for (let id of ueruenIDs) {
            ueruen = await UeruenGiyim.findById(id);
            ueruenler.push(ueruen);
        }
        res.render("ueye/alisverisSepeti", { ueruenler });

    } else {
        res.render("./alisverisSepetiBos");
    }

}))

router.post('/alisverisSepeti', catchAsync(async (req, res) => {
    const idToRemove = req.body.ueruenID;

    if (req.session.ueruenIDs && idToRemove) {
        req.session.ueruenIDs = req.session.ueruenIDs.filter((ueruenID) => ueruenID !== idToRemove);
    }
    res.redirect('/alisverisSepeti');
}))

router.get('/alisverisSepetiFatura', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const curentUser = await Ueye.findById(userId)
        .populate('teslimatAdres')
        .populate('faturaAdres');;
    res.render("ueye/alisverisSepetiFatura", { curentUser });
}))

router.post('/alisverisSepetiFatura', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const ueruen = req.body.ueruen;
    const ueruenInformation = JSON.parse(req.body.ueruenInformationlar);
    for (let i = 0; i < ueruenInformation.length; i++) {
        const sepetUeruenBilgi = await UeruenGiyim.findById(ueruenInformation[i].ueruenID);
        const sepetUeruen = new UeruenGiyimUeruen({ "ueruenGiyim": sepetUeruenBilgi, "miktar": ueruenInformation[i].quantity });
        await sepetUeruen.save();
        const sepet = new AlisverisSepeti();
        sepet.ueruenGiyimUeye.push(sepetUeruen);
        sepet.save();
        res.redirect('/alisverisSepetiFatura');
    }
}))

router.get('/alisverisSepetiOedeme', isLoggedIn, (req, res) => {

    res.render("ueye/alisverisSepetiOedeme");
})

router.post('/alisverisSepetiOedeme', isLoggedIn, catchAsync(async (req, res) => {
    const oedemeSistemSecimi = req.body.oedemeSistemSecimi;
    console.log('oedemeSistemSecimi = ' + oedemeSistemSecimi);
}))

router.post('/sepeteEkle', catchAsync(async (req, res, next) => {
    const ueruenID = req.body.ueruenID;
    if (!req.session.ueruenIDs) {
        req.session.ueruenIDs = [];
    }
    if (!req.session.ueruenIDs.includes(ueruenID)) {
        req.session.ueruenIDs.push(ueruenID);
    }
    res.redirect('/alisverisSepeti');
}))




module.exports = router;