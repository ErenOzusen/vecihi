if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
};

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
const Ueye = require('./models/ueye');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const ueyeRoutes = require('./routes/ueye');
const erkekRoutes = require('./routes/erkek')
const kadinRoutes = require('./routes/kadin');
const vintageRoutes = require('./routes/vintage');
const adminRoutes = require('./routes/admin');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const { isLoggedIn, isAuthor, isAdmin } = require('./middleware.js');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://127.0.0.1:27017/vecihi');

const sessionConfig = {
  secret: 'thiswillchange',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//passport.use(new LocalStrategy(Ueye.authenticate()));
passport.use(new LocalStrategy({
  usernameField: 'email', // Verweise auf das E-Mail-Feld
  passwordField: 'password' // Verweise auf das Passwort-Feld
}, Ueye.authenticate()));

passport.serializeUser(Ueye.serializeUser());
passport.deserializeUser(Ueye.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


app.use('/', ueyeRoutes);
app.use('/erkekGiyim', erkekRoutes);
app.use('/kadinGiyim', kadinRoutes);
app.use('/admin', adminRoutes);
app.use('/vintage', vintageRoutes);

app.get('/', (req, res) => {

  res.render("index");
})

/* app.get('/:id', catchAsync(async (req, res) => {
  const ueye = await Ueye.findById(req.params.id);
  res.render('index', { ueye });
})) */



app.get('/hakkimizda', (req, res) => {

  res.render("hakkimizda");

})

app.get('/bankaHesap', (req, res) => {

  res.render("bankaHesap");

})

app.get('/havaleBilForm', (req, res) => {

  res.render("havaleBilForm");

})

app.get('/isOrtaklar', (req, res) => {

  res.render("isOrtaklar");

})


app.get('/ortakForm', (req, res) => {

  res.render("ortakForm");
})

app.get('/sss', (req, res) => {

  res.render("sss");
})

app.get('/kargomNerede', (req, res) => {

  res.render("kargomNerede");
})

app.get('/iletisim', (req, res) => {

  res.render("iletisim");
})

app.get('/ueyelikSoezlesme', (req, res) => {

  res.render("ueyelikSoezlesme");
})

app.get('/bayilikSoezlesme', (req, res) => {

  res.render("bayilikSoezlesme");
})


app.get('/kullanimKosullari', (req, res) => {

  res.render("kullanimKosullari");
})

app.get('/gizlilikGuevenlik', (req, res) => {

  res.render("gizlilikGuevenlik");
})

app.get('/mesafeliSatisS', (req, res) => {

  res.render("mesafeliSatisS");
})

app.get('/teslimat', (req, res) => {

  res.render("teslimat");
})

app.get('/iptalDegisim', (req, res) => {

  res.render("iptalDegisim");
})



app.listen(3000, () => {

  console.log("Server Çalışıyor");

})

/* app.all('*', (req, res, next) => {
  next(new ExpressError('Bir hata oluşdu', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Sayfa bulunamadı'
  res.status(statusCode).render('error', { err });
}) */

// async function emailkiyasla (email){
//   const emailDB = await Ueye.findOne({email:email});
//   if(emailDB == null){
//     console.log ("uye Kayitli");
//   }
// }



















