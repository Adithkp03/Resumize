import { Router } from 'express';
import multer from 'multer';
import { parseResume } from '../services/parser';
import { analyzeResume } from '../services/ai';
import { getDb } from '../db/database';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    const { role, jobDescription } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No resume uploaded' });
    }
    if (!role) {
      return res.status(400).json({ error: 'Target role is required' });
    }

    // 1. Parse document
    const text = await parseResume(file.path, file.mimetype);

    // 2. Analyze with AI
    const analysis = await analyzeResume(text, role, jobDescription);

    // 3. Save to Database
    const db = getDb();
    await db.run(
      `INSERT INTO analyses (filename, target_role, ats_score, analysis_result) VALUES (?, ?, ?, ?)`,
      [file.originalname, role, analysis.ats_score, JSON.stringify(analysis)]
    );

    // Cleanup uploaded file
    fs.unlinkSync(file.path);

    // 4. Return result
    res.json(analysis);
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const db = getDb();
    const history = await db.all(`SELECT * FROM analyses ORDER BY created_at DESC`);
    
    // Parse the analysis_result JSON string back into an object
    const parsedHistory = history.map((item: any) => ({
      ...item,
      analysis_result: JSON.parse(item.analysis_result)
    }));

    res.json(parsedHistory);
  } catch (error: any) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

export default router;
