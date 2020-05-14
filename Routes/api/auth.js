const express = require('express');
const router = express.Router();
const bcrypt=  require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check,validationResult} = require('express-validator')

const auth = require('../../Middleware/auth')
const User = require('../../Models/User')

//@route Get api/users
//@desc Test route
//access Public
router.get('/', auth,async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }

})



//@route Post api/login
//@desc Test route
//access Public


router.post(
    '/login',
    [
    
      check('email', 'Email is required').isEmail(),
      check(
        'password',
        'password is required'
      ).exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
          console.log(req.body);
        const { email, password } = req.body;
    
        //see if user exists
        let user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          return res.status(400).send('Invalid Credentials');
        }
        
        const isMatch = bcrypt.compare(password,user.password)
        console.log(isMatch)
        if(!isMatch){
            return res.status(400).send('Invalid Credentials');
        }




      
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
  




module.exports = router