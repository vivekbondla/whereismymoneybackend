const PRIVATE_KEY = "thiskeyisusedforgeneratingtoken";

const UserModel = require('../Models/UserSchema')
const HttpError = require('../Models/http-error')

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { email, password,number } = await req.body;

  
  let token;
  try {
    token = jwt.sign({ username: email, password: password }, "PRIVATE_KEY", {
      expiresIn: "1h",
    });
  } catch (err) {
    console.log(err);
  }
  const createUser = new UserModel({
    email,password,number,token,expenses:[]
  })

  try{
    await createUser.save();
  }catch(err){
    const error = new HttpError('Unable to create user please try again',500)
    return next(error)
  }

  res.status(201).json({message:'user added successfully!' , user:createUser.toObject({getters:true})})
};

const login = async(req,res,next)=>{
  const {email,password} = req.body;
  let identifiedUser;
  try {
    identifiedUser = await UserModel.findOne({email})
  } catch (err) {
    const error = new HttpError('Could not retrive email for login',500)
    return next(error)
    
  }
  if(!identifiedUser){
    const error = new HttpError('User not found, please signup',404)
    return next(error)

  }
  if(!identifiedUser || password !== identifiedUser.password){
    const error = new HttpError('invalid credentials',401)
    return next(error)
    
  }
  res.status(200).json({message : 'user logged in successfully!' , user:identifiedUser.toObject({getters:true})})



}

exports.signup = signup;
exports.login = login;
