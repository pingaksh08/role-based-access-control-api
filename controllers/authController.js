const User = require('../models/Users');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, createRefreshTokenString, hashToken } = require('../utils/tokens');

// Registration
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });
  await user.save();
  res.status(201).json({ message: 'Registered' });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid creds' });

  const accessToken = generateAccessToken(user);
  const refreshTokenPlain = createRefreshTokenString();
  const tokenHash = hashToken(refreshTokenPlain);

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * (parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7))); // days

  await RefreshToken.create({ user: user._id, tokenHash, expiresAt });

  // Set httpOnly cookie for refresh token
  res.cookie('refreshToken', refreshTokenPlain, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'Strict',
    maxAge: (expiresAt - Date.now())
  });

  res.json({ accessToken });
};

// Refresh
exports.refresh = async (req, res) => {
  const refreshTokenPlain = req.cookies.refreshToken;
  if(!refreshTokenPlain) return res.status(401).json({ message: 'No token' });

  const tokenHash = hashToken(refreshTokenPlain);
  const stored = await RefreshToken.findOne({ tokenHash });
  if(!stored || stored.expiresAt < Date.now()) return res.status(401).json({ message: 'Invalid token' });

  const user = await User.findById(stored.user);
  if(!user) return res.status(401).json({ message: 'Invalid token' });

  // Optionally rotate refresh token: delete stored & create new one (recommended)
  await RefreshToken.deleteOne({ _id: stored._id });

  const newRefreshPlain = createRefreshTokenString();
  const newHash = hashToken(newRefreshPlain);
  const expiresAt = new Date(Date.now() + 1000*60*60*24*(parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS||7)));

  await RefreshToken.create({ user: user._id, tokenHash: newHash, expiresAt });

  res.cookie('refreshToken', newRefreshPlain, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'Strict',
    maxAge: (expiresAt - Date.now())
  });

  const accessToken = generateAccessToken(user);
  res.json({ accessToken });
};

// Logout
exports.logout = async (req, res) => {
  const refreshTokenPlain = req.cookies.refreshToken;
  if(refreshTokenPlain) {
    const tokenHash = hashToken(refreshTokenPlain);
    await RefreshToken.deleteOne({ tokenHash });
    res.clearCookie('refreshToken');
  }
  res.json({ message: 'Logged out' });
};

// Example protected route
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
