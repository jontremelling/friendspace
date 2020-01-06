const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const User = require("../models/User");

// @route     GET api/contacts
// @desc      Get all users contacts
// @access    Private
router.get("/", auth, async (req, res) => {
  try {
    const user_id = req.query.userId || req.user.id;
    let user = await User.findById(req.user.id);

    let contacts = [];
    for (let i = 0; i < user.contacts.length; i++) {
      const userContact = await User.findById(user.contacts[i]).select(
        "-password"
      );
      if (userContact) {
        contacts.push(userContact);
      }
    }

    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private
router.post("/", auth, async (req, res) => {
  try {
    const userContact = await User.findById(req.body.id).select("-password");

    if (!userContact) return res.status(404).json({ msg: "User not found" });

    let user = await User.findById(req.user.id);
    user.contacts.push(userContact.id);
    updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          contacts: user.contacts
        }
      },
      { new: true }
    );

    res.json(userContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    user.contacts = user.contacts.filter(contactId => {
      return contactId !== req.params.id;
    });

    updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          contacts: user.contacts
        }
      },
      { new: true }
    );

    res.json({ msg: " removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;