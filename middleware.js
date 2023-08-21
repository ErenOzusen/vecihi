
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo);
        req.flash('error', 'you must be signed in first');
        return res.redirect('/girisYap');
    }
    next();
};