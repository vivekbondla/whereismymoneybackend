const express = require("express");
const app = express();
const bodyParser = require("body-parser");
console.log(process.env.DB_USER,process.env.DB_PWD,process.env.DB_NAME)
const mongoose = require("mongoose");
const URL =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.thpnk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const HttpError = require("./Models/http-error");
const signupRoute = require("./routes/authentication");
const loginRoute = require("./routes/authentication");
const expenseRoute = require('./routes/expense')

app.use(bodyParser.json());

//The below middleware is used for handling the CORS Error which is a frontend browser error(check notes 146 of MERN statck)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next(); 
});

//this is the entry point for the server
app.use("/", signupRoute);
app.use("/", loginRoute);
app.use("/api",expenseRoute)

app.use((req, res, next) => {
  throw new HttpError("Could not find this route", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured" });
});

//connecting our backend app to DB ; if connected then only we are starting our server otherwise log an error
mongoose
  .connect(URL)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log("Unnable to connect to DB " + " " + err));
   