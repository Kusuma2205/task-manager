const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// get all projects for logged in user
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.* FROM projects p
       LEFT JOIN project_members pm ON p.id = pm.project_id
       WHERE p.owner_id = $1 OR pm.user_id = $1
       GROUP BY p.id ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get projects' });
  }
});

// create project
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name is required' });

  try {
    const result = await db.query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await db.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (project.rows.length === 0) return res.status(404).json({ message: 'Project not found' });

    const members = await db.query(
      `SELECT u.id, u.name, u.email, pm.role FROM users u
       JOIN project_members pm ON u.id = pm.user_id
       WHERE pm.project_id = $1`,
      [req.params.id]
    );

    res.json({ ...project.rows[0], members: members.rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get project' });
  }
});

// add member to project
router.post('/:id/members', async (req, res) => {
  const { userId } = req.body;
  try {
    await db.query(
      'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)',
      [req.params.id, userId]
    );
    res.json({ message: 'Member added' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add member' });
  }
});

// delete project
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = $1 AND owner_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

module.exports = router;