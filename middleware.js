const Ueye = require('./models/ueye');
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo);
        req.flash('error', 'you must be signed in first');
        return res.redirect('/girisYap');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const ueye = await Ueye.findById(id);
    next();
};

module.exports.isAdmin = async (req, res, next) => {
    const { id } = req.params;
    const ueye = await Ueye.findById(id);
    if (ueye.email !== 'tolgay.altiner@web.de') {
        req.flash('error', 'Buna izinis yok!');
        return res.redirect('/girisYap');
    }
    next();
}

