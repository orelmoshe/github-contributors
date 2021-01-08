const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router({ strict: true });

const controller = new Controller();

router.get('/', controller.getContributors);

module.exports = router;
