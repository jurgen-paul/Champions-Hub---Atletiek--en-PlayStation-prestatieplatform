import React, { useState } from 'react';
import { Player } from '../types';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  Heart, 
  Moon, 
  Dumbbell, 
  Activity, 
  Zap, 
  TrendingUp, 
  Plus, 
  Check, 
  Sparkles, 
  Flame, 
  Award,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';

interface AthleticBiometricsViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
}

export const AthleticBiometricsView: React.FC<AthleticBiometricsViewProps> = ({
  players,
  onSelectPlayer,
  onUpdatePlayer,
}) => {
  const [selectedAthleteId, setSelectedAthleteId] = useState(players[0]?.id || 'p1');
  const [isLogWorkoutOpen, setIsLogWorkoutOpen] = useState(false);

  // Workout form state
  const [workoutType, setWorkoutType] = useState('Zone 2 Aerobic Conditioning');
  const [durationMins, setDurationMins] = useState('45');
  const [avgHeartRate, setAvgHeartRate] = useState('130');
  const [strainScore, setStrainScore] = useState('12.5');

  const activeAthlete = players.find(p => p.id === selectedAthleteId) || players[0];

  // Correlation Dataset: Sleep vs APM across players
  const sleepVsAPMData = players.map(p => ({
    name: p.gamerTag,
    sleepHours: p.biometrics.sleepDurationHours,
    sleepScore: p.biometrics.sleepScore,
    avgApm: p.psnTelemetry.avgApm,
    reactionMs: p.psnTelemetry.reactionTimeMs,
    hrvMs: p.biometrics.hrvMs,
  }));

  // Historical 7-day athletic load for active athlete
  const historicalLoadData = [
    { day: 'Mon', hrv: activeAthlete.biometrics.hrvMs - 6, restingHR: activeAthlete.biometrics.restingHeartRate + 3, sleep: 7.6 },
    { day: 'Tue', hrv: activeAthlete.biometrics.hrvMs - 2, restingHR: activeAthlete.biometrics.restingHeartRate + 2, sleep: 8.0 },
    { day: 'Wed', hrv: activeAthlete.biometrics.hrvMs - 8, restingHR: activeAthlete.biometrics.restingHeartRate + 4, sleep: 7.2 },
    { day: 'Thu', hrv: activeAthlete.biometrics.hrvMs + 2, restingHR: activeAthlete.biometrics.restingHeartRate - 1, sleep: 8.5 },
    { day: 'Fri', hrv: activeAthlete.biometrics.hrvMs, restingHR: activeAthlete.biometrics.restingHeartRate, sleep: 8.2 },
    { day: 'Sat', hrv: activeAthlete.biometrics.hrvMs + 4, restingHR: activeAthlete.biometrics.restingHeartRate - 2, sleep: 8.8 },
    { day: 'Today', hrv: activeAthlete.biometrics.hrvMs, restingHR: activeAthlete.biometrics.restingHeartRate, sleep: activeAthlete.biometrics.sleepDurationHours },
  ];

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAthlete) return;

    const updated = {
      ...activeAthlete,
      biometrics: {
        ...activeAthlete.biometrics,
        physicalStrainScore: Number(strainScore),
      },
    };

    onUpdatePlayer(updated);
    setIsLogWorkoutOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2 font-rajdhani">
            <span>ATHLETIC PHYSIOLOGY & BIOMETRIC SYNERGY</span>
          </h2>
          <p className="text-xs text-slate-500">
            Correlating sleep architecture, nocturnal HRV, and physical strain directly with PlayStation competitive performance.
          </p>
        </div>

        <button
          id="log-workout-btn"
          onClick={() => setIsLogWorkoutOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white shadow-sm transition-all self-start sm:self-auto"
        >
          <Dumbbell className="w-4 h-4" />
          <span>Log Athletic Workout</span>
        </button>
      </div>

      {/* Roster Biometric Readiness Leaderboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {players.map((p) => {
          const isSelected = p.id === activeAthlete.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedAthleteId(p.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${
                isSelected 
                  ? 'bg-blue-50/80 border-[#00439c] ring-1 ring-[#00439c]/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={p.avatarUrl} 
                  alt={p.name} 
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200" 
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">{p.gamerTag}</h4>
                  <span className="text-[11px] text-slate-500 block truncate">{p.primaryGame}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Readiness:</span>
                <span className="font-bold text-[#00439c]">{p.readinessScore}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Athletic Panel for Selected Athlete */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): 7-Day Physiological Trend & Sleep Architecture */}
        <div className="lg:col-span-8 space-y-6">
          {/* 7-Day HRV & Heart Rate Chart */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  {activeAthlete.gamerTag} &bull; 7-Day Autonomic Recovery (HRV & Resting HR)
                </h3>
                <p className="text-xs text-slate-500">Green = HRV (ms, higher is better) &bull; Rose = Resting HR (BPM, lower is better)</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-emerald-700 font-mono">HRV: {activeAthlete.biometrics.hrvMs}ms</span>
                <span className="text-slate-300">|</span>
                <span className="text-rose-600 font-mono">RHR: {activeAthlete.biometrics.restingHeartRate} BPM</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalLoadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="hrv" domain={[50, 110]} stroke="#059669" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="hr" orientation="right" domain={[45, 80]} stroke="#e11d48" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line yAxisId="hrv" type="monotone" dataKey="hrv" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} name="HRV (ms)" />
                  <Line yAxisId="hr" type="monotone" dataKey="restingHR" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 4 }} name="Resting HR (BPM)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cross-Team Sleep vs PlayStation APM Correlation */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Sleep Duration vs DualSense In-Game APM</h3>
                <p className="text-xs text-slate-500">Comparing athlete rest hours with mechanical actions-per-minute</p>
              </div>
              <div className="text-xs px-2.5 py-1 rounded bg-blue-50 text-[#00439c] font-mono font-bold border border-blue-200">
                Correlation: R = +0.89
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepVsAPMData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="apm" domain={[200, 450]} stroke="#00439c" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="sleep" orientation="right" domain={[5, 10]} stroke="#6366f1" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar yAxisId="apm" dataKey="avgApm" fill="#00439c" radius={[4, 4, 0, 0]} name="Avg In-Game APM" />
                  <Bar yAxisId="sleep" dataKey="sleepHours" fill="#818cf8" radius={[4, 4, 0, 0]} name="Sleep Duration (hrs)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Active Athlete Detailed Metrics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={activeAthlete.avatarUrl} 
                alt={activeAthlete.name} 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-base">{activeAthlete.gamerTag}</h3>
                <p className="text-xs text-slate-500">{activeAthlete.name} &bull; {activeAthlete.role}</p>
                <span className="text-[11px] text-[#00439c] font-mono">PSN: {activeAthlete.psnId}</span>
              </div>
            </div>

            {/* Metric Rows */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sleep Quality Score:</span>
                </span>
                <span className="font-mono font-bold text-indigo-700">{activeAthlete.biometrics.sleepScore}/100 ({activeAthlete.biometrics.sleepDurationHours}h)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Deep Sleep Proportion:</span>
                </span>
                <span className="font-mono font-bold text-emerald-700">{activeAthlete.biometrics.deepSleepPercent}% of cycle</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cognitive Fatigue Load:</span>
                </span>
                <span className={`font-mono font-bold ${
                  activeAthlete.biometrics.cognitiveFatigueIndex > 30 ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {activeAthlete.biometrics.cognitiveFatigueIndex}% (Low Strain)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Dumbbell className="w-3.5 h-3.5 text-[#00439c]" />
                  <span>Grip Strength (DualSense):</span>
                </span>
                <span className="font-mono font-bold text-slate-800">{activeAthlete.biometrics.gripStrengthKg} kg</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                  <span>Hydration Level:</span>
                </span>
                <span className="font-mono font-bold text-purple-700">{activeAthlete.biometrics.hydrationPercent}%</span>
              </div>
            </div>

            {/* Prescribed Training Plan */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1.5">
              <span className="font-bold text-[#00439c] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00439c]" />
                <span>Athletic Director Prescription</span>
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {activeAthlete.biometrics.sleepDurationHours >= 8.0
                  ? 'Parasympathetic recovery is peaked. Cleared for maximum scrimmage intensity & 5-set tournament finals.'
                  : 'Slight REM deficit noted. Recommend a 20-minute power rest at 13:00 prior to competitive PlayStation scrims.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Log Workout Modal */}
      {isLogWorkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Log Athletic Workout & Drills</h3>
              </div>
              <button onClick={() => setIsLogWorkoutOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogWorkout} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Athlete</label>
                <select
                  value={selectedAthleteId}
                  onChange={(e) => setSelectedAthleteId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                >
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.gamerTag} ({p.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Workout / Conditioning Type</label>
                <select
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                >
                  <option value="Zone 2 Aerobic Conditioning">Zone 2 Aerobic Conditioning (Cycling / Jogging)</option>
                  <option value="Forearm & Grip Strength">Forearm, Wrist & DualSense Grip Mobility</option>
                  <option value="DualSense Visual Reflex Drills">DualSense Spatial & Reflex Drills</option>
                  <option value="Contrast Hydrotherapy / Cryo">Contrast Hydrotherapy / Cryotherapy Recovery</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Average Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={avgHeartRate}
                    onChange={(e) => setAvgHeartRate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogWorkoutOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00439c] hover:bg-[#00367d] text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Workout Session</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
