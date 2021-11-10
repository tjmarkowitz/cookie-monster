var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    let cookies = req.cookies;
    console.log(`Last time seen = ${cookies["lastSeen"]}`);

    let timestamp = new Date();
    res.cookie("lastSeen", timestamp);
    res.render("index", { title: "Express (with cookies)" });
});

module.exports = router;