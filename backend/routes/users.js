const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/auth');
const c = require('../controllers/userController');

router.use(verifyJWT);
router.get('/me', c.getMe);
router.put('/me', c.updateMe);
router.get('/me/favorites', c.getFavorites);
router.post('/me/favorites/:indicatorId', c.addFavorite);
router.delete('/me/favorites/:indicatorId', c.removeFavorite);
router.get('/me/watchlists', c.getWatchlists);
router.post('/me/watchlists', c.createWatchlist);
router.post('/me/watchlists/:name/indicators/:id', c.addToWatchlist);
router.delete('/me/watchlists/:name/indicators/:id', c.removeFromWatchlist);

module.exports = router;
