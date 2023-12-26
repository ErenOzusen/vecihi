const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const UeruenGiyimUeye = require('../models/ueruenGiyimUeye');
const AlisverisSepeti = require('../models/alisverisSepeti');
const Siparisler = require('../models/siparisler');
const TeslimatAdres = require('../models/teslimatAdres');
const FaturaAdres = require('../models/faturaAdres');
const Kargo = require('../models/kargo');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const microtime = require('microtime');
var nodeBase64 = require('nodejs-base64-converter');
const crypto = require('crypto');
var request = require('request');
var ejsLayouts = require('express-ejs-layouts');
const Rating = require('../models/rating');
const multer = require('multer');
const { storage } = require('../cloudinary');
const { cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const { ObjectId } = require('mongodb');



const { isLoggedIn, isAuthor, isAdmin, toplamFiyatHesapla, ueruenOedenmis } = require('../middleware.js');
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

router.get('/hesabim', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const siparisler = await Siparisler.findOne({ ueye: userId }).populate({
        path: 'sepet',
        populate: {
            path: 'ueruenGiyim',
        },
    });

    res.render("ueye/hesabim", { siparisler });
}))

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



//alisverisSepeti.ejs den yolanan ilk siparis bilgileri
router.post('/alisverisSepetiFatura', isLoggedIn, catchAsync(async (req, res) => {
    const ueruenInformation = JSON.parse(req.body.ueruenInformationlar);
    console.log('ueruenInformation = ' + JSON.stringify(ueruenInformation) + ueruenInformation.length);
    const userId = req.user._id;
    const curentUser = await Ueye.findById(userId)
        .populate('teslimatAdres')
        .populate('faturaAdres');
    const kargo = await Kargo.findOne();
    const maxEntry = ueruenInformation.reduce((max, entry) => (entry.gesamtpreis > max.gesamtpreis) ? entry : max, ueruenInformation[0]);
    // Extrahiere die dazugehörigen Elemente
    let { ueruenID, quantity, gesamtpreis, ueruenToplam, kdv } = maxEntry;
    console.log('maxEntry: ' + maxEntry + 'quantity: ' + quantity + 'gesamtpreis: ' + gesamtpreis + 'ueruenToplam: ' + ueruenToplam + 'kdv: ' + kdv);
    for (let i = 0; i < ueruenInformation.length; i++) {
        const ueruenGiyimId = ueruenInformation[i].ueruenID;
        const miktar = ueruenInformation[i].quantity;
        const sepetUeruenBilgi = await UeruenGiyim.findById(ueruenGiyimId);

        //hem sepet hem ürün eklenmismi diye DB soruyorus
        const ueruenEkliBile = await AlisverisSepeti.findOne({ ueye: userId, 'ueruenler.ueruenGiyim': ueruenGiyimId });
        console.log('ueruenEkliBile = ' + ueruenEkliBile);
        //sirf sepet eklenmismi diye DB soruyorus
        const sepetEkliBile = await AlisverisSepeti.findOne({ ueye: userId });
        console.log('sepetEkliBile = ' + sepetEkliBile);
        console.log('ueruenId = ' + ueruenInformation[i].ueruenID);
        //ürün sepetde ekliyse miktarini güncelt
        if (ueruenEkliBile) {
            console.log('if entered');
            const ueruenIndex = ueruenEkliBile.ueruenler.findIndex(item => item.ueruenGiyim.equals(ueruenGiyimId));
            ueruenEkliBile.ueruenler[ueruenIndex].miktar = miktar;
            await ueruenEkliBile.save();
        }
        //sepetde olmayan bir ürün ekleniyorsa ama bir sepet olusmus haldeyse sepeti güncelle
        else if (sepetEkliBile) {
            console.log('else if entered');
            const yeniUeruen = {
                ueruenGiyim: sepetUeruenBilgi,
                miktar: miktar,
            };
            sepetEkliBile.ueruenler.push(yeniUeruen);
            await sepetEkliBile.save();
        }
        //sepetde ilk ürünse yeni sepet olustur
        else {
            console.log('else entered');
            const yeniUeruen = {
                ueruenGiyim: sepetUeruenBilgi,
                miktar: miktar,
            };
            const sepetYeni = new AlisverisSepeti({ "ueye": curentUser, "ueruenler": [yeniUeruen] });
            await sepetYeni.save();
        }
    }
    const sepet = await AlisverisSepeti.findOne({ ueye: userId }).populate('ueruenler.ueruenGiyim');
    gesamtpreis = parseFloat(gesamtpreis) + parseFloat(kargo.uecret);
    gesamtpreis = gesamtpreis.toFixed(2);
    res.locals.toplamFiyat = 0;
    res.locals.toplamFiyat = gesamtpreis;
    res.render("ueye/alisverisSepetiFatura", { curentUser, gesamtpreis, ueruenToplam, kdv, kargo, sepet });


}))



