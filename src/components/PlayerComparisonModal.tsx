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
  X, 
  TrendingUp, 
  Heart, 
  Zap, 
  Clock, 
  Moon, 
  Sliders, 
  Award, 
  Shield 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend 
} from 'recharts';

interface PlayerComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  initialPlayer1: Player | null;
}

export const PlayerComparisonModal: React.FC<PlayerComparisonModalProps> = ({
  isOpen,
  onClose,
  players,
  initialPlayer1,
}) => {
  if (!isOpen) return null;

  const [p1Id, setP1Id] = useState(initialPlayer1?.id || players[0]?.id || 'p1');
  const [p2Id, setP2Id] = useState(
    players.find(p => p.id !== (initialPlayer1?.id || 'p1'))?.id || players[1]?.id || 'p2'
  );

  const player1 = players.find(p => p.id === p1Id) || players[0];
  const player2 = players.find(p => p.id === p2Id) || players[1];

  const radarData = [
    {
      subject: 'Speed (APM)',
      p1: player1.radarAttributes.mechanicalSpeed,
      p2: player2.radarAttributes.mechanicalSpeed,
      fullMark: 100,
    },
    {
      subject: 'Stamina',
      p1: player1.radarAttributes.staminaEndurance,
      p2: player2.radarAttributes.staminaEndurance,
      fullMark: 100,
    },
    {
      subject: 'Tactical IQ',
      p1: player1.radarAttributes.tacticalIQ,
      p2: player2.radarAttributes.tacticalIQ,
      fullMark: 100,
    },
    {
      subject: 'Reaction',
      p1: player1.radarAttributes.reactionReflex,
      p2: player2.radarAttributes.reactionReflex,
      fullMark: 100,
    },
    {
      subject: 'Clutch',
      p1: player1.radarAttributes.clutchComposure,
      p2: player2.radarAttributes.clutchComposure,
      fullMark: 100,
    },
    {
      subject: 'Resilience',
      p1: player1.radarAttributes.stressResilience,
      p2: player2.radarAttributes.stressResilience,
      fullMark: 100,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="w-full max-w-4xl rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#00439c]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight font-rajdhani">
                HEAD-TO-HEAD ATHLETE TELEMETRY MATRIX
              </h3>
              <p className="text-xs text-slate-500">
                Comparative analysis of DualSense controller mechanics and autonomic biometrics.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Player 1 Card */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src={player1.avatarUrl} alt={player1.name} className="w-12 h-12 rounded-xl object-cover border border-blue-300" />
              <div>
                <select
                  value={player1.id}
                  onChange={(e) => setP1Id(e.target.value)}
                  className="bg-white border border-blue-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00439c] mb-1 shadow-sm"
                >
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.gamerTag} ({p.name})</option>
                  ))}
                </select>
                <div className="text-[11px] text-[#00439c] font-mono font-medium">PSN: {player1.psnId}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-medium">Readiness</span>
              <span className="text-lg font-bold text-[#00439c] font-mono">{player1.readinessScore}%</span>
            </div>
          </div>

          {/* Player 2 Card */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src={player2.avatarUrl} alt={player2.name} className="w-12 h-12 rounded-xl object-cover border border-purple-300" />
              <div>
                <select
                  value={player2.id}
                  onChange={(e) => setP2Id(e.target.value)}
                  className="bg-white border border-purple-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 mb-1 shadow-sm"
                >
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.gamerTag} ({p.name})</option>
                  ))}
                </select>
                <div className="text-[11px] text-purple-700 font-mono font-medium">PSN: {player2.psnId}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-medium">Readiness</span>
              <span className="text-lg font-bold text-purple-700 font-mono">{player2.readinessScore}%</span>
            </div>
          </div>
        </div>

        {/* Radar Comparison Chart */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <h4 className="text-center font-bold text-slate-800 text-xs mb-2">
            Skill & Attribute Envelope (<span className="text-[#00439c] font-bold">{player1.gamerTag}</span> vs <span className="text-purple-700 font-bold">{player2.gamerTag}</span>)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                <Radar name={player1.gamerTag} dataKey="p1" stroke="#00439c" fill="#00439c" fillOpacity={0.25} />
                <Radar name={player2.gamerTag} dataKey="p2" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side-by-Side Direct Comparison Table */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 text-sm">Direct Metric Comparative Matrix</h4>
          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
            {/* Row: In-Game APM */}
            <div className="grid grid-cols-3 p-3 text-center">
              <span className="font-mono font-bold text-[#00439c] text-sm">{player1.psnTelemetry.avgApm} APM</span>
              <span className="text-slate-600 font-medium">Average In-Game APM</span>
              <span className="font-mono font-bold text-purple-700 text-sm">{player2.psnTelemetry.avgApm} APM</span>
            </div>

            {/* Row: Reaction Time */}
            <div className="grid grid-cols-3 p-3 text-center">
              <span className="font-mono font-bold text-[#00439c] text-sm">{player1.psnTelemetry.reactionTimeMs} ms</span>
              <span className="text-slate-600 font-medium">Motor Reaction Latency</span>
              <span className="font-mono font-bold text-purple-700 text-sm">{player2.psnTelemetry.reactionTimeMs} ms</span>
            </div>

            {/* Row: Resting HR */}
            <div className="grid grid-cols-3 p-3 text-center">
              <span className="font-mono font-bold text-[#00439c] text-sm">{player1.biometrics.restingHeartRate} BPM</span>
              <span className="text-slate-600 font-medium">Resting Heart Rate</span>
              <span className="font-mono font-bold text-purple-700 text-sm">{player2.biometrics.restingHeartRate} BPM</span>
            </div>

            {/* Row: Nocturnal HRV */}
            <div className="grid grid-cols-3 p-3 text-center">
              <span className="font-mono font-bold text-[#00439c] text-sm">{player1.biometrics.hrvMs} ms</span>
              <span className="text-slate-600 font-medium">Nocturnal HRV Recovery</span>
              <span className="font-mono font-bold text-purple-700 text-sm">{player2.biometrics.hrvMs} ms</span>
            </div>

            {/* Row: Sleep Score */}
            <div className="grid grid-cols-3 p-3 text-center">
              <span className="font-mono font-bold text-[#00439c] text-sm">{player1.biometrics.sleepScore}/100 ({player1.biometrics.sleepDurationHours}h)</span>
              <span className="text-slate-600 font-medium">Sleep Architecture</span>
              <span className="font-mono font-bold text-purple-700 text-sm">{player2.biometrics.sleepScore}/100 ({player2.biometrics.sleepDurationHours}h)</span>
            </div>

            {/* Row: Controller Hardware */}
            <div className="grid grid-cols-3 p-3 text-center">
              <span className="text-slate-800 font-medium">{player1.psnTelemetry.controllerType} ({player1.psnTelemetry.triggerLatencyMs}ms)</span>
              <span className="text-slate-600 font-medium">DualSense Hardware</span>
              <span className="text-slate-800 font-medium">{player2.psnTelemetry.controllerType} ({player2.psnTelemetry.triggerLatencyMs}ms)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 flex justify-end border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#00439c] hover:bg-[#00367d] text-white font-bold text-xs shadow-sm"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
