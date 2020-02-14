const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const serverless = require("serverless-http");

const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
require("dotenv").config();

const app = express();

const PORT = 5000;

const ROOT_DIR = "/passportjs-frontend/build";

app.use(express.static(__dirname + ROOT_DIR));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "W$q4=25*8%v-}UV",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log("access token: ", accessToken);
      console.log("profile: ", profile);

      return cb(null, {
        username: profile.username,
        profile_pic: profile.photos[0].value,
        display_name: profile.displayName
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return req.xhr ? res.send(false) : res.redirect("/");
  }
}

app.get(["/", "/repos"], (req, res) => {
  return res.sendFile(path.join(__dirname, ROOT_DIR, "index.html"));
});

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    return res.redirect("/");
  }
);

app.get("/user", isLoggedIn, (req, res) => {
  return res.send(req.user);
});

app.get("/logout", function(req, res) {
  req.logout();
  return res.redirect("/");
});

app.listen(PORT, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on ports ${PORT}`);
  }
});

// module.exports.handler = serverless(app);
