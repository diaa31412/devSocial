const express = require("express");

const router = express.Router();

//@route Get /api/profile/test
//@desc Test profile route
//@access public
router.get("/test", (req, res) => {
  res.json({
    msg: "profile work"
  });
});

module.exports = router;
