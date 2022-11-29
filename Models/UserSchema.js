const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {type: String, required : true},
    password : {type : String , required : true},
    number : {type : String , required : true},
    expenses : [{type : mongoose.Types.ObjectId, required : true , ref : 'Expense'}]
});

//creating model
module.exports =mongoose.model('User',userSchema);
