/*jshint esversion: 6 */
/* jshint ignore:start */
const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require("fawn");
Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
//دي طريقة قديمة في حفظ الداتا بتاعت الرينتل وان احنا ننقص من قيمة الافلام الاحدث بال fawn npm
  // rental = await rental.save();
  // movie.numberInStock--;
  // movie.save();
  // res.send(rental);

  // هنا احنا محتاجين نستخدم ميثود بتعمل العمليتين في نفس الوقت في الداتا بيز عشان كده بستخدم حاجه اسمها mongoDB 2 phase commit عن طريق موديول اسمه 
  //fawn npm 
  try{
    new Fawn.Task()
      .save('rentals' , rental)
      .update('movies' , {_id:movie._id},{
        $inc: {numberInStock : -1 }
      })
      .run();
    res.send(rental);
  }
   catch(ex){
     res.status(500).send('Somthing bad has happend -_-.')
   }
  
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 

//الراوت هنا بتمثل مثلا اوردر اتعمل من الشركه الي بتوفر الخدمة دي فنلاحظ ان احنا هنا مش بنعمل ابديت 