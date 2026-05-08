import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/project/${id}`),
        API.get('/users')
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await API.post(`/projects/${id}/members`, { userId });
      fetchData();
      setUserId('');
    } catch (err) {
      alert('Failed to add member');
    }
  };

  if (loading) return <div><Navbar /><p className="text-center mt-10 text-gray-500">Loading...</p></div>;
  if (!project) return <div><Navbar /><p className="text-center mt-10 text-gray-500">Project not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{project.name}</h1>
        <p className="text-gray-500 mb-6">{project.description || 'No description'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-semibold mb-4">Team Members ({project.members?.length || 0})</h2>
            {project.members?.length === 0 ? (
              <p className="text-gray-400 text-sm">No members yet</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {project.members?.map(m => (
                  <li key={m.id} className="flex items-center gap-2 py-2 border-b last:border-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={addMember} className="flex gap-2 mt-3">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Add member...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                Add
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-semibold mb-4">Tasks ({tasks.length})</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-sm">No tasks in this project</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map(t => (
                  <li key={t.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm text-gray-700">{t.title}</p>
                      {t.assigned_name && <p className="text-xs text-gray-400">Assigned: {t.assigned_name}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      t.status === 'done' ? 'bg-green-100 text-green-600' :
                      t.status === 'in_progress' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>{t.status}</span>
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

export default ProjectDetail;