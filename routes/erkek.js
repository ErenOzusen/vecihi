const express = require('express');
const router = express.Router();
const Ueye = require('../models/ueye');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/', (req, res) => {

    res.render("erkek/erkekGiyim");
})


module.exports = router;