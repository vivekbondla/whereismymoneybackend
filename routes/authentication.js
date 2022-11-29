const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth-controller");


// this is the route that accepts signup request -> /signup since entry point is '/' if entry point is '/api' then path is '/api/signup'
router.post("/signup", userController.signup);
router.post('/login',userController.login);

module.exports = router;
