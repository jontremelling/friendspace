const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route     GET api/contacts
// @desc      Get all users contacts
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const result = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });

    let contacts = [];
    for (let i = 0;i<result.length;i++){
        const userContact = await User.findById(result[i].id).select('-password');
        if(!userContact) {
            await Contact.findByIdAndRemove(result[i]._id);
        } else {
            contacts.push(result[i]);
        }
    }

    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private
router.post(
  '/',
  auth,
  async (req, res) => {
    try {
      const userContact = await User.findById(req.body.id).select('-password');
    
      if (!userContact) return res.status(404).json({ msg: 'User not found' });

      const newContact = new Contact({
        id: userContact.id,
        name: userContact.name,
        email: userContact.email,
        phone: userContact.phone,
        user: req.user.id
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: contact.name + ' removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
