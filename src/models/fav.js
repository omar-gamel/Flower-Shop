const mongoose =require('mongoose'); 

const favSchema = new mongoose.Schema({
    flower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flower',
        required:true
      },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'User'
    }
})

module.exports= mongoose.model('Fav',favSchema);