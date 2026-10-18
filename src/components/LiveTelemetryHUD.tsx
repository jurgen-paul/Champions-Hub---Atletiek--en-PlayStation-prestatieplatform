import React, { useState, useEffect } from 'react';
import { Player, LiveTelemetryPoint } from '../types';
import { PSControllerIcon } from './PlayStationIcons';
import { 
  Heart, 
  Zap, 
  Clock, 
  Activity, 
  Flame, 
  Play, 
  Square, 
  Sparkles, 
  ShieldAlert, 
  Crosshair, 
  Sliders, 
  Volume2, 
  Radio,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import confetti from 'canvas-confetti';

interface LiveTelemetryHUDProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
}

export const LiveTelemetryHUD: React.FC<LiveTelemetryHUDProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer,
}) => {
  const activePlayer = selectedPlayer || players[0];
  const [isPlaying, setIsPlaying] = useState(true);
  const [matchTime, setMatchTime] = useState(142); // in seconds
  const [currentHR, setCurrentHR] = useState(118);
  const [currentAPM, setCurrentAPM] = useState(325);
  const [currentStress, setCurrentStress] = useState(28);
  const [triggerPressure, setTriggerPressure] = useState(65);
  const [latencyMs, setLatencyMs] = useState(3.8);

  // Live alerts log
  const [liveAlerts, setLiveAlerts] = useState<Array<{ id: string; time: string; text: string; type: 'info' | 'critical' }>>([
    { id: '1', time: '02:18', text: 'DualSense 1000Hz polling locked. Zero trigger deadzone drift detected.', type: 'info' },
    { id: '2', time: '02:05', text: 'Autonomic HRV steady at 78ms during round 4 tactical rotation.', type: 'info' },
    { id: '3', time: '01:45', text: 'Spike in sympathetic arousal detected (+24 BPM) during 2v2 retake.', type: 'critical' },
  ]);

  // Telemetry real-time buffer
  const [telemetryStream, setTelemetryStream] = useState<LiveTelemetryPoint[]>([]);

  // Initialize stream
  useEffect(() => {
    const initial: LiveTelemetryPoint[] = [];
    const baseHR = activePlayer.biometrics.restingHeartRate + 55;
    const baseAPM = activePlayer.psnTelemetry.avgApm;

    for (let i = 20; i >= 0; i--) {
      const timeSec = matchTime - i * 2;
      const mins = Math.floor(timeSec / 60);
      const secs = (timeSec % 60).toString().padStart(2, '0');

      initial.push({
        timestamp: `${mins}:${secs}`,
        timeSeconds: timeSec,
        heartRate: Math.round(baseHR + Math.sin(i) * 12 + (Math.random() * 4 - 2)),
        apm: Math.round(baseAPM + Math.cos(i) * 25 + (Math.random() * 10 - 5)),
        stressIndex: Math.round(20 + Math.random() * 15),
        reactionMs: Math.round(155 + Math.random() * 8),
        triggerPressionPct: Math.round(60 + Math.random() * 25),
      });
    }
    setTelemetryStream(initial);
  }, [activePlayer]);

  // Live simulation tick
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setMatchTime((prev) => prev + 1);

      setCurrentHR((prev) => {
        const drift = Math.random() * 4 - 2;
        const newHR = Math.min(170, Math.max(85, Math.round(prev + drift)));
        return newHR;
      });

      setCurrentAPM((prev) => {
        const drift = Math.random() * 16 - 8;
        const newAPM = Math.min(480, Math.max(220, Math.round(prev + drift)));
        return newAPM;
      });

      setTriggerPressure(Math.round(50 + Math.random() * 45));
      setLatencyMs(Number((3.6 + Math.random() * 0.5).toFixed(1)));

      // Add point to chart
      const mins = Math.floor((matchTime + 1) / 60);
      const secs = ((matchTime + 1) % 60).toString().padStart(2, '0');
      const newPoint: LiveTelemetryPoint = {
        timestamp: `${mins}:${secs}`,
        timeSeconds: matchTime + 1,
        heartRate: currentHR,
        apm: currentAPM,
        stressIndex: currentStress,
        reactionMs: Math.round(152 + (currentHR > 140 ? 12 : 0) + (Math.random() * 6 - 3)),
        triggerPressionPct: triggerPressure,
      };

      setTelemetryStream((prev) => {
        const next = [...prev.slice(-25), newPoint];
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, matchTime, currentHR, currentAPM, currentStress, triggerPressure]);

  // Trigger High-Intensity Clutch Moment
  const handleTriggerClutch = () => {
    setCurrentHR(158);
    setCurrentAPM(435);
    setCurrentStress(68);
    setTriggerPressure(95);

    const mins = Math.floor(matchTime / 60);
    const secs = (matchTime % 60).toString().padStart(2, '0');
    setLiveAlerts((prev) => [
      {
        id: Date.now().toString(),
        time: `${mins}:${secs}`,
        text: `CRITICAL 1v2 CLUTCH: Heart rate spike to 158 BPM & APM surge to 435. DualSense trigger pressure peak!`,
        type: 'critical',
      },
      ...prev,
    ]);
  };

  // Trigger Victory / Round Win
  const handleTriggerWin = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const mins = Math.floor(matchTime / 60);
    const secs = (matchTime % 60).toString().padStart(2, '0');
    setLiveAlerts((prev) => [
      {
        id: Date.now().toString(),
        time: `${mins}:${secs}`,
        text: `ROUND WON: ${activePlayer.gamerTag} secured final objective! Parasympathetic cool-down recommended.`,
        type: 'info',
      },
      ...prev,
    ]);
  };

  const formatMatchTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Live HUD Header Control Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight font-rajdhani">
                LIVE PLAYSTATION MATCH TELEMETRY HUD
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                <span>LIVE FEED</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Synchronizing DualSense Edge 1000Hz polling rate with athlete real-time cardiovascular telemetry.
            </p>
          </div>
        </div>

        {/* Player Selector & Simulation Toggle */}
        <div className="flex items-center gap-3">
          <select
            value={activePlayer.id}
            onChange={(e) => {
              const found = players.find(p => p.id === e.target.value);
              if (found) onSelectPlayer(found);
            }}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm font-medium"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>
                {p.gamerTag} ({p.primaryGame})
              </option>
            ))}
          </select>

          <button
            id="toggle-sim-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isPlaying 
                ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause Feed' : 'Resume Feed'}</span>
          </button>
        </div>
      </div>

      {/* Main HUD Gauge Cluster */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Heart Rate */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Heart Rate</span>
            <Heart className="w-4 h-4 text-rose-500 animate-bounce" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-rose-600 font-mono">{currentHR}</span>
            <span className="text-xs text-slate-400">BPM</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-600 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${currentHR > 145 ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
            <span>{currentHR > 145 ? 'High CNS Arousal' : 'Steady Aerobic Zone'}</span>
          </div>
        </div>

        {/* Real-Time APM */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>DualSense APM</span>
            <Zap className="w-4 h-4 text-[#00439c]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#00439c] font-mono">{currentAPM}</span>
            <span className="text-xs text-slate-400">Act/m</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-medium">
            Peak: {activePlayer.psnTelemetry.peakApm} APM
          </div>
        </div>

        {/* Reaction Latency */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Motor Latency</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800 font-mono">152</span>
            <span className="text-xs text-slate-400">ms</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-700 font-medium">
            Top 1.2% Global Tier
          </div>
        </div>

        {/* Trigger Pressure % */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Trigger Force (R2)</span>
            <PSControllerIcon className="w-4 h-4 text-[#00439c]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#00439c] font-mono">{triggerPressure}%</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-medium">
            Adaptive Stop: 0.8mm
          </div>
        </div>

        {/* Hardware Polling Latency */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>PS5 Pro Link</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-emerald-700 font-mono">{latencyMs}</span>
            <span className="text-xs text-slate-400">ms</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-700 font-medium">
            1000Hz USB High-Speed
          </div>
        </div>

        {/* Match Timer */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Live Match Clock</span>
            <Crosshair className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800 font-mono">{formatMatchTime(matchTime)}</span>
          </div>
          <div className="mt-2 text-[10px] text-purple-700 font-bold">
            Game 3 &bull; Set Point
          </div>
        </div>
      </div>

      {/* Interactive Simulation Action Bar */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-bold text-slate-800">Live Game Scenario Injector:</span>
          <span className="text-slate-500 hidden sm:inline">Test how athlete physiology reacts under pressure</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="clutch-scenario-btn"
            onClick={handleTriggerClutch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Simulate 1v2 Clutch Stress (+45 APM, +40 BPM)</span>
          </button>

          <button
            id="win-scenario-btn"
            onClick={handleTriggerWin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulate Map Victory</span>
          </button>
        </div>
      </div>

      {/* Live Stream Telemetry Chart + Live Event Alerts Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): Dual Telemetry Stream Chart */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Real-Time Biometric & APM Stream</h3>
              <p className="text-xs text-slate-500">Blue = DualSense APM &bull; Rose = Heart Rate BPM</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#00439c]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00439c]"></span>
                <span>APM ({currentAPM})</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Heart Rate ({currentHR} BPM)</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryStream}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="apm" domain={[150, 500]} stroke="#00439c" fontSize={11} tickLine={false} />
                <YAxis yAxisId="hr" orientation="right" domain={[60, 180]} stroke="#e11d48" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line yAxisId="apm" type="monotone" dataKey="apm" stroke="#00439c" strokeWidth={2.5} dot={false} isAnimationActive={false} name="Actions/Min" />
                <Line yAxisId="hr" type="monotone" dataKey="heartRate" stroke="#e11d48" strokeWidth={2.5} dot={false} isAnimationActive={false} name="Heart Rate (BPM)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (4 Cols): Live Coach & Tactician Alert Stream */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Coach Telemetry Feed</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Auto-Updating</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {liveAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    alert.type === 'critical' 
                      ? 'bg-rose-50 border-rose-200 text-rose-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={alert.type === 'critical' ? 'text-rose-600 font-bold' : 'text-[#00439c] font-bold'}>
                      [{alert.time}]
                    </span>
                    <span className="text-slate-400">Live AI Monitor</span>
                  </div>
                  <p className="leading-snug">{alert.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Coach Box Breathing Advice */}
          <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-[#00439c] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00439c]" />
              <span>Biofeedback Tactical Cue</span>
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              When HR exceeds 145 BPM during round transitions, instruct {activePlayer.gamerTag} to perform a 4s inhale / 6s prolonged exhale to stabilize DualSense micro-aim.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
