import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = '/api/community';
const POST_TYPES = [
  { value: 'all', label: 'All Posts' },
  { value: 'company_visit', label: '🏢 Company Visit' },
  { value: 'interview_exp', label: '💬 Interview Exp' },
  { value: 'oa_link', label: '🔗 OA Link' },
  { value: 'hiring', label: '📢 Hiring' },
  { value: 'referral', label: '🤝 Referral' },
  { value: 'tip', label: '💡 Tip' },
];
const TYPE_ICONS = { company_visit: '🏢', interview_exp: '💬', oa_link: '🔗', aptitude_q: '🧮', hiring: '📢', referral: '🤝', tip: '💡', general: '📝' };

export default function CommunityPage() {
  const { authFetch, user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postFilter, setPostFilter] = useState('all');
  const [newComm, setNewComm] = useState({ name: '', description: '', college: '', category: 'college' });
  const [newPost, setNewPost] = useState({ title: '', description: '', type: 'general', company: '', role: '', package: '', tags: '' });
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => { loadCommunities(); }, []);
  useEffect(() => { if (selected) loadPosts(); }, [selected, postFilter]);

  const loadCommunities = async () => {
    try { const r = await authFetch(`${API}`); const d = await r.json(); setCommunities(Array.isArray(d) ? d : []); } catch {}
  };
  const loadPosts = async () => {
    try { const q = postFilter !== 'all' ? `?type=${postFilter}` : ''; const r = await authFetch(`${API}/${selected._id}/posts${q}`); const d = await r.json(); setPosts(Array.isArray(d) ? d : []); } catch {}
  };
  const loadComments = async (postId) => {
    try { const r = await authFetch(`${API}/posts/${postId}/comments`); const d = await r.json(); setComments(c => ({ ...c, [postId]: d })); } catch {}
  };

  const createCommunity = async () => {
    try {
      const r = await authFetch(API, { method: 'POST', body: JSON.stringify(newComm) });
      const d = await r.json(); setCommunities(c => [d, ...c]); setShowCreate(false); setNewComm({ name: '', description: '', college: '', category: 'college' });
    } catch {}
  };

  const joinCommunity = async (id) => {
    try { await authFetch(`${API}/${id}/join`, { method: 'POST' }); loadCommunities(); } catch {}
  };

  const createPost = async () => {
    try {
      const body = { ...newPost, tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean) };
      const r = await authFetch(`${API}/${selected._id}/posts`, { method: 'POST', body: JSON.stringify(body) });
      const d = await r.json(); setPosts(p => [d, ...p]); setShowPostForm(false);
      setNewPost({ title: '', description: '', type: 'general', company: '', role: '', package: '', tags: '' });
    } catch {}
  };

  const likePost = async (postId) => {
    try {
      const r = await authFetch(`${API}/posts/${postId}/like`, { method: 'POST' });
      const d = await r.json();
      setPosts(ps => ps.map(p => p._id === postId ? { ...p, likeCount: d.likeCount, likes: d.liked ? [...(p.likes || []), user?.id] : (p.likes || []).filter(l => l !== user?.id) } : p));
    } catch {}
  };

  const addComment = async (postId) => {
    if (!newComment.trim()) return;
    try {
      await authFetch(`${API}/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text: newComment }) });
      setNewComment(''); loadComments(postId);
      setPosts(ps => ps.map(p => p._id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p));
    } catch {}
  };

  // Community list view
  if (!selected) {
    return (
      <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>💬 Communities</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Join college groups & placement discussions</div>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowCreate(true)} style={btnGold}>➕ Create Community</button>
          )}
        </div>

        {/* Create modal */}
        {showCreate && <Modal title="Create Community" onClose={() => setShowCreate(false)}>
          <Input label="Name" value={newComm.name} onChange={v => setNewComm(c => ({ ...c, name: v }))} placeholder="RSCOE Pune Community" />
          <Input label="Description" value={newComm.description} onChange={v => setNewComm(c => ({ ...c, description: v }))} placeholder="Discuss placements..." />
          <Input label="College" value={newComm.college} onChange={v => setNewComm(c => ({ ...c, college: v }))} placeholder="RSCOE" />
          <select value={newComm.category} onChange={e => setNewComm(c => ({ ...c, category: e.target.value }))} style={selectStyle}>
            <option value="college">College</option><option value="company">Company</option><option value="batch">Batch</option><option value="general">General</option>
          </select>
          <button onClick={createCommunity} style={{ ...btnGold, width: '100%', marginTop: 16 }}>Create</button>
        </Modal>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {communities.map(c => (
            <div key={c._id} style={cardStyle} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{c.description?.slice(0, 80)}</div>
                </div>
                <span style={{ fontSize: 10, background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '4px 10px', borderRadius: 8, fontWeight: 600 }}>{c.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>👥 {c.memberCount || 0} members</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => joinCommunity(c._id)} style={btnSmall}>
                    {c.members?.includes(user?.id) ? '✓ Joined' : 'Join'}
                  </button>
                  <button onClick={() => setSelected(c)} style={btnSmallGold}>Open →</button>
                </div>
              </div>
            </div>
          ))}
          {communities.length === 0 && <div style={{ color: '#64748b', padding: 20 }}>No communities yet. Create one to get started! 🚀</div>}
        </div>
      </div>
    );
  }

  // Community detail view (posts)
  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', fontSize: 22 }}>←</button>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>{selected.name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>👥 {selected.memberCount || 0} members</div>
          </div>
        </div>
        <button onClick={() => setShowPostForm(true)} style={btnGold}>📝 New Post</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {POST_TYPES.map(t => (
          <button key={t.value} onClick={() => setPostFilter(t.value)} style={{
            padding: '6px 14px', fontSize: 12, borderRadius: 10,
            border: postFilter === t.value ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
            background: postFilter === t.value ? 'rgba(255,215,0,0.1)' : 'rgba(15,23,42,0.5)',
            color: postFilter === t.value ? '#FFD700' : '#94a3b8', cursor: 'pointer', fontWeight: postFilter === t.value ? 600 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Create post modal */}
      {showPostForm && <Modal title="Create Post" onClose={() => setShowPostForm(false)}>
        <Input label="Title" value={newPost.title} onChange={v => setNewPost(p => ({ ...p, title: v }))} placeholder="TCS came to campus!" />
        <Textarea label="Description" value={newPost.description} onChange={v => setNewPost(p => ({ ...p, description: v }))} placeholder="Share details..." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Company" value={newPost.company} onChange={v => setNewPost(p => ({ ...p, company: v }))} placeholder="TCS" />
          <Input label="Role" value={newPost.role} onChange={v => setNewPost(p => ({ ...p, role: v }))} placeholder="SDE" />
          <Input label="Package" value={newPost.package} onChange={v => setNewPost(p => ({ ...p, package: v }))} placeholder="7 LPA" />
          <select value={newPost.type} onChange={e => setNewPost(p => ({ ...p, type: e.target.value }))} style={selectStyle}>
            {POST_TYPES.filter(t => t.value !== 'all').map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <Input label="Tags (comma separated)" value={newPost.tags} onChange={v => setNewPost(p => ({ ...p, tags: v }))} placeholder="DSA, aptitude, interview" />
        <button onClick={createPost} style={{ ...btnGold, width: '100%', marginTop: 16 }}>Post</button>
      </Modal>}

      {/* Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {posts.map(p => (
          <div key={p._id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{TYPE_ICONS[p.type] || '📝'}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{p.title}</span>
                </div>
                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 10 }}>{p.description}</div>
                {(p.company || p.role || p.package) && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {p.company && <Tag text={`🏢 ${p.company}`} />}
                    {p.role && <Tag text={`💼 ${p.role}`} />}
                    {p.package && <Tag text={`💰 ${p.package}`} />}
                  </div>
                )}
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  by {p.author?.name || 'Anonymous'} · {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => likePost(p._id)} style={actionBtn}>
                {p.likes?.includes(user?.id) ? '❤️' : '🤍'} {p.likeCount || 0}
              </button>
              <button onClick={() => { setShowComments(showComments === p._id ? null : p._id); if (!comments[p._id]) loadComments(p._id); }} style={actionBtn}>
                💬 {p.commentCount || 0}
              </button>
            </div>
            {/* Comments section */}
            {showComments === p._id && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {(comments[p._id] || []).map(c => (
                  <div key={c._id} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, marginBottom: 6, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: '#FFD700', fontSize: 12 }}>{c.author?.name}</span>
                    <span style={{ color: '#cbd5e1', marginLeft: 8 }}>{c.text}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..."
                    onKeyDown={e => e.key === 'Enter' && addComment(p._id)}
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 13, outline: 'none' }} />
                  <button onClick={() => addComment(p._id)} style={btnSmallGold}>Send</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>No posts yet. Be the first to share! 🎉</div>}
      </div>
    </div>
  );
}

// Shared sub-components
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 500, background: 'rgba(20,20,40,0.98)', border: '1px solid rgba(255,215,0,0.2)',
        borderRadius: 20, padding: '28px 24px', maxHeight: '80vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}
function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
    </div>
  );
}
function Tag({ text }) {
  return <span style={{ fontSize: 11, background: 'rgba(255,215,0,0.08)', color: '#FFD700', padding: '3px 10px', borderRadius: 8, border: '1px solid rgba(255,215,0,0.15)' }}>{text}</span>;
}

const hoverIn = e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; };
const hoverOut = e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; };
const cardStyle = { background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 22px', transition: 'all 0.3s' };
const inputStyle = { width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const selectStyle = { ...inputStyle, marginBottom: 12 };
const btnGold = { padding: '10px 20px', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 };
const btnSmall = { padding: '6px 14px', fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer' };
const btnSmallGold = { padding: '6px 14px', fontSize: 11, fontWeight: 600, background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 10, cursor: 'pointer' };
const actionBtn = { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 };
