const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
	res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const salt = bcrypt.genSaltSync(bcryptSalt);
	const hashPass = bcrypt.hashSync(password, salt);
	if (username === '' || password === '') {
		res.render('auth/signup', {
			errorMessage: 'Username and Password cannot be empty',
		});
		return;
	} else {
		User.findOne({ username: username })
			.then((user) => {
				if (user !== null) {
					res.render('auth/signup', {
						errorMessage: `Username already in use, please select another`,
					});
					return;
				}

				const salt = bcrypt.genSaltSync(bcryptSalt);
				const hashPass = bcrypt.hashSync(password, salt);

				User.create({
					username,
					password: hashPass,
				})
					.then(() => {
						res.redirect('/');
					})
					.catch((error) => {
						next(error);
					});
			})
			.catch((error) => {
				next(error);
			});
	}
});

router.get('/login', (req, res, next) => {
	res.render('auth/login');
});

router.post('/login', (req, res, next) => {
	const theUsername = req.body.username;
	const thePassword = req.body.password;

	if (theUsername === '' || thePassword === '') {
		res.render('auth/login', {
			errorMessage: 'Please enter both, username and password to sign up.',
		});
		return;
	}

	User.findOne({ username: theUsername })
		.then((user) => {
			if (!user) {
				res.render('auth/login', {
					errorMessage: "The username doesn't exist.",
				});
				return;
			}
			if (bcrypt.compareSync(thePassword, user.password)) {
				req.session.currentUser = user;
				res.redirect('/');
			} else {
				res.render('auth/login', {
					errorMessage: 'Incorrect password',
				});
			}
		})
		.catch((error) => {
			next(error);
		});
});

module.exports = router;
