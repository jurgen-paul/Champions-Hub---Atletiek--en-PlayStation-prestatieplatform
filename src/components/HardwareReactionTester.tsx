import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  Zap, 
  Clock, 
  RotateCcw, 
  Award, 
  Check, 
  Flame, 
  Activity, 
  Play, 
  Crosshair,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HardwareReactionTesterProps {
  players: Player[];
  onUpdatePlayer: (player: Player) => void;
}

export const HardwareReactionTester: React.FC<HardwareReactionTesterProps> = ({
  players,
  onUpdatePlayer,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.id || 'p1');
  const [mode, setMode] = useState<'REACTION' | 'APM'>('REACTION');

  // Reaction Test States
  const [reactionState, setReactionState] = useState<'IDLE' | 'WAITING' | 'READY' | 'FINISHED' | 'EARLY'>('IDLE');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestReaction, setBestReaction] = useState<number | null>(154);
  const startTimeRef = useRef<number>(0);
  const timerTimeoutRef = useRef<any>(null);

  // APM Test States
  const [apmState, setApmState] = useState<'IDLE' | 'ACTIVE' | 'FINISHED'>('IDLE');
  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [calculatedAPM, setCalculatedAPM] = useState<number | null>(null);
  const apmIntervalRef = useRef<any>(null);

  const activeAthlete = players.find(p => p.id === selectedPlayerId) || players[0];

  // Start Visual Reaction Test
  const startReactionTest = () => {
    setReactionState('WAITING');
    setReactionTime(null);

    const delay = 1500 + Math.random() * 3000;
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);

    timerTimeoutRef.current = setTimeout(() => {
      setReactionState('READY');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionState === 'WAITING') {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      setReactionState('EARLY');
    } else if (reactionState === 'READY') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setReactionState('FINISHED');

      if (!bestReaction || elapsed < bestReaction) {
        setBestReaction(elapsed);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  // Start APM Drill
  const startAPMDrill = () => {
    setApmState('ACTIVE');
    setClickCount(0);
    setTimeLeft(5);
    setCalculatedAPM(null);

    if (apmIntervalRef.current) clearInterval(apmIntervalRef.current);

    let remaining = 5;
    apmIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(apmIntervalRef.current);
        setApmState('FINISHED');
      }
    }, 1000);
  };

  const handleAPMClick = () => {
    if (apmState === 'ACTIVE') {
      setClickCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (apmState === 'FINISHED' && clickCount > 0) {
      const apm = Math.round((clickCount / 5) * 60);
      setCalculatedAPM(apm);
      if (apm > 350) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    }
  }, [apmState, clickCount]);

  // Cleanups
  useEffect(() => {
    return () => {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      if (apmIntervalRef.current) clearInterval(apmIntervalRef.current);
    };
  }, []);

  const handleSaveToProfile = () => {
    if (!activeAthlete) return;

    const updated: Player = {
      ...activeAthlete,
      psnTelemetry: {
        ...activeAthlete.psnTelemetry,
        reactionTimeMs: reactionTime || activeAthlete.psnTelemetry.reactionTimeMs,
        avgApm: calculatedAPM || activeAthlete.psnTelemetry.avgApm,
      },
    };

    onUpdatePlayer(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2 font-rajdhani">
            <span>DUALSENSE & MOTOR REFLEX TESTING DRILL</span>
          </h2>
          <p className="text-xs text-slate-500">
            Interactive visual stimulus latency & high-frequency trigger APM testing rig.
          </p>
        </div>

        {/* Athlete Selection */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 font-semibold">Athlete:</label>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm font-medium"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.gamerTag} ({p.name})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('REACTION')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm ${
            mode === 'REACTION'
              ? 'bg-[#00439c] text-white border-[#00439c]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Visual Trigger Latency (ms)</span>
        </button>

        <button
          onClick={() => setMode('APM')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm ${
            mode === 'APM'
              ? 'bg-purple-700 text-white border-purple-700'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Rapid Trigger Burst APM Drill</span>
        </button>
      </div>

      {/* Reaction Test Mode */}
      {mode === 'REACTION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Reaction Arena Box */}
          <div className="lg:col-span-8">
            <div
              id="reaction-arena-target"
              onClick={reactionState === 'WAITING' || reactionState === 'READY' ? handleReactionClick : undefined}
              className={`w-full h-80 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all select-none p-6 text-center shadow-sm ${
                reactionState === 'IDLE' ? 'bg-white border-slate-200 hover:border-slate-300' :
                reactionState === 'WAITING' ? 'bg-rose-50 border-rose-300 text-rose-900 animate-pulse' :
                reactionState === 'READY' ? 'bg-emerald-500 border-emerald-400 text-white shadow-2xl shadow-emerald-500/30' :
                reactionState === 'EARLY' ? 'bg-amber-50 border-amber-300 text-amber-900' :
                'bg-white border-[#00439c]'
              }`}
            >
              {reactionState === 'IDLE' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-[#00439c] flex items-center justify-center mx-auto shadow-sm">
                    <Crosshair className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-rajdhani">Visual Reflex Calibration</h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Click "Start Drill" below. When the screen turns <strong className="text-emerald-600 font-bold">EMERALD GREEN</strong>, click or tap as fast as humanly possible.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startReactionTest();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#00439c] hover:bg-[#00367d] text-white font-bold text-sm shadow-sm transition-all"
                  >
                    Start Drill
                  </button>
                </div>
              )}

              {reactionState === 'WAITING' && (
                <div className="space-y-2">
                  <div className="w-4 h-4 rounded-full bg-rose-600 animate-ping mx-auto"></div>
                  <h3 className="text-2xl font-bold text-rose-700 font-rajdhani uppercase tracking-widest">
                    HOLD... WAIT FOR GREEN...
                  </h3>
                  <p className="text-xs text-rose-600 font-medium">Do not click yet!</p>
                </div>
              )}

              {reactionState === 'READY' && (
                <div className="space-y-1">
                  <h3 className="text-4xl font-extrabold text-white font-rajdhani tracking-tighter animate-bounce">
                    CLICK NOW!
                  </h3>
                  <p className="text-sm font-bold text-emerald-100">TRIGGER PULL!</p>
                </div>
              )}

              {reactionState === 'EARLY' && (
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-amber-800 font-rajdhani">TOO EARLY! (False Start)</h3>
                  <p className="text-xs text-amber-700 font-medium">You clicked before the green signal.</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startReactionTest();
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {reactionState === 'FINISHED' && reactionTime && (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Drill Completed</span>
                  </div>

                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-extrabold text-slate-900 font-rajdhani">{reactionTime}</span>
                    <span className="text-xl text-[#00439c] font-mono font-bold">ms</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {reactionTime < 160 ? ' Pro Esports Tier (<160ms)' :
                     reactionTime < 185 ? ' Elite Competitive Tier' : ' Solid Baseline'}
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startReactionTest();
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retest</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveToProfile();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00439c] hover:bg-[#00367d] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save {reactionTime}ms to {activeAthlete.gamerTag}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Info */}
          <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Benchmark Stats ({activeAthlete.gamerTag})</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">Current Profile Reflex:</span>
                <span className="text-[#00439c] font-mono font-bold text-sm">{activeAthlete.psnTelemetry.reactionTimeMs}ms</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">Session Best Reflex:</span>
                <span className="text-emerald-700 font-mono font-bold text-sm">{bestReaction}ms</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">DualSense Edge Trigger Stop:</span>
                <span className="text-slate-800 font-mono font-semibold">Short Throw (0.5mm)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-700">
              <span className="font-bold text-[#00439c] block mb-1">Coach Note:</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Reflex latency under 165ms correlates with high first-shot accuracy in Warzone and instant block punishes in Tekken 8.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rapid Trigger Burst APM Drill Mode */}
      {mode === 'APM' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="w-full h-80 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
              {apmState === 'IDLE' && (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-rajdhani">Rapid Trigger APM Burst Drill</h3>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Tap the trigger button as fast as you can for 5 seconds to measure peak Actions Per Minute (APM).
                    </p>
                  </div>
                  <button
                    onClick={startAPMDrill}
                    className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    Start 5s Burst
                  </button>
                </div>
              )}

              {apmState === 'ACTIVE' && (
                <div className="space-y-4 w-full max-w-md">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-600 font-bold">
                    <span>Time Remaining: <strong className="text-rose-600 text-base">{timeLeft}s</strong></span>
                    <span>Taps Logged: <strong className="text-[#00439c] text-base">{clickCount}</strong></span>
                  </div>

                  <button
                    id="apm-tap-target-btn"
                    onClick={handleAPMClick}
                    className="w-full py-12 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-2xl active:scale-95 transition-transform shadow-md flex flex-col items-center justify-center gap-1"
                  >
                    <PSControllerIcon className="w-8 h-8 text-purple-200" />
                    <span>TAP / CLICK RAPIDLY!</span>
                  </button>
                </div>
              )}

              {apmState === 'FINISHED' && (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                    <span>Burst Finished</span>
                  </div>

                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-extrabold text-slate-900 font-rajdhani">{calculatedAPM}</span>
                    <span className="text-xl text-purple-700 font-mono font-bold">APM</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    Logged {clickCount} actions in 5 seconds.
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={startAPMDrill}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retest Burst</span>
                    </button>

                    <button
                      onClick={handleSaveToProfile}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save {calculatedAPM} APM to {activeAthlete.gamerTag}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-700" />
              <span>APM Mechanics Guide</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <p className="leading-relaxed">
                High-level fighting game competitors (Tekken 8) and battle royale fraggers maintain 320-400 APM in clutch encounters.
              </p>
              <p className="leading-relaxed">
                Utilizing DualSense Edge rear back paddles reduces finger travel distance by 34%, enhancing burst APM sustainability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
