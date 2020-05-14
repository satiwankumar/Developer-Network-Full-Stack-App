const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../Models/User');

//@route Get api/users
//@desc get all users
//access Public
router.get('/',async (req, res) => {
  try {
    const users =await User.find()
    

res.json(users)

  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')  
  }
  


});

//@route Get Register/users
//@desc Test route
//access Public

router.post(
  '/register',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check(
      'password',
      'please enter a password of 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //   console.log(req.body);
      const { name, email, password } = req.body;
      //see if user exists
      let user = await User.findOne({ email });
      console.log(user);
      if (user) {
        return res.status(400).send('user already exist');
      }

      //get user gravtor

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      user = new User({ name, email, avatar, password });

      //encrypt passsword
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save user
      await user.save();

      const payload = {
        user: { id: user.id },
      };

      jwt.sign(
          payload,
           config.get('jwtToken'),
           {expiresIn:360000},
           (err,token)=>{
                if(err) throw err;
                res.json({token});

           });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }

    //return json webtoken
  }
);

module.exports = router;
