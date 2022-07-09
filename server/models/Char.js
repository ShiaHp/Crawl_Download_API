const mongoose = require('mongoose')



const CharSchema = new mongoose.Schema({
    CharName : {
        type : String,
        trim : true
    },
    groupName : {
        type : String,
    },
    
   
    
})






const Char = mongoose.model('Char',CharSchema)
module.exports = Char