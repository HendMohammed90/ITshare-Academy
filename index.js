/*jshint esversion: 6 */
const config = require('config');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const cors = require('cors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

if(!config.get('password')){
  console.log('FATAL ERROR: Password is not defind');
  process.exit(1);//this means error and exit the method 0 means Success 
}

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(cors());//هنا ممكن من الدوكيمنتيشن اختار الراوتس الي اقدر اتيح استخدامها ليوزرس معينة 
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error); //note here we are not calling the function just reffrenc fot it to used as a middilewear in every routes

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));