var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
    let userList = "<h1>List of users</h1>";
    res.send(userList);
});

module.exports = router;