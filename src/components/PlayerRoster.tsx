import React, { useState } from 'react';
import { Player, GameTitle, ControllerModel } from '../types';
import { 
  PSControllerIcon, 
  PSPlusBadge,
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  Search, 
  Filter, 
  Plus, 
  Trophy, 
  Heart, 
  Zap, 
  Moon, 
  TrendingUp, 
  Activity, 
  Sliders, 
  Battery, 
  BrainCircuit, 
  UserPlus, 
  X, 
  Check, 
  Sparkles,
  ChevronRight,
  Shield,
  Gauge,
  BatteryCharging
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from 'recharts';

interface PlayerRosterProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onAddPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
  onComparePlayer: (player: Player) => void;
  onAnalyzeAI: (player: Player) => void;
}

export const PlayerRoster: React.FC<PlayerRosterProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer,
  onAddPlayer,
  onUpdatePlayer,
  onComparePlayer,
  onAnalyzeAI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGame, setFilterGame] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Player Form State
  const [newName, setNewName] = useState('');
  const [newGamerTag, setNewGamerTag] = useState('');
  const [newPsnId, setNewPsnId] = useState('');
  const [newPrimaryGame, setNewPrimaryGame] = useState<GameTitle>('EA SPORTS FC 25');
  const [newRole, setNewRole] = useState<Player['role']>('Playmaker / Midfielder');
  const [newCountry, setNewCountry] = useState('US');

  // Filter logic
  const filteredPlayers = players.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gamerTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.psnId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGame = filterGame === 'ALL' || p.primaryGame === filterGame;
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;

    return matchesSearch && matchesGame && matchesStatus;
  });

  const activePlayer = selectedPlayer || players[0];

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGamerTag || !newPsnId) return;

    const created: Player = {
      id: `p-${Date.now()}`,
      name: newName || newGamerTag,
      gamerTag: newGamerTag,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80`,
      countryCode: newCountry,
      role: newRole,
      primaryGame: newPrimaryGame,
      psnId: newPsnId,
      psPlusTier: 'PlayStation Plus Premium',
      status: 'ONLINE_PS5',
      readinessScore: 90,
      biometrics: {
        restingHeartRate: 58,
        hrvMs: 80,
        sleepScore: 88,
        sleepDurationHours: 8.0,
        cognitiveFatigueIndex: 20,
        hydrationPercent: 90,
        physicalStrainScore: 12.0,
        gripStrengthKg: 49.0,
        deepSleepPercent: 22,
      },
      psnTelemetry: {
        avgApm: 310,
        peakApm: 390,
        reactionTimeMs: 160,
        triggerLatencyMs: 4.5,
        aimPrecisionPercent: 92.5,
        clutchWinRatePercent: 80.0,
        tiltResistanceScore: 90,
        playTimeHoursThisWeek: 26.0,
        dualSenseBatteryPercent: 90,
        controllerType: 'DualSense Edge',
        stickDeadzonePercent: 2,
        hapticIntensitySetting: 'Competitive Low',
        triggerEffectSetting: 'Off (Fastest Response)',
      },
      trophies: {
        level: 350,
        platinum: 16,
        gold: 75,
        silver: 210,
        bronze: 700,
        total: 1001,
      },
      recentSessions: [
        {
          id: `s-${Date.now()}`,
          gameTitle: newPrimaryGame,
          durationMinutes: 90,
          date: '2026-08-30 15:00',
          result: 'VICTORY',
          scoreOrKD: '3 - 1 (Championship Scrim)',
          avgHeartRate: 108,
          maxHeartRate: 140,
          apmAverage: 315,
          clutchMomentsWon: 2,
          fatigueDelta: 4,
          platform: 'PlayStation 5 Pro',
          notes: 'Initial benchmark session logged on PS5 Pro.',
        },
      ],
      reactionDrills: [
        { id: `rd-${Date.now()}`, date: '2026-08-30', type: 'Visual Trigger', scoreMs: 158, accuracyPercent: 97 },
      ],
      radarAttributes: {
        mechanicalSpeed: 90,
        staminaEndurance: 88,
        tacticalIQ: 92,
        reactionReflex: 94,
        clutchComposure: 90,
        stressResilience: 89,
      },
    };

    onAddPlayer(created);
    setIsAddModalOpen(false);
    setNewName('');
    setNewGamerTag('');
    setNewPsnId('');
  };

  // Format radar data for Recharts
  const radarData = activePlayer ? [
    { subject: 'Speed (APM)', value: activePlayer.radarAttributes.mechanicalSpeed, fullMark: 100 },
    { subject: 'Stamina', value: activePlayer.radarAttributes.staminaEndurance, fullMark: 100 },
    { subject: 'Tactical IQ', value: activePlayer.radarAttributes.tacticalIQ, fullMark: 100 },
    { subject: 'Reaction', value: activePlayer.radarAttributes.reactionReflex, fullMark: 100 },
    { subject: 'Clutch', value: activePlayer.radarAttributes.clutchComposure, fullMark: 100 },
    { subject: 'Resilience', value: activePlayer.radarAttributes.stressResilience, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2 font-rajdhani">
            <span>TEAM ROSTER & ATHLETIC PROFILES</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-50 text-[#00439c] border border-blue-200">
              {players.length} Athletes
            </span>
          </h2>
          <p className="text-xs text-slate-500">Manage DualSense hardware calibrations, physical athletic metrics, and PSN IDs.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-athlete-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Athlete</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search athlete tag, name, or PSN ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00439c] shadow-sm"
          />
        </div>

        <div>
          <select
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
          >
            <option value="ALL">All Competitive Titles</option>
            <option value="EA SPORTS FC 25">EA SPORTS FC 25</option>
            <option value="Apex Legends">Apex Legends</option>
            <option value="Gran Turismo 7">Gran Turismo 7</option>
            <option value="NBA 2K25">NBA 2K25</option>
            <option value="Tekken 8">Tekken 8</option>
            <option value="Call of Duty: Warzone">Call of Duty: Warzone</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
          >
            <option value="ALL">All Network Statuses</option>
            <option value="ONLINE_PS5">Online (PS5)</option>
            <option value="IN_SCRIM">In Match Scrim</option>
            <option value="IN_GYM">In Athletic Gym</option>
            <option value="RECOVERY">Physio Recovery</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout: Left Roster List, Right Athlete Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Athlete Selection Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredPlayers.map((player) => {
            const isSelected = activePlayer?.id === player.id;
            return (
              <div
                key={player.id}
                id={`roster-item-${player.id}`}
                onClick={() => onSelectPlayer(player)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden shadow-sm ${
                  isSelected
                    ? 'bg-blue-50/70 border-[#00439c] ring-1 ring-[#00439c]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img 
                      src={player.avatarUrl} 
                      alt={player.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      player.status === 'ONLINE_PS5' ? 'bg-emerald-500' :
                      player.status === 'IN_SCRIM' ? 'bg-rose-500 animate-pulse' :
                      player.status === 'IN_GYM' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                        <span>{player.gamerTag}</span>
                        <span className="text-[10px] text-slate-400">[{player.countryCode}]</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#00439c]">
                        {player.readinessScore}% Ready
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-500 truncate">{player.role}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[11px] text-[#00439c] font-mono truncate">{player.psnId}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <PSControllerIcon className="w-3 h-3 text-[#00439c]" />
                        <span className="truncate">{player.primaryGame}</span>
                      </span>
                      <span className="font-mono font-semibold text-slate-700">{player.psnTelemetry.avgApm} APM</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-slate-400 text-sm">No athletes found matching your filters.</p>
            </div>
          )}
        </div>

        {/* Right Column (7 Cols): Active Athlete Deep-Dive Inspection Panel */}
        {activePlayer && (
          <div className="lg:col-span-7 space-y-6">
            {/* Athlete Profile Header */}
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={activePlayer.avatarUrl} 
                    alt={activePlayer.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900 font-rajdhani">{activePlayer.gamerTag}</h3>
                      <PSPlusBadge tier={activePlayer.psPlusTier.replace('PlayStation Plus ', '')} />
                    </div>
                    <p className="text-xs text-slate-500">{activePlayer.name} &bull; {activePlayer.role}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#00439c] font-mono">
                      <span>PSN: {activePlayer.psnId}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700 font-semibold">{activePlayer.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* AI & Compare Actions */}
                <div className="flex items-center gap-2">
                  <button
                    id={`ai-analyze-btn-${activePlayer.id}`}
                    onClick={() => onAnalyzeAI(activePlayer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all shadow-sm"
                    title="Generate AI Bio-Telemetry Analysis"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Analysis</span>
                  </button>

                  <button
                    id={`compare-btn-${activePlayer.id}`}
                    onClick={() => onComparePlayer(activePlayer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-sm"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#00439c]" />
                    <span>Compare</span>
                  </button>
                </div>
              </div>

              {/* Trophies Bar */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">PSN Level</span>
                  <span className="font-bold text-amber-700 font-mono">{activePlayer.trophies.level}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Platinum</span>
                  <span className="font-bold text-[#00439c] font-mono">{activePlayer.trophies.platinum}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Gold</span>
                  <span className="font-bold text-yellow-700 font-mono">{activePlayer.trophies.gold}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Silver</span>
                  <span className="font-bold text-slate-600 font-mono">{activePlayer.trophies.silver}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Bronze</span>
                  <span className="font-bold text-amber-800 font-mono">{activePlayer.trophies.bronze}</span>
                </div>
              </div>
            </div>

            {/* Middle Grid: Radar Attributes + DualSense Telemetry Calibration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Radar Chart Panel */}
              <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center justify-between">
                  <span>Performance Radar Attributes</span>
                  <span className="text-[11px] font-mono text-[#00439c] font-bold">Score: {activePlayer.readinessScore}/100</span>
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                      <Radar name={activePlayer.gamerTag} dataKey="value" stroke="#00439c" fill="#00439c" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PlayStation DualSense Hardware Calibration */}
              <div className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-between space-y-3 shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PSControllerIcon className="w-4 h-4 text-[#00439c]" />
                      <span>{activePlayer.psnTelemetry.controllerType}</span>
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                      {activePlayer.psnTelemetry.triggerLatencyMs}ms Polling
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">Real-time controller profile & haptic tension load</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-500">Stick Deadzone:</span>
                    <span className="text-slate-800 font-mono font-bold">{activePlayer.psnTelemetry.stickDeadzonePercent}%</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-500">Adaptive Triggers:</span>
                    <span className="text-slate-800 font-medium">{activePlayer.psnTelemetry.triggerEffectSetting}</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-500">Aim Precision:</span>
                    <span className="text-emerald-700 font-mono font-bold">{activePlayer.psnTelemetry.aimPrecisionPercent}%</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-500">Clutch Win Rate:</span>
                    <span className="text-[#00439c] font-mono font-bold">{activePlayer.psnTelemetry.clutchWinRatePercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Physiological Athletic Gauges */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Athletic Physiological Biometrics</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">Last 24h Sleep: {activePlayer.biometrics.sleepDurationHours}h</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Resting HR</span>
                  <span className="text-lg font-bold text-rose-600 font-mono">{activePlayer.biometrics.restingHeartRate} <span className="text-xs font-normal">BPM</span></span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">HRV Recovery</span>
                  <span className="text-lg font-bold text-emerald-700 font-mono">{activePlayer.biometrics.hrvMs} <span className="text-xs font-normal">ms</span></span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sleep Quality</span>
                  <span className="text-lg font-bold text-indigo-700 font-mono">{activePlayer.biometrics.sleepScore} <span className="text-xs font-normal">/100</span></span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Grip Strain</span>
                  <span className="text-lg font-bold text-[#00439c] font-mono">{activePlayer.biometrics.gripStrengthKg} <span className="text-xs font-normal">kg</span></span>
                </div>
              </div>
            </div>

            {/* Recent Match Sessions Log */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
              <h4 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>Recent PlayStation Match Telemetry Logs</span>
                <span className="text-xs text-slate-500 font-medium">{activePlayer.recentSessions.length} recorded</span>
              </h4>

              <div className="space-y-2">
                {activePlayer.recentSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <PSControllerIcon className="w-3.5 h-3.5 text-[#00439c]" />
                        <span>{session.gameTitle}</span>
                        <span className="text-slate-400 font-normal">({session.platform})</span>
                      </span>
                      <span className="font-mono text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                        {session.result}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>{session.scoreOrKD}</span>
                      <span>Avg HR: {session.avgHeartRate} BPM &bull; Peak APM: {session.apmAverage}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 italic pt-1 border-t border-slate-200">
                      "{session.notes}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Athlete Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#00439c] flex items-center justify-center text-white">
                  <PSControllerIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Register Esports Athlete</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gamer Tag / Handle *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CYBER_STRIKE"
                  value={newGamerTag}
                  onChange={(e) => setNewGamerTag(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Liam Vance"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">PlayStation Network ID (PSN) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam_Apex_PSN"
                    value={newPsnId}
                    onChange={(e) => setNewPsnId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Primary Game Title</label>
                  <select
                    value={newPrimaryGame}
                    onChange={(e) => setNewPrimaryGame(e.target.value as GameTitle)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  >
                    <option value="EA SPORTS FC 25">EA SPORTS FC 25</option>
                    <option value="Apex Legends">Apex Legends</option>
                    <option value="Gran Turismo 7">Gran Turismo 7</option>
                    <option value="NBA 2K25">NBA 2K25</option>
                    <option value="Tekken 8">Tekken 8</option>
                    <option value="Call of Duty: Warzone">Call of Duty: Warzone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Roster Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  >
                    <option value="Captain / Main Fragger">Captain / Main Fragger</option>
                    <option value="Playmaker / Midfielder">Playmaker / Midfielder</option>
                    <option value="Tactical Anchor">Tactical Anchor</option>
                    <option value="Flex Competitor">Flex Competitor</option>
                    <option value="Sim Racer / Specialist">Sim Racer / Specialist</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00439c] hover:bg-[#00367d] text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Register Athlete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
