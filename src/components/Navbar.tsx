import React from 'react';
import { NavigationTab } from '../types';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  Activity, 
  Users, 
  Calendar, 
  Radio, 
  BrainCircuit, 
  Zap, 
  Sliders, 
  Layers,
  Tv,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSyncModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSyncModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f172a] text-slate-300 border-b border-slate-800 shadow-md">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <button 
              id="nav-brand-logo"
              onClick={() => onSelectTab('overview')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-9 h-9 bg-[#00439c] rounded-lg flex items-center justify-center shadow-sm group-hover:bg-[#00367d] transition-all">
                <PSControllerIcon className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white tracking-tight text-lg font-rajdhani">
                    CHAMPIONS HUB
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#1e293b] text-blue-400 border border-slate-700">
                    PSN PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block leading-none">Athletic Telemetry & Cross-Platform Engine</p>
              </div>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-tab-overview"
              onClick={() => onSelectTab('overview')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-roster"
              onClick={() => onSelectTab('roster')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'roster'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Team Roster</span>
            </button>

            <button
              id="nav-tab-telemetry"
              onClick={() => onSelectTab('live-telemetry')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'live-telemetry'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-rose-500/40'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 text-rose-400" />
              <span className="flex items-center gap-1.5">
                <span>Live Session HUD</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              </span>
            </button>

            <button
              id="nav-tab-biometrics"
              onClick={() => onSelectTab('biometrics')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'biometrics'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Biometrics & Physio</span>
            </button>

            <button
              id="nav-tab-schedule"
              onClick={() => onSelectTab('schedule')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'schedule'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Schedule</span>
            </button>

            <button
              id="nav-tab-reaction"
              onClick={() => onSelectTab('reaction-lab')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'reaction-lab'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Reaction Drill</span>
            </button>

            <button
              id="nav-tab-livestream"
              onClick={() => onSelectTab('livestream-dataset')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'livestream-dataset'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-purple-500/40'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-purple-400" />
              <span>Live Dataset</span>
            </button>

            <button
              id="nav-tab-aicoach"
              onClick={() => onSelectTab('ai-coach')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ai-coach'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-indigo-500/40'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>AI Coach</span>
            </button>

            <button
              id="nav-tab-security"
              onClick={() => onSelectTab('security-ssf')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'security-ssf'
                  ? 'bg-[#1e293b] text-white shadow-sm border border-emerald-500/40'
                  : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SSF & ProGuard</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              id="psn-sync-hub-btn"
              onClick={onOpenSyncModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white shadow-sm transition-all border border-blue-400/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cross-Platform Sync</span>
              <span className="sm:hidden">Sync</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-slate-800 scrollbar-none text-xs">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#1e293b] text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('roster')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'roster' ? 'bg-[#1e293b] text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            Team Roster
          </button>
          <button
            onClick={() => onSelectTab('live-telemetry')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'live-telemetry' ? 'bg-rose-600 text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            Live HUD
          </button>
          <button
            onClick={() => onSelectTab('biometrics')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'biometrics' ? 'bg-[#1e293b] text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            Biometrics
          </button>
          <button
            onClick={() => onSelectTab('schedule')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'schedule' ? 'bg-[#1e293b] text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => onSelectTab('reaction-lab')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'reaction-lab' ? 'bg-[#1e293b] text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            Reflex Drill
          </button>
          <button
            onClick={() => onSelectTab('livestream-dataset')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'livestream-dataset' ? 'bg-purple-600 text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            Live Dataset
          </button>
          <button
            onClick={() => onSelectTab('ai-coach')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'ai-coach' ? 'bg-[#1e293b] text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            AI Coach
          </button>
          <button
            onClick={() => onSelectTab('security-ssf')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
              activeTab === 'security-ssf' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            SSF & ProGuard
          </button>
        </div>
      </div>
    </header>
  );
};
