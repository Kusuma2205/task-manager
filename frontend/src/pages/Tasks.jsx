import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', project_id: '',
    assigned_to: '', priority: 'medium', due_date: ''
  });
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/projects'),
        API.get('/users')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.project_id) return setError('Title and project are required');
    try {
      const res = await API.post('/tasks', form);
      setTasks([res.data, ...tasks]);
      setForm({ title: '', description: '', project_id: '', assigned_to: '', priority: 'medium', due_date: '' });
      setShowForm(false); setError('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/tasks/${id}`, { status });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
    } catch (err) {
      alert('Failed to update');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const priorityColor = (p) => p === 'high' ? '#fef2f2' : p === 'medium' ? '#fffbeb' : '#f0fdf4';
  const priorityText = (p) => p === 'high' ? '#dc2626' : p === 'medium' ? '#d97706' : '#16a34a';

  const TaskCard = ({ task }) => (
    <div className="card" style={{ marginBottom: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', margin: 0, flex: 1 }}>{task.title}</h4>
        {isAdmin && (
          <button
            onClick={() => deleteTask(task.id)}
            style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}
          >×</button>
        )}
      </div>

      {task.description && (
        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '10px' }}>{task.description}</p>
      )}

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <span style={{
          background: priorityColor(task.priority), color: priorityText(task.priority),
          fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600'
        }}>
          {task.priority}
        </span>
        {task.project_name && (
          <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>
            {task.project_name}
          </span>
        )}
        {task.due_date && (
          <span style={{
            background: new Date(task.due_date) < new Date() && task.status !== 'done' ? '#fef2f2' : '#f8fafc',
            color: new Date(task.due_date) < new Date() && task.status !== 'done' ? '#dc2626' : '#94a3b8',
            fontSize: '11px', padding: '2px 8px', borderRadius: '20px'
          }}>
            📅 {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {task.assigned_name && (
        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>
          👤 {task.assigned_name}
        </p>
      )}

      {/* Member can only update status of their tasks */}
      {(isAdmin || task.assigned_to == user?.id) ? (
        <select
          value={task.status}
          onChange={e => updateStatus(task.id, e.target.value)}
          style={{
            width: '100%', padding: '8px 12px',
            border: '2px solid #e2e8f0', borderRadius: '8px',
            fontSize: '12px', fontWeight: '600', outline: 'none',
            cursor: 'pointer', background: '#f8fafc', fontFamily: 'inherit'
          }}
        >
          <option value="todo">📋 Todo</option>
          <option value="in_progress">⚡ In Progress</option>
          <option value="done">✅ Done</option>
        </select>
      ) : (
        <div style={{
          padding: '8px 12px', background: '#f8fafc',
          borderRadius: '8px', fontSize: '12px',
          color: '#94a3b8', textAlign: 'center'
        }}>
          Not assigned to you
        </div>
      )}
    </div>
  );

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '2px solid #e2e8f0', borderRadius: '10px',
    fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 4px' }}>
              {isAdmin ? 'All Tasks' : 'My Tasks'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              {isAdmin ? 'Create, assign and manage all tasks' : 'Tasks assigned to you — update their status'}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: showForm ? '#f1f5f9' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: showForm ? '#64748b' : 'white',
                border: 'none', borderRadius: '12px',
                padding: '10px 20px', fontWeight: '700',
                fontSize: '14px', cursor: 'pointer'
              }}
            >
              {showForm ? '✕ Cancel' : '+ New Task'}
            </button>
          )}
        </div>

        {/* Member notice */}
        {!isAdmin && (
          <div style={{
            background: 'linear-gradient(135deg, #065f46, #0f766e)',
            borderRadius: '14px', padding: '16px 20px',
            marginBottom: '24px', color: 'white'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              👤 <b>Member View</b> — You can update the status of tasks assigned to you. Tasks not assigned to you are view-only.
            </p>
          </div>
        )}

        {/* Create Form — Admin Only */}
        {isAdmin && showForm && (
          <div className="card p-6" style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1e1b4b', marginBottom: '16px' }}>Create New Task</h2>
            {error && (
              <div style={{
                background: '#fef2f2', color: '#dc2626',
                padding: '10px 14px', borderRadius: '8px',
                marginBottom: '14px', fontSize: '13px'
              }}>{error}</div>
            )}
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="text" name="title" placeholder="Task title *" value={form.title} onChange={handleChange} style={inputStyle} />
                <select name="project_id" value={form.project_id} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Project *</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input type="text" name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} style={inputStyle} />
                <select name="assigned_to" value={form.assigned_to} onChange={handleChange} style={inputStyle}>
                  <option value="">Assign To (optional)</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
                <select name="priority" value={form.priority} onChange={handleChange} style={inputStyle}>
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <input type="date" name="due_date" value={form.due_date} onChange={handleChange} style={inputStyle} />
              </div>
              <button
                type="submit"
                style={{
                  marginTop: '16px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '11px 24px', fontWeight: '700',
                  fontSize: '14px', cursor: 'pointer'
                }}
              >
                Create Task
              </button>
            </form>
          </div>
        )}

        {/* Kanban Board */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading tasks...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {/* Todo */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>Todo</h3>
                <span style={{ background: '#eff6ff', color: '#6366f1', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '700', marginLeft: 'auto' }}>
                  {todoTasks.length}
                </span>
              </div>
              {todoTasks.length === 0 ? (
                <p style={{ color: '#cbd5e1', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No tasks</p>
              ) : todoTasks.map(t => <TaskCard key={t.id} task={t} />)}
            </div>

            {/* In Progress */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>In Progress</h3>
                <span style={{ background: '#fffbeb', color: '#d97706', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '700', marginLeft: 'auto' }}>
                  {inProgressTasks.length}
                </span>
              </div>
              {inProgressTasks.length === 0 ? (
                <p style={{ color: '#cbd5e1', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No tasks</p>
              ) : inProgressTasks.map(t => <TaskCard key={t.id} task={t} />)}
            </div>

            {/* Done */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>Done</h3>
                <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '700', marginLeft: 'auto' }}>
                  {doneTasks.length}
                </span>
              </div>
              {doneTasks.length === 0 ? (
                <p style={{ color: '#cbd5e1', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No tasks</p>
              ) : doneTasks.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;