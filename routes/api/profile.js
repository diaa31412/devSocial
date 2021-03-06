const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

//load valdiation
const validateProfileInput = require("../../validation/profile");
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

//@route POST /api/profile
//@desc create & update user profile
//@access private
router.post(
  "",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //check validate
    if (!isValid) {
      //return errors
      return res.status(400).json(errors);
    }
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //skills split into array
    if (typeof req.body.skills) {
      profileFields.skills = req.body.skills.split(",");
    }

    //Social
    profileFields.social;
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // create

        //check if handle exits
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            res.status(400).json({ errors: " that handle already exits" });
          }
          // Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
