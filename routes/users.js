const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route     POST api/users
// @desc      Regiter a user
// @access    Public
router.post(
  '/',
  [
    check('name', 'Please add name')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     PUT api/users/:id
// @desc      Update user
// @access    Private
router.put('/', auth, async (req, res) => { 
    const { name } = req.body;
  
    if(!name) return res.status(404).json({ msg: 'Please supply a username' });

    const userFields = {};
    userFields.name = name;
  
    try {
      let user = await User.findById(req.user.id);
  
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: userFields },
        { new: true }
      );

      res.json(updatedUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete('/', auth, async (req, res) => {
    try {
      let user = await Contact.findById(req.user.id);
  
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      await User.findByIdAndRemove(req.user.id);
  
      res.json({ msg: 'User removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route     GET api/users
// @desc      Get all users
// @access    Public
router.get('/', auth, async (req, res) => {
    try {
      const users = await User.find().select('-password').sort({
        date: -1
      });

      const contacts = await Contact.find({ user: req.user.id }).sort({
        date: -1
      });

      contactIds = contacts.map(function(contact) {
          return ""+contact.id;
      })

      let filteredUsers = users.filter(function(user) {
        return !contactIds.includes(user._id.toString()) && user._id.toString() !== req.user.id.toString();
      });

      res.json(filteredUsers);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
