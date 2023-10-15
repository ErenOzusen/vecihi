const Ueye = require('./models/ueye');
const AlisverisSepeti = require('./models/alisverisSepeti');
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

module.exports.toplamFiyatHesapla = async (req, res, next) => {
    AlisverisSepeti.find({})
        .populate('ueruenGiyim')
        .then(sepet => {
            let toplamFiyat = 0;
            for (const sepetUeruen of sepet) {
                toplamFiyat += sepetUeruen.ueruenGiyim.fiyat * sepetUeruen.miktar;
            }
            res.locals.toplamFiyat = toplamFiyat;
            next();
        })
        .catch(err => {
            console.error('Fehler beim Berechnen der Gesamtsumme:', err);
            res.locals.toplamFiyat = 0; // Setzen Sie einen Standardwert, falls ein Fehler auftritt
            next();
        });
}

