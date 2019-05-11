const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const config = require('config');
const port = process.env.PORT||3000;
const userRoutes = require('./src/routes/auth');
const shopRoutes = require('./src/routes/shop');
const flowerRoutes = require('./src/routes/flower');
const favRoutes = require('./src/routes/fav');
const indexRoutes = require('./src/routes/index');
const cartRoutes = require('./src/routes/cart');
const orderRoutes = require('./src/routes/order');
const passport = require('passport');
const myPassportService = require('./src/services/passport')(passport);

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(myPassportService.initialize()); 

require('./src/services/swagger')(app);

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  let contype = req.headers['content-type'];
  if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data')))){
    const error = new Error(`Unsupported Media Type ( ${contype} )`);
    error.statusCode = 415;
    throw error;
  }
  next();
});

app.use('/', indexRoutes);
app.use('/user', userRoutes);
app.use('/shop', shopRoutes);
app.use('/flower', flowerRoutes);
app.use('/fav', favRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found.');
  error.statusCode = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(error.statusCode || 500).json({ message: error.message, data: error.data });
});

mongoose
  .connect(config.get('db'), {'useNewUrlParser': true})
  .then(result => {
    app.listen(3000);
    console.log('Connected to MongoDB...')
  })
  .catch(err => {
    console.log(err);
  });
