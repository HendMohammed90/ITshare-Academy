/*jshint esversion: 6 */
/* jshint ignore:start */
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
// const asyncMiddleeware = require('../middleware/async');
const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
require('express-async-errors'); //here we tell the app to use this middelware in every routs we use that choise if our async.js moudule dosn't work or we can choose between them
//I think i should implement the line of express-async-errors in every route because it dosn't work for me for implimintg it in only index module



router.get('/', async (req, res ) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.send(genre);
});

router.put('/:id',[auth,admin], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

router.delete('/:id',[auth,admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;