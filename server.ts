import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or when key exists
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Champions Hub Telemetry & Scheduling Engine',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Performance & Biometric Correlation Analyzer
app.post('/api/ai/analyze-performance', async (req, res) => {
  try {
    const { player, biometrics, psnTelemetry, history } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Fallback heuristics response if API key is not yet set
      const restingHR = biometrics?.restingHeartRate || 62;
      const hrv = biometrics?.hrvMs || 74;
      const sleep = biometrics?.sleepScore || 82;
      const apm = psnTelemetry?.avgApm || 280;
      const reactionTime = psnTelemetry?.reactionTimeMs || 172;

      return res.json({
        readinessScore: Math.min(99, Math.round((sleep * 0.4) + (hrv * 0.4) + (100 - restingHR) * 0.2)),
        peakWindow: '14:00 - 18:30 UTC (Optimal Neuro-Muscular State)',
        fatigueRisk: sleep < 75 || hrv < 60 ? 'HIGH' : 'LOW',
        keyInsights: [
          `Strong neural response time (${reactionTime}ms) correlated with ${sleep}% sleep score.`,
          `DualSense stick precision peaks during first 45 mins of gaming; micro-stutters appear after 2h continuous play.`,
          `Heart Rate Variability (${hrv}ms) indicates solid parasympathetic recovery from yesterday's endurance training.`,
        ],
        recommendations: [
          'Schedule intense scrimmages between 15:00 and 17:30 to capitalize on peak cognitive readiness.',
          'Implement a 15-minute wrist/forearm decompressive stretch before the Grand Finals match.',
          'Limit pre-scrim caffeine intake to 100mg to prevent micro-tremors on DualSense thumbsticks.',
        ],
        tacticalFocus: 'Prioritize defensive transitions and clutch 1v2 trigger pacing.',
      });
    }

    const prompt = `You are the Head of Athletic Performance and Lead Esports Analyst for Champions Hub, specializing in professional PlayStation esports competitors (FC 25, NBA 2K, Gran Turismo, Apex Legends, Warzone, Tekken).

Analyze the following athlete's physical athletic data and PlayStation in-game telemetry to produce actionable insights:
Athlete: ${JSON.stringify(player || { name: 'Pro Player', title: 'Competitive Gaming' })}
Biometric & Athletic Metrics: ${JSON.stringify(biometrics || {})}
PlayStation DualSense & Telemetry Stats: ${JSON.stringify(psnTelemetry || {})}
Recent Training History: ${JSON.stringify(history || [])}

Respond ONLY with a valid JSON object matching this schema:
{
  "readinessScore": number (0-100),
  "peakWindow": string (e.g. "14:00 - 18:00 UTC"),
  "fatigueRisk": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "keyInsights": string[],
  "recommendations": string[],
  "tacticalFocus": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in analyze-performance:', error);
    res.status(500).json({ error: error.message || 'AI Performance analysis failed' });
  }
});

// AI Schedule Optimizer
app.post('/api/ai/optimize-schedule', async (req, res) => {
  try {
    const { events, roster, targetTournamentDate } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        conflicts: [
          {
            eventId: 'ev-gym-1',
            issue: 'High-intensity grip/weight training scheduled 90 mins before PSN Major Scrimmage',
            solution: 'Shift physical strength training to 09:00 AM or post-scrim recovery window.',
          }
        ],
        optimizedPlan: [
          { time: '09:00 - 10:15', title: 'Aerobic Cardio & Mobility (Zone 2)', type: 'Athletic Training' },
          { time: '11:00 - 12:30', title: 'Tactical VOD & Playbook Review', type: 'Mental Coaching' },
          { time: '14:00 - 17:00', title: 'PS5 Pro Tier-1 Scrims (Bo7 Series)', type: 'PSN Scrimmage' },
          { time: '17:30 - 18:15', title: 'Post-Match Cryo / Forearm Decompression', type: 'Physio Recovery' }
        ],
        coachSummary: 'Schedule calibrated for peak central nervous system (CNS) arousal during afternoon PSN scrims.'
      });
    }

    const prompt = `You are the Performance Director for an elite PlayStation Esports team.
Analyze the current team schedule and athlete roster to optimize training balance between physical fitness, sleep recovery, DualSense reflex drills, and competitive scrimmages:
Existing Events: ${JSON.stringify(events || [])}
Roster: ${JSON.stringify(roster || [])}
Target Date: ${targetTournamentDate || 'Upcoming Weekend Championship'}

Respond ONLY with a valid JSON object matching this schema:
{
  "conflicts": [
    { "eventId": string, "issue": string, "solution": string }
  ],
  "optimizedPlan": [
    { "time": string, "title": string, "type": string }
  ],
  "coachSummary": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text?.trim() || '{}';
    res.json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error('Error in optimize-schedule:', error);
    res.status(500).json({ error: error.message || 'Schedule optimization failed' });
  }
});

// AI Coach Chat
app.post('/api/ai/coach-chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        reply: `[Champions Hub Athletic Coach]: Based on your recent DualSense telemetry and resting HRV, your cognitive reaction speed is running at 94% readiness. To maximize clutch conversion in late-game rounds, focus on 4-second exhale breathing during respawn timers and maintain 45-degree forearm elevation to reduce wrist extensor load.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are the Champions Hub Head Coach and Sports Science Specialist for PlayStation esports competitors and athletic gamers.
Context of team/player: ${JSON.stringify(context || {})}
Athlete / Coach query: "${message}"

Give a concise, highly practical, expert response blending sports physiology, reaction time optimization, DualSense controller mechanics, mental focus, and tournament readiness.`,
    });

    res.json({ reply: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Error in coach-chat:', error);
    res.status(500).json({ error: error.message || 'AI coach chat failed' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Champions Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
