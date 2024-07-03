const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const UserModel = require('../models/user.js')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const fetchUser = require('../middlewares/fetchUser');


router.post(
  "/createuser",
  [
    check("name").isLength({ min: 1 }),
    check("dob").isLength({ min: 3 }),
    check("email").isEmail().isLength({ min: 5 }),
    check("password").isLength({ min: 5 }),
  ],
  async (req, resp) => {

    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return resp.status(400).send({ errors: errors });
    }

    try {
      let user = await UserModel.findOne({ email: req.body.email });
      if (user) {
        return resp
          .status(400)
          .json({ success, error: "Sorry, User with this email already exists!" });
      }

      const passwordSalt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, passwordSalt);
      user = await UserModel.create({
        name: req.body.name,
        password: securePassword,
        email: req.body.email,
        dob: req.body.dob,
      });

      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, secretKey);
      success = true;
      resp.json({ success, authToken: authToken });

    }
    catch (error) {
      resp.status(500).send("Internal server error occured");
    }

  }
);



router.post("/loginuser", [
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Password cannot be blank').exists(),
], async (req, resp) => {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      return resp.status(400).json({ success, error: "Please,try to login with correct crendetials" });
    }

    const pw = await bcrypt.compare(password, user.password);
    if (!pw) {
      return resp.status(400).json({ success, error: "Please, try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, secretKey);
    success = true;
    resp.json({ success, authToken: authToken });
  }
  catch (error) {
    resp.status(500).send("Internal server error occured");
  }

});

router.get('/getuser', fetchUser, async (req, resp) => {

  try {
    userid = req.user.id;
    const user = await UserModel.findById(userid).select("-password");
    resp.json(user)
  }
  catch (error) {
    resp.status(500).send("Internal server error occured");
  }

})

module.exports = router;
