import express from 'express';
import Community from '../models/Community.js';
import CommunityPost from '../models/CommunityPost.js';
import Comment from '../models/Comment.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all communities
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { isPublic: true };
    if (category && category !== 'all') query.category = category;
    if (search) query.$text = { $search: search };
    const communities = await Community.find(query).populate('createdBy', 'name').sort({ memberCount: -1 }).limit(50);
    res.json(communities);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Create community
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, college, category, tags } = req.body;
    const community = await Community.create({ name, description, college, category, tags, createdBy: req.user.id, members: [req.user.id], memberCount: 1 });
    res.json(community);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Join/leave community
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: 'Community not found' });
    const isMember = community.members.includes(req.user.id);
    if (isMember) {
      community.members.pull(req.user.id);
      community.memberCount = Math.max(0, community.memberCount - 1);
    } else {
      community.members.push(req.user.id);
      community.memberCount += 1;
    }
    await community.save();
    res.json({ joined: !isMember, memberCount: community.memberCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get posts in community
router.get('/:id/posts', optionalAuth, async (req, res) => {
  try {
    const { company, type } = req.query;
    let query = { community: req.params.id };
    if (company) query.company = new RegExp(company, 'i');
    if (type && type !== 'all') query.type = type;
    const posts = await CommunityPost.find(query).populate('author', 'name college batch').sort({ isPinned: -1, createdAt: -1 }).limit(50);
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Create post
router.post('/:id/posts', authMiddleware, async (req, res) => {
  try {
    const { title, description, type, company, role, package: pkg, hiringDate, eligibility, tags } = req.body;
    const post = await CommunityPost.create({ community: req.params.id, author: req.user.id, title, description, type, company, role, package: pkg, hiringDate, eligibility, tags });
    const populated = await post.populate('author', 'name college batch');
    res.json(populated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Like/unlike post
router.post('/posts/:postId/like', authMiddleware, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const liked = post.likes.includes(req.user.id);
    if (liked) { post.likes.pull(req.user.id); post.likeCount--; }
    else { post.likes.push(req.user.id); post.likeCount++; }
    await post.save();
    res.json({ liked: !liked, likeCount: post.likeCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name college').sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add comment
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.create({ post: req.params.postId, author: req.user.id, text });
    await CommunityPost.findByIdAndUpdate(req.params.postId, { $inc: { commentCount: 1 } });
    const populated = await comment.populate('author', 'name college');
    res.json(populated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get single community
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate('createdBy', 'name');
    if (!community) return res.status(404).json({ error: 'Not found' });
    res.json(community);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
