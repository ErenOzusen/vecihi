const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const AnaSayfa = require('../models/anaSayfa');
const Rating = require('../models/rating');
const Kargo = require('../models/kargo');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const { cloudinary } = require('../cloudinary');
const upload = multer({ storage });

router.get('/:id/yeniUeruen', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const ueyeDB = await Ueye.findById(req.params.id);
    res.render("admin/yeniUeruen", { ueyeDB });
}))

router.post('/:id/yeniUeruen', isLoggedIn, isAdmin, upload.array('image'), catchAsync(async (req, res, next) => {
    const yeniUeruen = new UeruenGiyim(req.body.yeniUeruen);
    yeniUeruen.fiyat = parseFloat(yeniUeruen.fiyat);
    yeniUeruen.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await yeniUeruen.save();
    res.redirect('/');
}))

router.get('/:id/ueruenGuencelle', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    //const ueyeDB = await Ueye.findById(req.params.id);
    //res.render("admin/ueruenGuencelle", { ueyeDB });
    const { id } = req.params;
    const ueruen = await UeruenGiyim.findById(id);
    res.render("admin/ueruenGuencelle", { ueruen });
}))

router.put('/:id/ueruenGuencelle/resim', isLoggedIn, isAdmin, upload.array('image'), catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ueruenDB = await UeruenGiyim.findById(id);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    ueruenDB.images.push(...imgs);
    await ueruenDB.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await ueruenDB.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    };
    const route = ueruenDB.kategori;
    res.redirect(`/${route}/${id}/detay`);
}))

router.put('/:id/ueruenGuencelle/form', isLoggedIn, isAdmin, upload.array('image'), catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const yeniUeruen = req.body.yeniUeruen;
    const ueruenguencelle = new UeruenGiyim(yeniUeruen);
    ueruenDB = await UeruenGiyim.findByIdAndUpdate(id, { "$set": { "kategori": ueruenguencelle.kategori, "cesit": ueruenguencelle.cesit, "beden": ueruenguencelle.beden, "fiyat": ueruenguencelle.fiyat, "tarif": ueruenguencelle.tarif, "aciklama": ueruenguencelle.aciklama } });
    await ueruenDB.save();
    const route = ueruenDB.kategori;
    res.redirect(`/${route}/${id}/detay`);
}))

router.delete('/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const ueruen = await UeruenGiyim.findById(id);
    const cesit = ueruen.cesit;
    var kategori = ueruen.kategori;
    if (kategori == 'vintageUeruenler') {
        kategori = 'vintage';
    }
    await UeruenGiyim.findByIdAndDelete(id);

    res.redirect(`/${kategori}/${cesit}`);
    req.flash('success', 'Ürün silindi');
}))

router.get('/kargo', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const kargo = await Kargo.find();
    res.render("admin/kargo", { kargo });
}))

router.post('/kargo', isLoggedIn, isAdmin, upload.single('image'), catchAsync(async (req, res, next) => {
    const kargoDB = await Kargo.findOne();
    const yeniKargo = new Kargo(req.body.yeniKargo);
    yeniKargo.uecret = parseFloat(yeniKargo.uecret);
    if (!kargoDB) {
        console.log("if entered");
        yeniKargo.image = { url: req.file.path, filename: req.file.filename };
        await yeniKargo.save();
    } else {
        console.log("else entered");
        await kargoDB.updateOne({ $unset: { image: null } });
        kargoDB.isim = yeniKargo.isim;
        kargoDB.uecret = yeniKargo.uecret;
        kargoDB.image = { url: req.file.path, filename: req.file.filename };
        await kargoDB.save();
    }
    res.redirect('/');
}))

router.get('/anaSayfaGuencelle', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const tuemUeruenler = await UeruenGiyim.find({});
    res.render("admin/anaSayfaGuencelle", { tuemUeruenler });
}))

router.post('/anaSayfaGuencelle', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const section = req.body.section;
    const tuemUeruenler = await UeruenGiyim.find({});
    res.render("admin/anaSayfaGuencelle", { tuemUeruenler, section });
}))

router.put('/anaSayfaGuencelle', isLoggedIn, isAdmin, upload.array('image'), catchAsync(async (req, res, next) => {
    let sectionBirBaslik = '';
    let anaSayfa = new AnaSayfa({});
    if (req.body.section === 'Ana Sayfa Bölüm Reklam') {
        console.log('first if entered');
        anaSayfa.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        console.log('anaSayfa.images: ' + anaSayfa.images);
        await anaSayfa.save();
    } else {
        let selectedUeruenler = req.body.selectedUeruenler;
        let sectionBirDB = await AnaSayfa.findOne();
        if (req.body.section === 'Ana Sayfa Bölüm Bir') {
            sectionBirBaslik = req.body.sectionBirBaslik;
        }

        if (!sectionBirDB) {
            if (req.body.section === 'Ana Sayfa Bölüm Bir') {
                anaSayfa.sectionBirBaslik = sectionBirBaslik;
                anaSayfa.sectionBirUeruenID = selectedUeruenler;
            } else {
                anaSayfa.sectionIkiUeruenID = selectedUeruenler;
            }
            await anaSayfa.save();
        } else {
            if (req.body.section === 'Ana Sayfa Bölüm Bir') {
                sectionBirDB.sectionBirBaslik = sectionBirBaslik;
                sectionBirDB.sectionBirUeruenID = selectedUeruenler;
            } else {
                sectionBirDB.sectionIkiUeruenID = selectedUeruenler;
            }

            await sectionBirDB.save();
        }

        console.log('sectionBirDB: ' + sectionBirDB);
    }
    res.redirect('/');
}))
module.exports = router;