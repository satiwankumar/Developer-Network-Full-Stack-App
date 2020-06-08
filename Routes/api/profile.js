const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../Middleware/auth');
const Profile = require('../../Models/Profile');
const User = require('../../Models/User');
const { check, validationResult } = require('express-validator');

//@route Get api/profile/me
//@desc get current user profile
//access Private
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is not profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server Error');
  }
});

//@route Get api/profile
//@desc get create user profile or update
//access Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkdin
    } = req.body;

    //build profile objects
    const profileFeilds = {};
    profileFeilds.user = req.user.id;
    if (company) profileFeilds.company = company;
    if (website) profileFeilds.website = website;
    if (location) profileFeilds.location = location;
    if (bio) profileFeilds.bio = bio;
    if (status) profileFeilds.status = status;

    if (githubusername) profileFeilds.githubusername = githubusername;
    if (skills) {
      profileFeilds.skills = skills.split(',').map((skill) => skill.trim());
    }
    console.log(profileFeilds.skills);

    //build social object
    profileFeilds.social = {};
    if (youtube) profileFeilds.social.youtube = youtube;
    if (twitter) profileFeilds.social.twitter = twitter;
    if (facebook) profileFeilds.social.facebook = facebook;
    if (linkdin) profileFeilds.social.linkdin = linkdin;
    if (instagram) profileFeilds.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      //profile exists then update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        );
        return res.json(profile);
      }

      //else if profile doesnot exist create it
      profile = new Profile(profileFeilds);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route Get api/profile
//@desc get all profile
//access public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route Get api/profile/user/user_id
//@desc get by profile by user id
//access public

router.get('/user/:user_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar', 'email']);

    if (!profile) {
      return res.status(500).send('profile not found');
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).send('profile not found');
    }

    res.status(500).send('Server Error');
  }
});

//@route Delte api/profile/
//@desc Delete profile user and post
//access private

router.delete('/', auth, async (req, res) => {
  try {
    //@todo remove user posts

    //Remove profile
    let profile = await Profile.findOneAndRemove({ user: req.user.id });
    //reomveuser
    await User.findOneAndRemove({ _id: req.user.id });

    if (!profile) {
      return res.status(500).send('profile not found');
    }

    res.json('user deleted');
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).send('profile not found');
    }

    res.status(500).send('Server Error');
  }
});

//@route put api/profile/experience
//@desc adl profile expereice
//access private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'titile is required').not().isEmpty(),
      check('company', 'company is required').not().isEmpty(),
      check('start', 'start is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      start,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      start,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route put api/profile/experience/:exp_id
//@desc adl profile expereice
//access private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      res.status(500).send('profile not found');
    }

    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    console.log(removeIndex);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route put api/profile/education
//@desc adl profile education
//access private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required').not().isEmpty(),
      check('degree', 'degree is required').not().isEmpty(),
      check('start', 'From is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const {
      school,
      degree,
      fieldofstudy,
      start,
      end,
      current,
      description,
    } = req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      start,
      end,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        res.status(400).send('profile not found');
      }
      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route put api/profile/education/:edu_id
//@desc adl profile expereice
//access private
router.delete('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      res.status(500).send('profile not found');
    }

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    console.log(removeIndex);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
//@route put api/profile/github/:username
//@desc Get user repos from github
//access private
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api/github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'no github profile found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server Error');
  }
});




module.exports = router;
