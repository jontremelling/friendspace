const express = require('express');
const multer = require('multer');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Contact = require('../models/Contact');

// Multer File upload settings
const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

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
    // const { name } = req.body;
    const userFields = req.body;
    // if(!userFields.name) return res.status(404).json({ msg: 'Please supply a username' });

    
    // userFields.name = name;
  
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

// @route     DELETE api/users/:id
// @desc      Delete user
// @access    Private
router.delete('/:id', auth, async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
  
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      await User.findByIdAndRemove(req.params.id);
  
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

      contactIds = contacts.map(contact => {
          return ""+contact.id;
      })

      let filteredUsers = users.filter(user => {
        return !contactIds.includes(user._id.toString()) && user._id.toString() !== req.user.id.toString();
      });

      res.json(filteredUsers);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// POST User
router.post('/update-profile', upload.single('avatar'), async (req, res, next) => {
    const user = await User.findById(req.body.id);
    user.avatar = 'http://localhost:5000/' + req.file.filename;
    user.save().then(result => {
      res.status(201).json({
        message: "User registered successfully!"
      })
    }).catch(err => {
      console.log(err),
        res.status(500).json({
          error: err
        });
    })
  })

module.exports = router;
