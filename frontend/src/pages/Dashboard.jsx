import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function StatCard({ label, value, color, bg }) {
  return (
    <div className="card p-6" style={{ borderTop: `4px solid ${color}` }}>
      <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ fontSize: '36px', fontWeight: '800', color: color, margin: '8px 0 0' }}>{value}</p>
    </div>
  );
}

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', border: '4px solid #e2e8f0',
            borderTop: '4px solid #6366f1', borderRadius: '50%',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#94a3b8' }}>Loading your dashboard...</p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e1b4b', margin: 0 }}>
              Welcome back, {user?.name}!
            </h1>
            <span className={isAdmin ? 'badge-admin' : 'badge-member'}>
              {isAdmin ? '👑 ADMIN' : '👤 MEMBER'}
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
            {isAdmin
              ? 'You have full access to manage projects, tasks, and team members.'
              : 'Here are your assigned tasks and project updates.'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard label="Total Tasks" value={totalTasks} color="#6366f1" />
          <StatCard label="Completed" value={completedTasks} color="#10b981" />
          <StatCard label="In Progress" value={inProgressTasks} color="#f59e0b" />
          <StatCard label="Overdue" value={overdueTasks} color="#ef4444" />
        </div>

        {/* Admin Extra Info */}
        {isAdmin && (
          <div className="card p-6" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', color: 'white' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'rgba(255,255,255,0.9)' }}>
              👑 Admin Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: '800', color: '#a5b4fc' }}>{projects.length}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Total Projects</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: '800', color: '#6ee7b7' }}>{todoTasks}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Todo Tasks</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '28px', fontWeight: '800', color: '#fca5a5' }}>{overdueTasks}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Need Attention</p>
              </div>
            </div>
          </div>
        )}

        {/* Member Info */}
        {!isAdmin && (
          <div className="card p-6" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #065f46, #0f766e)', color: 'white' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
              👤 Your Work Summary
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>
              You have <b style={{ color: '#6ee7b7' }}>{todoTasks} tasks</b> pending, <b style={{ color: '#fcd34d' }}>{inProgressTasks} in progress</b>, and <b style={{ color: '#a7f3d0' }}>{completedTasks} completed</b>.
              {overdueTasks > 0 && <span style={{ color: '#fca5a5' }}> ⚠️ {overdueTasks} task(s) are overdue!</span>}
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Projects */}
          <div className="card p-6">
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e1b4b', marginBottom: '16px' }}>
              {isAdmin ? '📁 All Projects' : '📁 My Projects'} ({projects.length})
            </h2>
            {projects.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>No projects yet</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {projects.slice(0, 5).map(p => (
                  <li key={p.id} style={{
                    padding: '10px 0', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ color: '#334155', fontWeight: '500', fontSize: '14px' }}>{p.name}</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tasks */}
          <div className="card p-6">
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e1b4b', marginBottom: '16px' }}>
              {isAdmin ? '✅ All Tasks' : '✅ My Assigned Tasks'} ({tasks.length})
            </h2>
            {tasks.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>No tasks yet</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {tasks.slice(0, 5).map(t => (
                  <li key={t.id} style={{
                    padding: '10px 0', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ color: '#334155', fontSize: '14px', fontWeight: '500' }}>{t.title}</span>
                    <span style={{
                      fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600',
                      background: t.status === 'done' ? '#d1fae5' : t.status === 'in_progress' ? '#fef3c7' : '#e0e7ff',
                      color: t.status === 'done' ? '#065f46' : t.status === 'in_progress' ? '#92400e' : '#3730a3'
                    }}>
                      {t.status === 'in_progress' ? 'In Progress' : t.status === 'done' ? 'Done' : 'Todo'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;