const mongoose=require('mongoose');

const imageDetailsSchema=new mongoose.Schema({
    name:String,
    image:String
})
module.exports=mongoose.model('imageDetails',imageDetailsSchema)