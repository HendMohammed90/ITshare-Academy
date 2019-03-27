/*jshint esversion: 6 */
/* jshint ignore:start */

const winston= require('winston');
require('winston-mongodb');
require('express-async-errors'); //here we tell the app to use this middelware in every routs we use that choise if our async.js moudule dosn't work or we can choose between them  
module.exports = function(){
    // process.on('uncaughtException' ,(ex)=>{
//   console.log('we got an uncauht exception');
//   winston.error(ex.message , ex);
//   process.exit(1);
// });

winston.handleExceptions(new winston.transports.File({
    filename : 'uncaughtException.log'
  }));//this is a better whay than in the line 22 it's better to stor your uncaughtException errors in a file in case of we can't connect to our data base  
  
  process.on('unhandledRejection' ,(ex)=>{
    // console.log('we got an Unhandled Rejection');
    // winston.error(ex.message , ex);
    // process.exit(1); 
    //so insted of the above we will throw the (ex) and the line 28 will be handling with that -_^
    throw ex ;
  }); 
  
  winston.add(winston.transports.File ,{filename: 'logfile.log'});
  winston.add(winston.transports.MongoDB ,{
    db :'mongodb://localhost/vidly',
    level : "info" //here i can detect the level of errors
  });//in real world aplication we have to seperate this in another database
  

    // throw new Error("couldn t get the genera")
    // const p = Promise.reject(new Error('Something failed miserably!'));
    // p.then(()=>  console.log('Done'));
  
};