const mongoose = require('mongoose')



const ContSchema = new mongoose.Schema({
  
    character : {
        type :mongoose.Schema.Types.ObjectId,
        ref : "Char"
    },
    images : [String],
    avatar : String,
    cloudinary_id: {
        type: String,
      },
    
   
    
})






const Cont = mongoose.model('Cont',ContSchema)
module.exports = Cont