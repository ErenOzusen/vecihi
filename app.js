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
const ueyeRoutes = require('./routes/ueye');

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
app.use(express.static('public'));
app.use(session(sessionConfig));
app.use('/', ueyeRoutes);


app.get('/', (req, res) => {

  res.render("index");
})

app.get('/:id', catchAsync(async (req, res) => {
  const ueye = await Ueye.findById(req.params.id);
  res.render('index', { ueye });
}))

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

app.get('/hesabim', (req, res) => {

  res.render("hesabim");
})

app.get('/yorumlarim', (req, res) => {

  res.render("yorumlarim");
})

app.get('/ueyelikBilgilerim', (req, res) => {

  res.render("ueyelikBilgilerim");
})

app.get('/adreslerim', (req, res) => {

  res.render("adreslerim");
})

app.get('/favorilerim', (req, res) => {

  res.render("favorilerim");
})

app.get('/erkekGiyim', (req, res) => {

  res.render("erkekGiyim");
})

app.get('/kadinGiyim', (req, res) => {

  res.render("kadinGiyim");
})

app.get('/vintageUeruenler', (req, res) => {

  res.render("vintageUeruenler");
})

app.get('/ueruenDetay', (req, res) => {

  res.render("ueruenDetay");
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



















