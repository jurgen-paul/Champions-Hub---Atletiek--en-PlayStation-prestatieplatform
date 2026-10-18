import React, { useState } from 'react';
import { Player, AIAnalysisResult } from '../types';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  BrainCircuit, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Zap, 
  Heart, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Activity,
  Flame,
  Moon
} from 'lucide-react';
import { analyzePlayerAI, askCoachAIChat } from '../services/api';

interface AICoachAdvisorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
}

export const AICoachAdvisor: React.FC<AICoachAdvisorProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer,
}) => {
  const activePlayer = selectedPlayer || players[0];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Hello Coach & Athletes. I am your Champions Hub Performance AI. I continuously correlate PlayStation DualSense telemetry, in-game APM, autonomic HRV, and sleep architecture. How can I assist your squad today?`,
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const res = await analyzePlayerAI(activePlayer);
    setAnalysisResult(res);
    setIsAnalyzing(false);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsChatSending(true);

    const reply = await askCoachAIChat(textToSend, {
      player: activePlayer,
      allPlayers: players.map(p => ({ tag: p.gamerTag, game: p.primaryGame, readiness: p.readinessScore })),
    });

    const botMsg = {
      role: 'assistant' as const,
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, botMsg]);
    setIsChatSending(false);
  };

  const QUICK_QUESTIONS = [
    `Analyze ${activePlayer.gamerTag}'s motor reaction vs sleep duration`,
    'Optimal pre-scrim warm-up routine for DualSense thumbsticks',
    'How does Zone-2 aerobic cardio improve in-game clutch composure?',
    'Recommended stick deadzone & trigger stop settings for competitive play',
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#00439c]">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight font-rajdhani">
                GEMINI AI ATHLETIC & PLAYSTATION COACH
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#00439c] border border-blue-200">
                PRO INSIGHTS ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deep neurological, physiological, and PlayStation in-game tactical synthesis.
            </p>
          </div>
        </div>

        {/* Selected Athlete Control */}
        <div className="flex items-center gap-3">
          <select
            value={activePlayer.id}
            onChange={(e) => {
              const found = players.find(p => p.id === e.target.value);
              if (found) {
                onSelectPlayer(found);
                setAnalysisResult(null);
              }
            }}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm font-medium"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.gamerTag} ({p.primaryGame})</option>
            ))}
          </select>

          <button
            id="run-ai-synthesis-btn"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white shadow-sm transition-all disabled:opacity-50 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Synthesizing...' : `Analyze ${activePlayer.gamerTag}`}</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Cards if synthesized */}
      {analysisResult && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-[#00439c] uppercase tracking-wider block">
                Biometric & Telemetry Diagnostic
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-rajdhani">
                Performance Profile &bull; {activePlayer.gamerTag} ({activePlayer.name})
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] font-medium">Readiness Score</span>
                <span className="text-2xl font-bold text-[#00439c] font-mono">{analysisResult.readinessScore}%</span>
              </div>

              <div className="text-right">
                <span className="text-slate-500 block text-[10px] font-medium">Fatigue Risk</span>
                <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                  analysisResult.fatigueRisk === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {analysisResult.fatigueRisk}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div className="flex items-center gap-1.5 text-[#00439c] font-bold">
                <Clock className="w-4 h-4 text-[#00439c]" />
                <span>Peak Motor & Reaction Window:</span>
              </div>
              <p className="text-sm font-bold text-slate-900 font-mono">{analysisResult.peakWindow}</p>
              <p className="text-[11px] text-slate-600">
                Timeframe where central nervous system recovery aligns with lowest latency DualSense execution.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Zap className="w-4 h-4 text-[#00439c]" />
                <span>Tactical DualSense Focus:</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{analysisResult.tacticalFocus}</p>
              <p className="text-[11px] text-slate-600">
                Recommended in-game posture and pacing for next tournament map series.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Key Insights */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Key Physiological & In-Game Insights</span>
              </h4>
              <ul className="space-y-2">
                {analysisResult.keyInsights.map((insight, i) => (
                  <li key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed flex items-start gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00439c]" />
                <span>Actionable Training Directives</span>
              </h4>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec, i) => (
                  <li key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed flex items-start gap-2 font-medium">
                    <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Coach Chat Interface */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#00439c]" />
            <h3 className="font-bold text-slate-900 text-base">Direct Dialogue with Performance Coach</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-medium">Model: Gemini 3.7 Flash</span>
        </div>

        {/* Quick prompt chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs whitespace-nowrap transition-colors font-medium shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Stream Box */}
        <div className="h-80 rounded-xl bg-slate-50 border border-slate-200 p-4 overflow-y-auto space-y-3.5">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-[#00439c] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-3.5 rounded-2xl leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#00439c] text-white rounded-br-none shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[9px] block mt-1.5 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isChatSending && (
            <div className="flex gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-[#00439c] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-500 flex items-center gap-2 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00439c] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00439c] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00439c] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] ml-1">Analyzing sports science telemetry...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about reaction drills, DualSense settings, fatigue management, or sleep..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00439c] shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isChatSending}
            className="px-4 py-2.5 rounded-xl bg-[#00439c] hover:bg-[#00367d] text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
