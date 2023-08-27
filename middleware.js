const Ueye = require('./models/ueye');
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
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
    const admin = process.env.ADMIN;
    if (ueye && !admin.match(ueye.email)) {
        req.flash('error', 'Buna izinis yok!');
        return res.redirect('/girisYap');
    }
    next();
}

