import React, { useState } from 'react';
import { Player, ScheduleEvent, EventType } from '../types';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  X, 
  Filter, 
  MapPin, 
  Users, 
  Trash2, 
  BrainCircuit, 
  Dumbbell, 
  Trophy, 
  Activity,
  ShieldCheck
} from 'lucide-react';
import { optimizeScheduleAI } from '../services/api';

interface TeamScheduleViewProps {
  events: ScheduleEvent[];
  players: Player[];
  onAddEvent: (event: ScheduleEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const TeamScheduleView: React.FC<TeamScheduleViewProps> = ({
  events,
  players,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('PSN_SCRIM');
  const [date, setDate] = useState('2026-08-30');
  const [startTime, setStartTime] = useState('14:30');
  const [endTime, setEndTime] = useState('17:30');
  const [locationOrPlatform, setLocationOrPlatform] = useState<ScheduleEvent['locationOrPlatform']>('PlayStation Network');
  const [intensity, setIntensity] = useState<ScheduleEvent['intensity']>('CHAMPIONSHIP');
  const [assignedPlayerIds, setAssignedPlayerIds] = useState<string[]>(['p1', 'p2', 'p3']);
  const [notes, setNotes] = useState('');

  // Conflict Detection logic
  const checkConflicts = () => {
    const conflicts: Array<{ event1: ScheduleEvent; event2: ScheduleEvent; reason: string }> = [];
    
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const e1 = events[i];
        const e2 = events[j];

        if (e1.date === e2.date) {
          if (
            (e1.type === 'ATHLETIC_TRAINING' && (e2.type === 'PSN_SCRIM' || e2.type === 'TOURNAMENT')) ||
            (e2.type === 'ATHLETIC_TRAINING' && (e1.type === 'PSN_SCRIM' || e1.type === 'TOURNAMENT'))
          ) {
            const sharedPlayers = e1.assignedPlayerIds.filter(id => e2.assignedPlayerIds.includes(id));
            if (sharedPlayers.length > 0) {
              conflicts.push({
                event1: e1,
                event2: e2,
                reason: `Athletic training closely precedes competitive PlayStation scrim for ${sharedPlayers.length} athletes. Potential forearm fatigue risk.`,
              });
            }
          }
        }
      }
    }
    return conflicts;
  };

  const conflicts = checkConflicts();

  const handleOptimizeWithAI = async () => {
    setIsOptimizing(true);
    const res = await optimizeScheduleAI(events, players);
    setOptimizationResult(res);
    setIsOptimizing(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newEv: ScheduleEvent = {
      id: `ev-${Date.now()}`,
      title,
      type,
      date,
      startTime,
      endTime,
      assignedPlayerIds,
      locationOrPlatform,
      intensity,
      notes,
    };

    onAddEvent(newEv);
    setIsAddModalOpen(false);
    setTitle('');
    setNotes('');
  };

  const togglePlayerAssignment = (id: string) => {
    setAssignedPlayerIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredEvents = events.filter(ev => {
    if (filterType === 'ALL') return true;
    return ev.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2 font-rajdhani">
            <span>TEAM SCRIM & ATHLETIC SCHEDULE</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-50 text-[#00439c] border border-blue-200">
              {events.length} Sessions
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Harmonizing PlayStation competitive scrimmages, tournament finals, gym conditioning, and neuro-recovery protocols.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="ai-schedule-opt-btn"
            onClick={handleOptimizeWithAI}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all disabled:opacity-50 shadow-sm"
          >
            <Sparkles className={`w-4 h-4 text-indigo-600 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing...' : 'AI Schedule Optimizer'}</span>
          </button>

          <button
            id="add-event-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* AI Schedule Optimization Banner if triggered */}
      {optimizationResult && (
        <div className="rounded-2xl bg-indigo-50/70 border border-indigo-200 p-5 space-y-3 relative shadow-sm">
          <button 
            onClick={() => setOptimizationResult(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Gemini Schedule Optimization Blueprint</h3>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {optimizationResult.coachSummary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {optimizationResult.optimizedPlan?.map((plan: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-white border border-indigo-100 text-xs shadow-sm">
                <span className="text-[#00439c] font-mono font-bold block">{plan.time}</span>
                <span className="font-bold text-slate-800 mt-1 block">{plan.title}</span>
                <span className="text-[10px] text-indigo-600 mt-1 block font-semibold">{plan.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conflict Detection Notice */}
      {conflicts.length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 text-xs shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-800">Biometric Recovery Buffer Notice</h4>
            <p className="text-slate-600 leading-relaxed">
              {conflicts[0].reason} Athletes should receive 30 minutes of forearm stretching & electrolyte replenishment between sessions.
            </p>
          </div>
        </div>
      )}

      {/* Filters Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors shadow-sm ${
            filterType === 'ALL' ? 'bg-[#00439c] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Sessions ({events.length})
        </button>
        <button
          onClick={() => setFilterType('PSN_SCRIM')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors shadow-sm ${
            filterType === 'PSN_SCRIM' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          PlayStation Scrims
        </button>
        <button
          onClick={() => setFilterType('TOURNAMENT')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors shadow-sm ${
            filterType === 'TOURNAMENT' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Championship Finals
        </button>
        <button
          onClick={() => setFilterType('ATHLETIC_TRAINING')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors shadow-sm ${
            filterType === 'ATHLETIC_TRAINING' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Athletic & Gym Training
        </button>
        <button
          onClick={() => setFilterType('COGNITIVE_DRILL')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors shadow-sm ${
            filterType === 'COGNITIVE_DRILL' ? 'bg-cyan-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Reflex & DualSense Drills
        </button>
        <button
          onClick={() => setFilterType('RECOVERY_PHYSIO')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors shadow-sm ${
            filterType === 'RECOVERY_PHYSIO' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Physio Recovery
        </button>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-3">
        {filteredEvents.map((ev) => {
          const assignedPlayers = players.filter(p => ev.assignedPlayerIds.includes(p.id));
          return (
            <div
              key={ev.id}
              className="rounded-xl bg-white border border-slate-200 p-5 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="text-center min-w-[70px] p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-mono text-[#00439c] font-bold block">{ev.startTime}</span>
                  <span className="text-[10px] text-slate-400 block">to {ev.endTime}</span>
                  <span className="text-[10px] text-slate-600 font-bold block mt-1">{ev.date}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      ev.type === 'PSN_SCRIM' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      ev.type === 'TOURNAMENT' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      ev.type === 'ATHLETIC_TRAINING' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      ev.type === 'COGNITIVE_DRILL' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                      'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    }`}>
                      {ev.type.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#00439c]" />
                      <span>{ev.locationOrPlatform}</span>
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#00439c]" />
                      <span>{assignedPlayers.length} Athletes Assigned</span>
                    </span>
                  </div>

                  {ev.notes && (
                    <p className="text-xs text-slate-600 pt-1">
                      {ev.notes}
                    </p>
                  )}

                  {/* Assigned Player Avatar Row */}
                  <div className="flex items-center gap-1.5 pt-2">
                    {assignedPlayers.map(p => (
                      <div 
                        key={p.id} 
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-[10px] text-slate-700 border border-slate-200 font-medium"
                        title={p.gamerTag}
                      >
                        <img src={p.avatarUrl} alt={p.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                        <span>{p.gamerTag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className={`text-[11px] px-2.5 py-1 rounded-md font-bold uppercase ${
                  ev.intensity === 'CHAMPIONSHIP' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  ev.intensity === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {ev.intensity} Load
                </span>

                <button
                  onClick={() => onDeleteEvent(ev.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                  title="Remove Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00439c] flex items-center justify-center border border-blue-200">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Schedule Scrim or Training Session</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bo7 PS5 Tournament Scrim vs Fnatic"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Session Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  >
                    <option value="PSN_SCRIM">PlayStation Scrimmage</option>
                    <option value="TOURNAMENT">Tournament Match</option>
                    <option value="ATHLETIC_TRAINING">Athletic / Gym Conditioning</option>
                    <option value="COGNITIVE_DRILL">Reflex & Reaction Drill</option>
                    <option value="TACTICAL_REVIEW">Tactical VOD Review</option>
                    <option value="RECOVERY_PHYSIO">Physio / Hydrotherapy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Platform / Venue</label>
                  <select
                    value={locationOrPlatform}
                    onChange={(e) => setLocationOrPlatform(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  >
                    <option value="PlayStation Network">PlayStation Network</option>
                    <option value="High Performance Gym">High Performance Gym</option>
                    <option value="Team War Room">Team War Room</option>
                    <option value="Physio Recovery Suite">Physio Recovery Suite</option>
                    <option value="Discord / VOD Stream">Discord / VOD Stream</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Training Intensity</label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                  >
                    <option value="LOW">Low Recovery</option>
                    <option value="MEDIUM">Medium Steady</option>
                    <option value="HIGH">High Competitive</option>
                    <option value="CHAMPIONSHIP">Championship Max</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assign Athletes</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {players.map(p => {
                    const isSelected = assignedPlayerIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlayerAssignment(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors font-medium ${
                          isSelected 
                            ? 'bg-[#00439c] text-white font-bold' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span>{p.gamerTag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes / Tactical Focus</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Test new fast-break transition on DualSense Edge paddles"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-sm"
                ></textarea>
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
                  <span>Save to Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
