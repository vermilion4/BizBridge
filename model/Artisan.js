const mongoose = require('mongoose');

const ArtisanSchema = new mongoose.Schema({
cName:{
    type:String,
    required:true
},
cNumber:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
bName:{
    type:String,
    required:true
},
industry:{
    type:String,
    required:true
},
cacStatus:{
    type:String,
    required:true
},
title:{
    type:String,
    required:true
},
staffStrength:{
    type:String,
    required:true
},
address:{
    type:String,
    required:true
},
city:{
    type:String,
    required:true
},
web:{
    type:String,
    required:true
},
uname:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
upload:{
    data:Buffer,
    contentType: String
},
dateRegistered:{
        type:Date,
        default:Date.now
    }
});

const Artisan = mongoose.model('Artisan', ArtisanSchema);
module.exports = Artisan;
