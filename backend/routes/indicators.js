const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const c = require('../controllers/indicatorController');

router.get('/', c.getAll);
router.get('/:slug', c.getBySlug);
router.post('/', verifyJWT, adminOnly, c.create);
router.put('/:id', verifyJWT, adminOnly, c.update);
router.delete('/:id', verifyJWT, adminOnly, c.remove);

module.exports = router;
