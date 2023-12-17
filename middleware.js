const Ueye = require('./models/ueye');
const AlisverisSepeti = require('./models/alisverisSepeti');
const ExpressError = require('./utils/ExpressError');
const Siparisler = require('./models/siparisler');
const { ObjectId } = require('mongodb');



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
    const userId = req.user._id;

    try {
        const sepet = await AlisverisSepeti.findOne({ ueye: userId }).populate('ueruenler.ueruenGiyim');

        if (!sepet) {
            res.locals.toplamFiyat = 0;
        } else {
            let toplamFiyat = 0;
            for (const sepetUeruen of sepet.ueruenler) {

                toplamFiyat += sepetUeruen.ueruenGiyim.fiyat * sepetUeruen.miktar;
            }
            res.locals.toplamFiyat = toplamFiyat;
        }
    } catch (err) {
        console.error('Hesaplamada bir hata oluştu:', err);
        res.locals.toplamFiyat = 0;
    }

    next();
}

module.exports.ueruenOedenmis = async (req, res, next) => {
    console.log('middleware entered');
    const userId = req.user._id;
    const ueruenId = req.params.id;
    try {
        const ueruenIdObject = new ObjectId(ueruenId);

        const siparisler = await Siparisler.findOne({ ueye: userId }).populate({
            path: 'sepet',
            populate: {
                path: 'ueruenGiyim',
            },
        });

        let siparis;
        if (siparisler && siparisler.sepet) {
            siparis = siparisler.sepet.find(item => item.ueruenGiyim.equals(ueruenIdObject));
            console.log('siparis: ' + JSON.stringify(siparis));
            console.log('ueruenId: ' + ueruenId);
            if (!siparis) {
                req.flash('error', 'Buna izin yok!');
                return res.redirect('/');
            }
        }

        next();
    } catch (error) {
        console.error('Fehler bei der ObjectId-Konvertierung:', error.message);
        req.flash('error', 'Ungültige UeruenId!');
        return res.redirect('/');
    }
    next();
}




