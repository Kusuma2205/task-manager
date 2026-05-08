import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return setError('Project name is required');
    setSubmitting(true);
    try {
      const res = await API.post('/projects', { name, description });
      setProjects([res.data, ...projects]);
      setName(''); setDescription(''); setShowForm(false); setError('');
    } catch (err) {
      setError('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 4px' }}>Projects</h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              {isAdmin ? 'Manage all your projects and team members' : 'Projects you are a member of'}
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
              {showForm ? '✕ Cancel' : '+ New Project'}
            </button>
          )}
        </div>

        {/* Member Notice */}
        {!isAdmin && (
          <div style={{
            background: 'linear-gradient(135deg, #065f46, #0f766e)',
            borderRadius: '14px', padding: '16px 20px',
            marginBottom: '24px', color: 'white'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              👤 <b>Member View</b> — You can view projects you're part of and see their tasks. Contact an Admin to create new projects.
            </p>
          </div>
        )}

        {/* Create Form — Admin Only */}
        {isAdmin && showForm && (
          <div className="card p-6" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1e1b4b', marginBottom: '16px' }}>Create New Project</h2>
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', padding: '10px 14px',
                borderRadius: '8px', marginBottom: '14px', fontSize: '13px'
              }}>{error}</div>
            )}
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Project name *"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', marginBottom: '12px',
                  border: '2px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '12px 16px', marginBottom: '16px',
                  border: '2px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit', resize: 'vertical'
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '11px 24px', fontWeight: '700',
                  fontSize: '14px', cursor: 'pointer'
                }}
              >
                {submitting ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📁</p>
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>
              {isAdmin ? 'No projects yet. Create your first project!' : 'You are not part of any projects yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {projects.map((p, i) => (
              <div key={p.id} className="card p-6" style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Color accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                  background: ['linear-gradient(90deg,#6366f1,#8b5cf6)', 'linear-gradient(90deg,#10b981,#3b82f6)', 'linear-gradient(90deg,#f59e0b,#ef4444)', 'linear-gradient(90deg,#ec4899,#8b5cf6)'][i % 4]
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e1b4b', margin: 0 }}>{p.name}</h3>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{
                        background: 'none', border: 'none',
                        color: '#fca5a5', cursor: 'pointer',
                        fontSize: '13px', padding: '2px 6px',
                        borderRadius: '6px'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px', minHeight: '20px' }}>
                  {p.description || 'No description provided'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/projects/${p.id}`}
                    style={{
                      background: '#f0f4ff', color: '#6366f1',
                      padding: '6px 14px', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;