const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const UeruenGiyim = require('../models/ueruenGiyim');
const Rating = require('../models/rating');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, isAuthor, isAdmin } = require('../middleware.js');


router.get('/:id/detay', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const ratingUeruenDB = await Rating.find({ ueruenGiyim: id }).populate('ueye');
    const ueruen = await UeruenGiyim.findById(id);
    console.log('ratingUeruenDB: ' + ratingUeruenDB + 'ratingUeruenDBFormated: ' + JSON.stringify(ratingUeruenDB));
    res.render("ueruenler/ueruenDetay", { ueruen, ratingUeruenDB });
}))

module.exports = router;