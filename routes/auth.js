const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { verifyAccessToken, requireRole } = require('../middlewares/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);

router.get('/profile', verifyAccessToken, ctrl.getProfile);
router.get('/admin-only', verifyAccessToken, requireRole('admin'), (req,res) => res.json({ secret: 'admin data' }));

module.exports = router;
