const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// get all tasks
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, u.name as assigned_name, p.name as project_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to = $1 OR t.created_by = $1
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get tasks' });
  }
});

// get tasks by project
router.get('/project/:projectId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, u.name as assigned_name FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.project_id = $1 ORDER BY t.created_at DESC`,
      [req.params.projectId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get tasks' });
  }
});

// create task
router.post('/', async (req, res) => {
  const { title, description, project_id, assigned_to, priority, due_date } = req.body;
  if (!title || !project_id) return res.status(400).json({ message: 'Title and project are required' });

  try {
    const result = await db.query(
      `INSERT INTO tasks (title, description, project_id, assigned_to, priority, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, project_id, assigned_to, priority || 'medium', due_date, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// update task status
router.put('/:id', async (req, res) => {
  const { status, title, description, priority, due_date, assigned_to } = req.body;
  try {
    const result = await db.query(
      `UPDATE tasks SET status = COALESCE($1, status), title = COALESCE($2, title),
       description = COALESCE($3, description), priority = COALESCE($4, priority),
       due_date = COALESCE($5, due_date), assigned_to = COALESCE($6, assigned_to)
       WHERE id = $7 RETURNING *`,
      [status, title, description, priority, due_date, assigned_to, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// delete task
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;