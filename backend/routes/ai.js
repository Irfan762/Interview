import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PreparationPlan from '../models/PreparationPlan.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Analyze resume and JD using Gemini
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { resumeText, jdText, company, role, interviewDate } = req.body;
    if (!resumeText || !jdText) return res.status(400).json({ error: 'Resume text and JD text required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return mock analysis if no API key
      return res.json(getMockAnalysis(company, role, interviewDate));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const daysUntilInterview = interviewDate
      ? Math.max(1, Math.ceil((new Date(interviewDate) - new Date()) / (1000 * 60 * 60 * 24)))
      : 14;

    const prompt = `You are an expert career counselor and technical interview coach.

Analyze this student's resume and the job description, then create a personalized preparation plan.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Company: ${company || 'Unknown'}
Role: ${role || 'Software Engineer'}
Days until interview: ${daysUntilInterview}

Respond ONLY with valid JSON in this exact format:
{
  "strongSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "dsaLevel": "beginner|medium|advanced",
  "readinessScore": 65,
  "interviewRounds": ["Online Assessment", "Technical Round 1", "HR Round"],
  "likelyQuestions": ["Tell me about yourself", "Question2", "Question3", "Question4", "Question5"],
  "summary": "2-3 sentence personalized summary",
  "dailyPlan": [
    {"day": 1, "tasks": ["Task 1", "Task 2", "Task 3"]},
    {"day": 2, "tasks": ["Task 1", "Task 2"]}
  ]
}

Make dailyPlan cover ${Math.min(daysUntilInterview, 14)} days. Be specific and actionable.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const analysis = JSON.parse(jsonMatch[0]);

    const plan = await PreparationPlan.create({
      user: req.user.id, company, role,
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      resumeText, jdText, analysis
    });

    res.json({ id: plan._id, analysis });
  } catch (err) {
    console.error('AI analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get user's prep plans
router.get('/plans', authMiddleware, async (req, res) => {
  try {
    const plans = await PreparationPlan.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.json(plans);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get single plan
router.get('/plans/:id', authMiddleware, async (req, res) => {
  try {
    const plan = await PreparationPlan.findById(req.params.id);
    res.json(plan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

function getMockAnalysis(company, role, interviewDate) {
  const daysUntilInterview = interviewDate
    ? Math.max(1, Math.ceil((new Date(interviewDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 14;

  return {
    analysis: {
      strongSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
      missingSkills: ['System Design', 'Dynamic Programming', 'Docker', 'AWS'],
      dsaLevel: 'medium',
      readinessScore: 62,
      interviewRounds: ['Online Assessment (DSA)', 'Technical Interview (DSA + CS)', 'HR Round'],
      likelyQuestions: [
        'Tell me about yourself and your projects',
        'Explain a difficult bug you fixed',
        'What is your approach to system design?',
        'Where do you see yourself in 5 years?',
        'Why do you want to join ' + (company || 'this company') + '?'
      ],
      summary: `Your profile shows strong frontend and backend skills with MERN stack. For ${company || 'this company'}, focus on DSA (especially graphs and DP) and system design basics. Your projects are relevant but need better articulation.`,
      dailyPlan: Array.from({ length: Math.min(daysUntilInterview, 14) }, (_, i) => ({
        day: i + 1,
        tasks: [
          i < 5 ? `DSA: ${['Arrays & Strings', 'Linked Lists & Stacks', 'Trees & BST', 'Graphs BFS/DFS', 'Dynamic Programming'][i]}` : `Revision: ${['CS Fundamentals', 'OS Concepts', 'DBMS & SQL', 'Networks', 'OOP Principles'][i - 5] || 'Mock Test'}`,
          'Solve 2 LeetCode problems on today\'s topic',
          i % 3 === 0 ? 'HR Prep: Write 1 STAR story' : 'Aptitude: 10 questions practice',
        ]
      }))
    }
  };
}

export default router;
