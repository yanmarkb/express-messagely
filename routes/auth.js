const express = require("express");
const router = new express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");

router.get("/login", function (req, res, next) {
	res.render("login.html");
});

router.get("/register", function (req, res, next) {
	res.render("register.html");
});

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function (req, res, next) {
	const { username, password } = req.body;
	const token = await User.authenticate(username, password);
	await User.updateLoginTimestamp(username);
	return res.json({ token });
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async function (req, res, next) {
	const { username, password, first_name, last_name, phone } = req.body;
	const user = await User.register({
		username,
		password,
		first_name,
		last_name,
		phone,
	});
	const token = await User.authenticate(username, password);
	await User.updateLoginTimestamp(username);
	return res.json({ token });
});

module.exports = router;
