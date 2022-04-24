const mongoose = require('mongoose');

const plate = new mongoose.Schema({   
    text: String,    
    parkingLot: String,
}, {timestamps:true})

module.exports = mongoose.model('Plates', plate);