const mongoose = require('mongoose')



const urlSchema = new mongoose.Schema({
  

    url : [String],
    
   
    
})






const Url = mongoose.model('Url',urlSchema )
module.exports = Url