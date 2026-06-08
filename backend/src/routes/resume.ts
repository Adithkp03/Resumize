import { Router } from 'express';
import multer from 'multer';
import { parseResume } from '../services/parser';
import { analyzeResume } from '../services/ai';
import { supabase } from '../db/database';
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
    const { error: dbError } = await supabase
      .from('analyses')
      .insert([
        {
          filename: file.originalname,
          target_role: role,
          ats_score: analysis.ats_score,
          analysis_result: analysis
        }
      ]);

    if (dbError) {
      console.error('Failed to save to Supabase:', dbError);
      // We don't necessarily want to fail the whole request if DB save fails, 
      // but let's throw for now to make sure errors are caught.
      throw new Error(`Database save failed: ${dbError.message}`);
    }

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
    const { data: history, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }

    // Supabase returns the JSONB column already parsed as an object,
    // so we don't need to JSON.parse(item.analysis_result) like we did with SQLite.
    res.json(history || []);
  } catch (error: any) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

export default router;
