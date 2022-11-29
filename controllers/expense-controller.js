const ExpenseModel = require("../Models/ExpenseSchema");
const UserModel = require("../Models/UserSchema");
const HttpError = require("../Models/http-error");
const mongoose = require("mongoose");

const storeExpenseData = async (req, res, next) => {
  const { category, amount, date, notes, creator } = req.body;
  // console.log(req.body);

  let createExpense;

  createExpense = new ExpenseModel({
    category,
    amount,
    date,
    notes,
    creator,
  });
  // await createExpense.save()
  //    catch (err) {
  //     const error = new HttpError("Unable to save expense please try again", 500);
  //     return next(error);
  //   }
  let existingUser;

  try {
    existingUser = await UserModel.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "creating expense failed please try again",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Could not find this user id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createExpense.save({ session: sess });
    existingUser.expenses.push(createExpense);
    await existingUser.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();
  } catch (err) {
    // console.log(err);
    const error = new HttpError("Creatin expense failed reason :" + err, 500);
    return next(error);
  }

  res.status(201).json({
    message: "expense data stored successfully!",
    expense: createExpense.toObject({ getters: true }),
  });

  
};

const getExpenseData = async(req,res,next)=>{
  const userId = req.params.userId;
  // console.log(userId)
 
  let userWithExpenses;
  try {
    userWithExpenses = await UserModel.findById(userId).populate('expenses')
    console.log(userWithExpenses)
    
  } catch (err) {
    const error = new HttpError('Unable to get expenses with userId' + err,500)
    return next(error)
    
  }

  if(!userWithExpenses || userWithExpenses.expenses.length === 0){
    const error = new HttpError('Could not find any expenses with this user',404)
    return next(error)
  }

  res.status(200).json({ expenses: userWithExpenses.expenses.map((expense)=>expense.toObject({getters:true})) })
    
    
}

const deleteExpense = async(req,res,next)=>{
  const expenseId = req.params.expenseId;
  // console.log(expenseId);
  let expense;
  try {
    expense = await ExpenseModel.findById(expenseId).populate('creator')
    
  } catch (err) {
    const error = new HttpError('Something went wrong..' + err ,500)
    return next(error)
    
  }
  if(!expense){
    const error = new HttpError('Could not find expense with this id', 404)
    return next(error)
  }

  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await expense.remove({session : sess})
    expense.creator.expenses.pull(expense);
    await expense.creator.save({session:sess})
    await sess.commitTransaction()
    await sess.endSession()
  }catch(err){
    const error = new HttpError('Unable to delete expense, please try again...' + err, 500)
    return next(error)
  }

  res.status(200).json({message:'deleted expense', expense : expense.toObject({getters:true})})

}

exports.storeExpenseData = storeExpenseData;
exports.getExpenseData = getExpenseData
exports.deleteExpense = deleteExpense ;
