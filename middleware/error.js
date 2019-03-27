/*jshint esversion: 6 */
/* jshint ignore:start */

const winston= require('winston');

module.exports = function( err ,req ,res ,next){
    //log some exception
    winston.error(err.message , err);
    //ther are types of error (level of it ) we can know it's type from the documintation of winston npm documintation
    res.status(500).send('Internal server error');
};