const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const serverless = require("serverless-http");

const app = express();

const PORT = 5000;

require("dotenv").config();

const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL:
				"https://80g8d2o8ig.execute-api.us-east-1.amazonaws.com/dev/auth/github/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log("access token: ", accessToken);
			console.log("refresh token: ", refreshToken);

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

app.use(express.static(__dirname + "/"));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/public");

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect("/");
	}
}

app.get("/", (req, res) => {
	return res.render("login.html");
});

app.get("/auth/github", passport.authenticate("github"));

app.get(
	"/auth/github/callback",
	passport.authenticate("github", { failureRedirect: "/" }),
	(req, res) => {
		return res.redirect("/dev/admin");
	}
);

app.get("/test", (req, res) => {
	return res.send("test ok");
});

app.get("/dev/test", (req, res) => {
	return res.send("dev test ok");
});

app.get("/admin", isLoggedIn, (req, res) => {
	console.log("user: ", req.user);
	return res.render("admin.html", {
		...req.user
	});
});

app.get("/logout", function(req, res) {
	req.logout();
	return res.redirect("/dev");
});

app.listen(PORT, err => {
	if (err) {
		console.error(err);
	} else {
		console.log(`Running on ports ${PORT}`);
	}
});

// module.exports.handler = serverless(app);
