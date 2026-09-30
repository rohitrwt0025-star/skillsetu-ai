import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Initialize GoogleGenAI SDK with server-side environment key and mandatory User-Agent
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
    }
  }

  // API Health / Status endpoint
  app.get('/api/system-status', (_req: Request, res: Response) => {
    res.json({
      status: 'operational',
      hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
      model: 'gemini-3.8-flash',
      mode: (apiKey && apiKey !== 'MY_GEMINI_API_KEY') ? 'live' : 'demo'
    });
  });

  // AI Career Assistant Endpoint
  app.post('/api/career-assistant', async (req: Request, res: Response) => {
    try {
      const { message, profileContext, history } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message text is required.' });
        return;
      }

      if (!ai || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Return clear demo indicator
        res.json({
          isDemo: true,
          reply: `[Demo Mode Active] SkillSetu AI is currently running in offline demo mode. You can ask about lateral entry vs PSU jobs, preparation for DET written tests, or NATS apprenticeships. To enable live Gemini 3.8 Flash, connect your Gemini API key in the AI Studio Secrets panel.`,
        });
        return;
      }

      const systemPrompt = `You are "Setu Guru", the dedicated career advisor in the SkillSetu AI platform for diploma engineering students and fresh polytechnic/technical graduates in India.
Your mission is to provide encouraging, realistic, accurate, and actionable career guidance.
Context about the student:
- Qualification: ${profileContext?.qualification || 'Diploma in Engineering'}
- Branch: ${profileContext?.branch || 'Technical'}
- Passing Year: ${profileContext?.graduationYear || '2026'}
- Aggregate Marks: ${profileContext?.percentageOrCgpa || '70%'}
- Current Goal: ${profileContext?.careerGoals || 'Industry placement or Lateral Entry B.Tech'}

Guidelines:
1. Speak clearly, concisely, and with empathy for technical students.
2. Emphasize practical shop-floor, laboratory, and software skills.
3. Be transparent about government notifications, eligibility rules, and state LEET/NATS procedures.
4. Keep responses structured with bullet points and bold highlights.
5. If recommending certifications, favor recognized ones (SWAYAM/NPTEL, MSME, Cisco, open-source).`;

      const promptContents = [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent Query: ${message}` }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContents as any,
        config: {
          temperature: 0.7,
        }
      });

      const replyText = response.text || 'I could not generate an answer right now. Please try again.';
      res.json({
        isDemo: false,
        reply: replyText,
      });
    } catch (err: any) {
      console.error('Gemini API career assistant error:', err);
      res.status(500).json({
        isDemo: true,
        reply: 'An error occurred while contacting the AI service. Falling back to local assistance.',
        error: err.message,
      });
    }
  });

  // Resume Bullet Enhancement Endpoint
  app.post('/api/resume-enhance', async (req: Request, res: Response) => {
    try {
      const { text, type, branch } = req.body;
      if (!text) {
        res.status(400).json({ error: 'Text to enhance is required.' });
        return;
      }

      if (!ai || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Deterministic intelligent offline transformation
        const enhancedOffline = text
          .replace(/worked on/gi, 'Operated and calibrated')
          .replace(/made a project/gi, 'Engineered and demonstrated a prototype')
          .replace(/helped in/gi, 'Collaborated with engineering team to inspect and execute')
          .replace(/good at/gi, 'Demonstrated high practical proficiency in');

        res.json({
          isDemo: true,
          original: text,
          enhanced: `${enhancedOffline} adhering to industrial safety standards.`,
        });
        return;
      }

      const prompt = `You are an expert technical resume writer specializing in polytechnic diploma and fresher engineering resumes for ${branch || 'engineering'}.
Task: Transform the following raw draft bullet or statement into 1-2 punchy, professional, ATS-friendly action statements with strong action verbs (e.g. Fabricated, Calibrated, Programmed, Verified, Interfaced).
Do NOT invent fake marks, degrees, or unmentioned companies.
Raw input: "${text}"

Output only the enhanced text without preamble or quotes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      res.json({
        isDemo: false,
        original: text,
        enhanced: (response.text || text).trim(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // In production, serve dist folder; in dev, attach Vite middleware
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Locate the directory containing Vite's built static assets (index.html, assets/).
    // 1. When running compiled node dist/server.js: __dirname is /workspace/dist, index.html is directly in __dirname.
    // 2. When running from workspace root: index.html is in path.resolve(process.cwd(), 'dist') or path.resolve(__dirname, 'dist').
    let distPath = path.resolve(__dirname);
    if (fs.existsSync(path.resolve(__dirname, 'index.html'))) {
      distPath = path.resolve(__dirname);
    } else if (fs.existsSync(path.resolve(process.cwd(), 'dist', 'index.html'))) {
      distPath = path.resolve(process.cwd(), 'dist');
    } else if (fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'))) {
      distPath = path.resolve(__dirname, 'dist');
    }

    console.log(`Serving static production files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found. Please ensure npm run build was executed.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSetu AI server running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
