const mongoose = require('mongoose')

const Schema = mongoose.Schema

const expenseSchema = new Schema({
    category : {type : String ,required : true},
    amount : {type : Number ,required : true},
    date : {type : String ,required : true},
    notes : {type : String ,required : true},
    creator : {type : mongoose.Types.ObjectId,required : true , ref:'User'}
})

module.exports = mongoose.model('Expense',expenseSchema)