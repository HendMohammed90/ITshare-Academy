module.exports = function( err ,req ,res ,next){
    //log some exception
    res.status(500).send('Internal server error');
};