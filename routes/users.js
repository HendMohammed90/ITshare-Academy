/*jshint esversion: 6 */
/* jshint ignore:start */
const auth= require('../middleware/auth');
const {User, validate} = require('../models/user'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ =  require('lodash'); 
const bcrypt = require('bcrypt');
require('express-async-errors'); //here we tell the app to use this middelware in every routs


router.get('/me',auth,async(req ,res)=>{
const user = await User.findById(req.user._id).select('-password');
res.send(user);

})

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({email : req.body.email});
//this syntex by me
//   if(!user){
//     let user = new User({ 
//         name :req.body.name,
//         email :req.body.email,
//         password : req.body.password
//     });
//     await user.save();
    
//     res.send(user);
//   }else{
//     return res.status(400).send("Invalid Email It's alredy saved in database");
//   }

//the syntex by mosh
    if(user) return res.status(400).send("Invalid Email It's alredy saved in database");
    user = new User({ 
        name :req.body.name,
        email :req.body.email,
        password : req.body.password, //here we can use npm called joi-password-complexity to preform a strong password
        isAdmin : req.body.isAdmin
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // res.send(user);
    
//in case we want to return only parts of user data we can use 
    // res.send({
    //     name : user.name ,
    //     email : user.email
    // });
    
  //or we can use npm Lodash by installing it in terminal and use it 
  const token = user.generateAuthToken();
  res.header('x-auth-token' , token).send(_.pick(user,['name']));

});

module.exports = router; 