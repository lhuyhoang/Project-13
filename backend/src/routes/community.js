const express = require("express");
const router = express.Router();
const { getCounts } = require("../controllers/communityController");

router.get("/", getCounts);

module.exports = router;
