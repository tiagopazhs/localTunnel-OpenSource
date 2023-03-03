const router = require('express').Router();
const LandingController = require('../controllers/landing.controller');

router.get('/', LandingController.getHome)

module.exports = router