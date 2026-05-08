const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// get all users (for assigning tasks)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role FROM users ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users' });
  }
});

// get current user profile
router.get('/me', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

module.exports = router;