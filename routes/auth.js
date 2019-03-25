/*jshint esversion: 6 */
/* jshint ignore:start */
const {User} = require('../models/user'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ =  require('lodash');
const bcrypt = require('bcrypt');
require('express-async-errors'); //here we tell the app to use this middelware in every routs



router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send("Invalid Email or password");
    const validPassword = await bcrypt.compare(req.body.password , user.password);
    if(!validPassword) return res.status(400).send("Invalid Email or password");
    
    const token = user.generateAuthToken();
    res.header('x-auth-token' , token);

});

function validate(req) {
    const schema = {
      email :Joi.string().required().email().min(5).max(255),
      password : Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(req, schema);
  }
  

module.exports = router; 