//alisversiSepetiFatura.ejs den yolanan ikinci siparis bilgileri
router.post('/alisverisSepetiOedeme', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const teslimatAdresId = req.body.teslimatAdresiSecimi;
    console.log('teslimat Id = ' + teslimatAdresId);
    const teslimatAdres = await TeslimatAdres.findById(teslimatAdresId);
    const secenek = req.body.secenek;
    let faturaAdresId = '';
    const sepet = await AlisverisSepeti.findOne({ ueye: userId });
    if (secenek == 'false') {
        console.log('if entered');
        faturaAdresId = req.body.faturaAdresiSecimi;
        const faturaAdres = await FaturaAdres.findById(faturaAdresId);
        sepet.faturaAdres = faturaAdres;
    }
    sepet.teslimatAdres = teslimatAdres;
    await sepet.save();

    //paytr icin payload hazirla

    res.redirect('/paytr');

}))

router.get('/paytr', isLoggedIn, toplamFiyatHesapla, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const curentUser = await Ueye.findById(userId);
    const sepet = await AlisverisSepeti.findOne({ ueye: userId }).populate('ueruenler.ueruenGiyim').populate('teslimatAdres');
    toplamFiyat = res.locals.toplamFiyat;

    var merchant_id = '399794';
    var merchant_key = 'b8JihzQCjkJrUEPn';
    var merchant_salt = 'AUi6cTALqmKBRQpm';
    var basket = [];
    for (let i = 0; i < sepet.ueruenler.length; i++) {
        let basketBilgi = [];
        basketBilgi.push(sepet.ueruenler[i].ueruenGiyim.tarif.toString());
        basketBilgi.push(sepet.ueruenler[i].ueruenGiyim.fiyat.toString());
        basketBilgi.push(sepet.ueruenler[i].miktar);
        console.log('basketBilgi = ' + basketBilgi);
        basket.push(basketBilgi);
    }
    console.log('basket = ' + basket);
    basketJSON = JSON.stringify(basket);
    console.log('basket2 = ' + basketJSON);
    basketJSON2 = JSON.stringify(basketJSON);
    console.log('basket3 = ' + basketJSON2);


    var user_basket = nodeBase64.encode(basketJSON);
    var merchant_oid = "IN" + microtime.now();

    var max_installment = '0';
    var no_installment = '0'
    var user_ip = req.ip;
    var email = curentUser.email;
    var payment_amount = parseInt(toplamFiyat * 100);
    console.log('paymentAmount = ' + payment_amount);
    var currency = 'TL';
    var test_mode = '0';
    var user_name = curentUser.isim;
    var user_address = sepet.teslimatAdres.sokak + ' ' + sepet.teslimatAdres.evNumarasi + ', ' + sepet.teslimatAdres.sehir + ', ' + sepet.teslimatAdres.uelke;
    console.log('userAdress = ' + user_address);
    var user_phone = curentUser.ceptelefonu.toString();
    console.log('telefon = ' + user_phone);
    var merchant_ok_url = 'http://localhost:3000/erkekGiyim';
    var merchant_fail_url = 'http://localhost:3000/kadinGiyim';
    var timeout_limit = 30;
    var debug_on = 1;
    var lang = 'tr';

    /*  var basket = JSON.stringify([
         ['Sample Product 1', '18.00', 1],
         ['Sample Product 2', '33.25', 2],
         ['Sample Product 3', '45.42', 1]
     ]);
     var user_basket = nodeBase64.encode(basket);
     console.log('user basket = ' + user_basket);
     var merchant_oid = "IN" + microtime.now();
     console.log('merchant oid = ' + merchant_oid);
 
     var max_installment = '0';
     var no_installment = '0'
     var user_ip = req.ip;
     var email = 'test@gmail.com';
     var payment_amount = 500;
     var currency = 'TL';
     var test_mode = '1';
     var user_name = 'Tester';
     var user_address = 'testadress';
     console.log('userAdress = ' + user_address);
     var user_phone = '05555555555';
     var merchant_ok_url = 'http://localhost:3000/erkekGiyim';
     var merchant_fail_url = 'http://localhost:3000/kadinGiyim';
     var timeout_limit = 30;
     var debug_on = 1;
     var lang = 'tr'; */


    var hashSTR = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    console.log('hasSTR = ' + hashSTR);

    var paytr_token = hashSTR + merchant_salt;
    console.log('paytr_token = ' + paytr_token);

    var token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');
    console.log('token = ' + token);


    var options = {
        method: 'POST',
        url: 'https://www.paytr.com/odeme/api/get-token',
        headers:
            { 'content-type': 'application/x-www-form-urlencoded' },
        formData: {
            merchant_id: merchant_id,
            merchant_key: merchant_key,
            merchant_salt: merchant_salt,
            email: email,
            payment_amount: payment_amount,
            merchant_oid: merchant_oid,
            user_name: user_name,
            user_address: user_address,
            user_phone: user_phone,
            merchant_ok_url: merchant_ok_url,
            merchant_fail_url: merchant_fail_url,
            user_basket: user_basket,
            user_ip: user_ip,
            timeout_limit: timeout_limit,
            debug_on: debug_on,
            test_mode: test_mode,
            lang: lang,
            no_installment: no_installment,
            max_installment: max_installment,
            currency: currency,
            paytr_token: token,

        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var res_data = JSON.parse(body);

        if (res_data.status == 'success') {
            res.render('layout', { iframetoken: res_data.token });
        } else {

            res.end(body);
        }

    });

    const siparisler = await Siparisler.findOne({ ueye: userId });
    const now = new Date();
    const orderDate = now.toLocaleDateString('de-DE'); // 'DD.MM.YYYY'
    const orderTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); // 'SS:MM'
    if (siparisler) {

        siparisler.sepet.push(...sepet.ueruenler.map(item => ({
            ueruenGiyim: item.ueruenGiyim._id,
            miktar: item.miktar,
            tarih: orderDate,
            saat: orderTime,
            toplamFiyat: toplamFiyat,
        })));

        await siparisler.save();
    } else {

        const newSiparisler = new Siparisler({
            ueye: userId,
            sepet: sepet.ueruenler.map(item => {
                return {
                    ueruenGiyim: item.ueruenGiyim._id,
                    miktar: item.miktar,
                    tarih: orderDate,
                    saat: orderTime,
                    toplamFiyat: toplamFiyat,
                };
            })
        });

        await newSiparisler.save();
    }
    await AlisverisSepeti.findOneAndRemove({ ueye: userId });
    delete req.session.ueruenIDs;
}))

