const jwt = require('jsonwebtoken');

exports.verifyAccessToken = (req, res, next) => {
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next();
  } catch(err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if(!req.user) return res.status(401).end();
  if(req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
  next();
};
