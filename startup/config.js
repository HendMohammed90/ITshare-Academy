/*jshint esversion: 6 */
/* jshint ignore:start */
const config = require('config');

module.exports = function(){
    if(!config.get('password')){
       throw new Error('FATAL ERROR: Password is not defind');
        // process.exit(1);//this means error and exit the method 0 means Success 
      }
      
}