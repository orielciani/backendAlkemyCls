// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Var
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Imports of routes
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const budgetRoutes = require('./routes/budget');
const appRoutes = require('./routes/app');

// Connecting to database via Mongo Atlas
const url = "mongodb+srv://Orion:Artemisa2132as1321@artemisa.6h1q9.mongodb.net/AlkemyChallenge?retryWrites=true&w=majority";
mongoose.connection.openUri(url, (err, res) => {
  if (err) throw err;
  console.log('Base de datos Mongodb: ONLINE');
});

// Routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/budget', budgetRoutes);
app.use('/', appRoutes);

// Petitions
// app.listen(process.env.PORT, process.env.YOUR_HOST, () => {
  app.listen(3000, ()=>{
    console.log('Server ON');
  });

