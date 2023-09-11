const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
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

router.post('/:id/ueruenGuencelle/resim', isLoggedIn, isAdmin, upload.array('image'), catchAsync(async (req, res, next) => {
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

    res.redirect(`/admin/${id}/ueruenGuencelle`)
}))

router.post('/:id/ueruenGuencelle/form', isLoggedIn, isAdmin, upload.array('image'), catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const yeniUeruen = req.body.yeniUeruen;
    const ueruenguencelle = new UeruenGiyim(yeniUeruen);
    ueruenDB = await UeruenGiyim.findByIdAndUpdate(id, { "$set": { "kategori": ueruenguencelle.kategori, "cesit": ueruenguencelle.cesit, "beden": ueruenguencelle.beden, "fiyat": ueruenguencelle.fiyat, "tarif": ueruenguencelle.tarif, "aciklama": ueruenguencelle.aciklama } });
    await ueruenDB.save();

    res.redirect(`/admin/${id}/ueruenGuencelle`)
}))

module.exports = router;