const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const c = require('../controllers/aiController');

router.get('/insights/global', c.getGlobalInsights);
router.get('/insights/category/:slug', c.getCategoryInsights);
router.get('/insights/indicator/:slug', c.getIndicatorInsights);
router.post('/insights/refresh', verifyJWT, adminOnly, c.refreshAll);

module.exports = router;
