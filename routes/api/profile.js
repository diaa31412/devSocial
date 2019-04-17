const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

// Load profile model
const Profile = require("../models/Profile");

//load User model
const User = require("../models/Users");

//@route Get /api/profile/test
//@desc Test profile route
//@access public
router.get("/test", (req, res) => {
  res.json({
    msg: "profile work"
  });
});

//@route Get /api/profile
//@desc current user profile
//@access private
router.get("", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.body.user })
    .then(profile => {
      if (!profile) {
        errors.noProfile = "there is no profile";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