router.post("/callback", function (req, res) {

    var callback = req.body;

    paytr_token = callback.merchant_oid + merchant_salt + callback.status + callback.total_amount;
    var token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');

    if (token != callback.hash) {
        throw new Error("PAYTR notification failed: bad hash");
    }

    if (callback.status == 'success') {

    } else {

    }

    res.send('OK');

});


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


router.get('/:id/yorumYaz', isLoggedIn, ueruenOedenmis, catchAsync(async (req, res, next) => {
    const id = req.params.id;
    ueruen = await UeruenGiyim.findById(id);

    res.render('ueye/yorumYaz', { ueruen });
}))

router.post('/:id/yorumYaz', isLoggedIn, ueruenOedenmis, upload.array('image'), catchAsync(async (req, res, next) => {
    //Findet den User
    const userId = req.user._id;
    const curentUser = await Ueye.findById(userId);

    //Findet das Produkt welches aufgerufen wurde
    const ueruenId = req.params.id;
    ueruen = await UeruenGiyim.findById(ueruenId);

    //Erzeugt ein neues Rating mit dem ausgefüllten Formular
    const yeniRating = new Rating(req.body.rating);
    yeniRating.stars = parseInt(yeniRating.stars);
    yeniRating.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    yeniRating.ueye = curentUser;
    yeniRating.ueruenGiyim = ueruen;

    //Definiert den Endpunkt an dem es am Ende navigiert wird
    console.log('ueruen: ' + ueruen + 'ueruenFormatted: ' + JSON.stringify(ueruen));
    const redirectUrl = `/${ueruen.kategori}/${ueruen.id}/detay`;

    const ratingUeyeDB = await Rating.find({ ueye: userId });

    //Hier wird geprüft ob es bereits ratings vom User gibt
    if (ratingUeyeDB && ratingUeyeDB.length > 0) {
        console.log('if statement entered');
        //Hier wird geprüft ob ein rating für das entsprechende Produkt bereits gibt
        const exists = ratingUeyeDB.some(rating => rating.ueruenGiyim.equals(ueruenId));

        if (exists) {
            console.log('second if statement entered');
            req.flash('error', 'Bu ürüne bir yorum verilmisdir.');
            return res.redirect('/');
        } else {
            //Falls es bereits ein Kommentar vom User gib aber nicht zu diesem Produkt dann speichere
            await yeniRating.save();
            res.redirect(redirectUrl);
        }
    }
    //Falls es das erste Kommentar vom User ist dann speichere
    await yeniRating.save();
    res.redirect(redirectUrl);


}))

module.exports = router;