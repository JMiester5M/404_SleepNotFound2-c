// HomePage - Main dashboard showing tasks overview and stats
import { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard'; 
import CloudDecoration from '../components/CloudDecoration';

const najahLogo = '/najah-logo.png';
    
export default function HomePage() {
  const sampleTasks = [
    { id: 1, subject: 'Mathematics', description: 'Complete calculus hw', color: '#FFF4B8', done: false, dueDate: null, priority: 'Medium', subtasks: [] },
    { id: 2, subject: 'EL4', description: 'Write 5 paragraphs to essay', color: '#FFD4D4', done: false, dueDate: null, priority: 'High', subtasks: [] },
    { id: 3, subject: 'Art', description: 'Work on painting for 1 hour', color: '#E4C4F4', done: true, dueDate: null, priority: 'Low', subtasks: [] }
  ];

  const [recentTasks, setRecentTasks] = useState(sampleTasks);
  const [filter, setFilter] = useState('All');

  // Fetch tasks from API on mount
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setRecentTasks(data);
        }
      })
      .catch(() => {});
  }, []);

  function toggleCompleted(id) {
    const updatedTasks = recentTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setRecentTasks(updatedTasks);
    
    const task = updatedTasks.find(t => t.id === id);
    fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    }).catch(console.error);
  }

  const todayISO = new Date().toISOString().slice(0,10);

  function matchesFilter(t) {
    if (filter === 'All') return true;
    if (filter === 'Today') return t.dueDate === todayISO;
    return (t.priority || 'Medium') === filter;
  }

  return ( 
    <>
      <div className="home-page"> 
        <CloudDecoration />
        
        <div className="hero-section">
          <div className="profile-icon">
            <img src={najahLogo} alt="Najah Logo" className="logo-image" />
          </div>
          <h1 className="app-title">Najah</h1>
          <p className="tagline">Your peaceful companion for productive studying</p>
          <div className="points-badge">
            <span className="points-icon">✓</span>
            <span>248 points</span>
          </div>
        </div>

        <div className="dashboard-grid">
          <DashboardCard title="Total tasks" value={recentTasks.length} color="#F97316" />
          <DashboardCard title="Completed" value={recentTasks.filter(t => t.done).length} color="#10B981" />
          <DashboardCard title="Subjects" value={5} color="#3B82F6" />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 18 }}>
          {['All','Today','High','Medium','Low'].map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`control-button ${filter === p ? 'pause-play-button' : ''}`}
              style={{ padding: '6px 12px', borderRadius: 20 }}
            >{p}</button>
          ))}
        </div>

        <div className="recent-tasks">
          <h2 className="recent-tasks-title">Recent Tasks</h2>
          <div className="tasks-list">
            {recentTasks.filter(matchesFilter).map(task => (
              <div 
                key={task.id} 
                className={`task-item ${task.done ? 'completed' : ''}`}
                style={{ backgroundColor: task.color || '#fff' }}
              >
                <div className="task-checkbox">
                  <div
                    className={`checkbox ${task.done ? 'checked' : ''}`}
                    onClick={() => toggleCompleted(task.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {task.done && <span>✓</span>}
                  </div>
                </div>

                <div className="task-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <p className={`task-subject ${task.done ? 'strikethrough' : ''}`} style={{ margin: 0 }}>{task.subject}</p>
                    <span style={{ fontSize: 12, padding: '6px 8px', borderRadius: 12, border: '2px solid #333' }}>{task.priority || 'Medium'}</span>
                  </div>

                  {task.description && (
                    <p className={`task-description ${task.done ? 'strikethrough' : ''}`} style={{ margin: '6px 0 0' }}>{task.description}</p>
                  )}
                </div>
              </div>
            ))}
            {recentTasks.filter(matchesFilter).length === 0 && <p style={{ textAlign: 'center', color: '#666' }}>No tasks for this filter.</p>}
          </div>
        </div>
      </div>
      
      {[...Array(15)].map((_, i) => <div key={i} className="bubble"></div>)}
    </>
  );
}
