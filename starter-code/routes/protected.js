const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
	if (req.session.currentUser) {
		next();
	} else {
		res.redirect('/auth/login');
	}
});
router.get('/main', (req, res, next) => {
	res.render('protected/main');
});

router.get('/private', (req, res, next) => {
	res.render('protected/private');
});

module.exports = router;
