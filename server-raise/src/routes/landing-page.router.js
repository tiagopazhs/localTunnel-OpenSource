const router = require('express').Router();
const LandingPageController = require('../controllers/landing-page.controller');

router.get('/', LandingPageController.getHome)

module.exports = router