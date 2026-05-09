const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'https://zealous-luck-production.up.railway.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/projects', require('./src/routes/projects'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/users', require('./src/routes/users'));

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});