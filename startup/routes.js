/*jshint esversion: 6 */
const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const cors = require('cors');

module.exports = function(app){
     
app.use(cors());//هنا ممكن من الدوكيمنتيشن اختار الراوتس الي اقدر اتيح استخدامها ليوزرس معينة 
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error); //note here we are not calling the function just refaring fot it to used as a middilewear in every routes

}