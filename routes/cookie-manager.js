var express = require("express");
var router = express.Router();

/* Match all types of requests looking for any cookies */

router.all("*", function(req, res, next) {
    // Cookies that have not been signed
    console.log(
        `Cookie-Mgr: # of cookies = ${Object.entries(req.cookies).length}`
    );
    console.log(`Cookie-Mgr: Cookies = ${JSON.stringify(req.cookies, null, 2)}`);

    // console.log(`Cookie-Mgr: Last time seen = ${req.cookies["lastSeen"]}`);

    // Update "lastSeen" cookie timestamp
    // let timestamp = new Date();
    // res.cookie("lastSeen", timestamp);

    // add some random cookies
    // for (let i = 0; i < 10; i++) {
    //     let key = "cookie-".concat(i);
    //     res.cookie(key, Math.floor(Math.random() * i));
    // }

    // let jsonObject = {
    //     key1: "value-1",
    //     key2: 3.14159,
    //     key3: false,
    //     key4: null,
    //     key5: [1, -99, true, { key6: "Hi Mom" }],
    // };
    // res.cookie("jsonObject", JSON.stringify(jsonObject));

    next();
});

module.exports = router;