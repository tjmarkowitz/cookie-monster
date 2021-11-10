// Example of using express-session, cookies and storing
// session data in a MongoDB database
// Dr. Ted Markowitz (11/10/21) tmarkowitz@newhaven.edu

"use strict";

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cookieRouter = require("./routes/cookie-manager");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up MongoDB to hold session data
var store = new MongoDBStore({
        uri: "mongodb://localhost:27017/connect_mongodb_session_test",
        collection: "mySessions",
    },
    function(error) {
        // Should get an error when connection fails
    }
);

// Catch errors
store.on("error", function(error) {
    console.log(error);
});

app.use(
    require("express-session")({
        secret: "This is a secret",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
        store: store,
        // Boilerplate options, see:
        // * https://www.npmjs.com/package/express-session#resave
        // * https://www.npmjs.com/package/express-session#saveuninitialized
        resave: true,
        saveUninitialized: true,
    })
);

app.use("*", cookieRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Display session-related information
app.get("/session", function(req, res, next) {
    if (req.session.views) {
        req.session.views++;
        res.setHeader("Content-Type", "text/html");
        res.write("<p>views: " + req.session.views + "</p>");
        res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
        res.end();
    } else {
        req.session.views = 1;
        res.end("Welcome to the express-session demo. Refresh the page to see session info!");
    }
});

// Clear cookies and session date
app.get("/clear", function(req, res, next) {
    let text = "";
    Object.keys(req.cookies).forEach((element) => {
        console.log(`Cookie: ${element}`);
        res.clearCookie(element);
    });
    res.end("Session and cookie information has been cleared.");
});

//a get route for adding a cookie
app.get("/setcookie", (req, res) => {
    res.cookie(`testCookie`, `I'm a persistent cookie`, {
        maxAge: 1000 * 60 * 10,
        // expires works the same as the maxAge
        expires: new Date("01 12 2022"),
        secure: true,
        httpOnly: true,
        sameSite: "lax",
    });
    res.send("Cookie has been saved successfully");
});

//a get route for adding a cookie
app.get("/getcookies", (req, res) => {
    var cookies = req.cookies;
    res.send({
        Cookies: cookies,
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404, "This is not the page you are looking for..."));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("App listening on port " + port));

module.exports = app;