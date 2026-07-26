const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('favorites');
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user);
  } catch (err) { next(err); }
};

const updateMe = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    if (username) user.username = username;
    if (password) {
      if (password.length < 8) return errorResponse(res, 'Password must be at least 8 characters', 400);
      user.password = password;
    }
    await user.save();
    return successResponse(res, { id: user._id, username: user.username, email: user.email });
  } catch (err) { next(err); }
};

const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({ path: 'favorites', populate: { path: 'category' } });
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user.favorites);
  } catch (err) { next(err); }
};

const addFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { indicatorId } = req.params;
    if (!user.favorites.includes(indicatorId)) user.favorites.push(indicatorId);
    await user.save();
    return successResponse(res, { message: 'Added to favorites' });
  } catch (err) { next(err); }
};

const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.indicatorId);
    await user.save();
    return successResponse(res, { message: 'Removed from favorites' });
  } catch (err) { next(err); }
};

const getWatchlists = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlists.indicators');
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user.watchlists);
  } catch (err) { next(err); }
};

const createWatchlist = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return errorResponse(res, 'Watchlist name is required', 400);
    const user = await User.findById(req.user.id);
    user.watchlists.push({ name, indicators: [] });
    await user.save();
    return successResponse(res, user.watchlists, 201);
  } catch (err) { next(err); }
};

const addToWatchlist = async (req, res, next) => {
  try {
    const { name, id } = req.params;
    const user = await User.findById(req.user.id);
    const wl = user.watchlists.find(w => w.name === name);
    if (!wl) return errorResponse(res, 'Watchlist not found', 404);
    if (!wl.indicators.includes(id)) wl.indicators.push(id);
    await user.save();
    return successResponse(res, wl);
  } catch (err) { next(err); }
};

const removeFromWatchlist = async (req, res, next) => {
  try {
    const { name, id } = req.params;
    const user = await User.findById(req.user.id);
    const wl = user.watchlists.find(w => w.name === name);
    if (!wl) return errorResponse(res, 'Watchlist not found', 404);
    wl.indicators = wl.indicators.filter(iid => iid.toString() !== id);
    await user.save();
    return successResponse(res, wl);
  } catch (err) { next(err); }
};

module.exports = { getMe, updateMe, getFavorites, addFavorite, removeFavorite, getWatchlists, createWatchlist, addToWatchlist, removeFromWatchlist };
