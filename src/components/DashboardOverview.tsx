import React from 'react';
import { Player, ScheduleEvent, CrossPlatformSyncItem, NavigationTab } from '../types';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  Activity, 
  Flame, 
  Heart, 
  Moon, 
  Zap, 
  Clock, 
  Trophy, 
  AlertTriangle, 
  ArrowUpRight, 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  Play, 
  BatteryCharging, 
  ChevronRight,
  ShieldCheck,
  Radio,
  Sliders,
  Calendar as CalendarIcon,
  Tv,
  Lock
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardOverviewProps {
  players: Player[];
  events: ScheduleEvent[];
  syncItems?: CrossPlatformSyncItem[];
  onSelectPlayer: (player: Player) => void;
  onNavigateToTab: (tab: NavigationTab) => void;
  onOpenSyncModal: () => void;
  onOpenCompareModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  players,
  events,
  syncItems = [],
  onSelectPlayer,
  onNavigateToTab,
  onOpenSyncModal,
  onOpenCompareModal,
}) => {
  // Calculate aggregate stats
  const avgReadiness = Math.round(
    players.reduce((acc, p) => acc + p.readinessScore, 0) / (players.length || 1)
  );

  const avgAPM = Math.round(
    players.reduce((acc, p) => acc + p.psnTelemetry.avgApm, 0) / (players.length || 1)
  );

  const avgReactionTime = Math.round(
    players.reduce((acc, p) => acc + p.psnTelemetry.reactionTimeMs, 0) / (players.length || 1)
  );

  const avgHRV = Math.round(
    players.reduce((acc, p) => acc + p.biometrics.hrvMs, 0) / (players.length || 1)
  );

  const avgHeartRate = Math.round(
    players.reduce((acc, p) => acc + (p.biometrics.restingHeartRate + 84), 0) / (players.length || 1)
  );

  const activePlayersCount = players.filter(p => p.status === 'ONLINE_PS5' || p.status === 'IN_SCRIM').length;

  // Real-time Analytics data matching the Professional Polish curve
  const analyticsData = [
    { time: '10:00 AM', performance: 80, baseline: 70 },
    { time: '10:15 AM', performance: 75, baseline: 70 },
    { time: '10:30 AM', performance: 85, baseline: 70 },
    { time: '10:45 AM', performance: 60, baseline: 70 },
    { time: '11:00 AM', performance: 70, baseline: 70 },
    { time: '11:15 AM', performance: 90, baseline: 70 },
    { time: '11:30 AM', performance: 94, baseline: 70 },
  ];

  const upcomingEvents = events.slice(0, 3);

  // Month & Day extractor helper
  const getEventDateParts = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const day = d.getDate();
        return { month, day };
      }
    } catch {
      // fallback
    }
    return { month: 'OCT', day: '14' };
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar from Professional Polish theme */}
      <header className="h-16 bg-white border border-slate-200 flex items-center justify-between px-6 sm:px-8 shadow-sm rounded-xl">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight font-rajdhani">
            TEAM PERFORMANCE OVERVIEW
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Live Session</span>
          </span>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="hidden sm:flex items-center space-x-2 text-slate-500">
            <span className="text-xs">Status:</span>
            <span className="text-xs font-semibold text-slate-800">Synchronized</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="dash-compare-btn"
              onClick={onOpenCompareModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#00439c]" />
              <span>Compare</span>
            </button>

            <button
              id="dash-livestream-dataset-btn"
              onClick={() => onNavigateToTab('livestream-dataset')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all"
            >
              <Tv className="w-3.5 h-3.5 text-purple-600" />
              <span>Live Dataset</span>
            </button>

            <button
              id="dash-launch-hud-btn"
              onClick={() => onNavigateToTab('live-telemetry')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Live HUD</span>
            </button>

            <button
              id="dash-ssf-btn"
              onClick={() => onNavigateToTab('security-ssf')}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SSF L4</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-[#00439c] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* 4 KPI Metric Cards from Professional Polish design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Avg Team HR */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Avg Team HR</div>
          <div className="text-2xl font-bold text-slate-800">
            {avgHeartRate} <span className="text-sm font-normal text-slate-400">BPM</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <span>Resting baseline: 58 BPM</span>
          </div>
        </div>

        {/* Card 2: Intensity Level */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Intensity Level</div>
          <div className="text-2xl font-bold text-[#00439c]">
            {avgReadiness >= 90 ? 'Championship' : avgReadiness >= 80 ? 'High' : 'Moderate'}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>Team Readiness: {avgReadiness}%</span>
          </div>
        </div>

        {/* Card 3: PS Latency / Reaction */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">PS Latency</div>
          <div className="text-2xl font-bold text-slate-800">
            12 <span className="text-sm font-normal text-slate-400">MS</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>DualSense 1000Hz Polling</span>
          </div>
        </div>

        {/* Card 4: Active Players */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Players</div>
          <div className="text-2xl font-bold text-slate-800">
            {activePlayersCount} / {players.length}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>{players.filter(p => p.status === 'IN_SCRIM').length} In Live Scrim</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Real-time Analytics Chart + Upcoming Events Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Analytics Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Real-time Analytics</h3>
              <p className="text-xs text-slate-500">DualSense APM & Cardiovascular response correlation</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#00439c] rounded-full mr-2"></div>
                <span className="text-slate-700">Performance</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-slate-300 rounded-full mr-2"></div>
                <span className="text-slate-500">Baseline</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="psBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00439c" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00439c" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} width={28} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="performance" stroke="#00439c" strokeWidth={2.5} fillOpacity={1} fill="url(#psBlueGrad)" name="Performance" />
                <Area type="monotone" dataKey="baseline" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth={1.5} fillOpacity={0} name="Baseline" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average In-Game APM: <strong className="text-slate-800">{avgAPM}</strong></span>
            <span>Avg Reaction Latency: <strong className="text-[#00439c]">{avgReactionTime}ms</strong></span>
            <span>Nocturnal HRV: <strong className="text-emerald-600">{avgHRV}ms</strong></span>
          </div>
        </div>

        {/* Upcoming Events Card matching Professional Polish HTML pattern (1 col) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Upcoming Events</h3>
              <span className="text-xs text-slate-500 font-medium">{events.length} Scheduled</span>
            </div>

            <div className="p-4 space-y-4">
              {upcomingEvents.map((ev, index) => {
                const dateParts = getEventDateParts(ev.date);
                return (
                  <div key={ev.id || index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex flex-col items-center justify-center border border-slate-200 shrink-0 group-hover:border-blue-400 transition-colors">
                      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">{dateParts.month}</span>
                      <span className="text-lg font-bold text-slate-800 leading-none mt-1">{dateParts.day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-[#00439c] transition-colors">{ev.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{ev.locationOrPlatform} &bull; {ev.startTime}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 mt-auto">
            <button 
              id="dash-full-calendar-btn"
              onClick={() => onNavigateToTab('schedule')}
              className="w-full py-2.5 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
            >
              View Full Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Roster & Tactical AI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Roster List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">Active Roster & PlayStation Telemetry</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                {players.length} Athletes
              </span>
            </div>
            <button 
              id="view-all-roster-btn"
              onClick={() => onNavigateToTab('roster')}
              className="text-xs font-bold text-[#00439c] hover:underline flex items-center gap-1"
            >
              <span>Manage Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player) => {
              return (
                <div
                  key={player.id}
                  id={`player-card-${player.id}`}
                  onClick={() => onSelectPlayer(player)}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-[#00439c] p-4 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="relative">
                      <img 
                        src={player.avatarUrl} 
                        alt={player.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 group-hover:border-[#00439c] transition-colors"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        player.status === 'ONLINE_PS5' ? 'bg-emerald-500' :
                        player.status === 'IN_SCRIM' ? 'bg-rose-500 animate-pulse' :
                        player.status === 'IN_GYM' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-[#00439c] transition-colors">
                          {player.gamerTag}
                        </h3>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#00439c] border border-blue-200">
                          {player.readinessScore}% Ready
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{player.name} &bull; {player.role}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          <PSControllerIcon className="w-3 h-3 text-[#00439c]" />
                          <span className="truncate">{player.primaryGame}</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {player.psnTelemetry.avgApm} APM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Micro Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="bg-slate-50 rounded p-1 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Reflex</span>
                      <span className="text-slate-800 font-mono font-bold">{player.psnTelemetry.reactionTimeMs}ms</span>
                    </div>
                    <div className="bg-slate-50 rounded p-1 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">HRV</span>
                      <span className="text-emerald-700 font-mono font-bold">{player.biometrics.hrvMs}ms</span>
                    </div>
                    <div className="bg-slate-50 rounded p-1 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">DualSense</span>
                      <span className="text-amber-700 font-mono font-bold flex items-center justify-center gap-1">
                        <BatteryCharging className="w-3 h-3 text-amber-600" />
                        {player.psnTelemetry.dualSenseBatteryPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gemini AI Performance Advisor Snapshot (1 col) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00439c] flex items-center justify-center border border-blue-200">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-none">Gemini AI Coach</h3>
                  <span className="text-[10px] text-slate-400">Tactical & Physiological Insights</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">Ready</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Peak Cognitive Window
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                14:00 - 18:30 UTC represents the highest motor-reaction window today based on squad HRV and REM sleep cycles.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Performance Advisories:</span>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>DualSense Edge stick deadzone optimal at 2% for VORTEX.</li>
                <li>Schedule 15m grip decompression before Tier-1 scrims.</li>
                <li>Hydration index trending at 92% squad average.</li>
              </ul>
            </div>
          </div>

          <button
            id="dash-open-advisor-btn"
            onClick={() => onNavigateToTab('ai-coach')}
            className="mt-6 w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
            <span>Open AI Coach Suite</span>
          </button>
        </div>
      </div>
    </div>
  );
};
