import React, { useState } from 'react';
import { 
  Player, 
  ScheduleEvent, 
  CrossPlatformSyncItem, 
  NavigationTab 
} from './types';
import { 
  INITIAL_PLAYERS, 
  INITIAL_SCHEDULE_EVENTS, 
  INITIAL_CROSS_PLATFORM_SYNCS 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { PlayerRoster } from './components/PlayerRoster';
import { LiveTelemetryHUD } from './components/LiveTelemetryHUD';
import { AthleticBiometricsView } from './components/AthleticBiometricsView';
import { TeamScheduleView } from './components/TeamScheduleView';
import { HardwareReactionTester } from './components/HardwareReactionTester';
import { AICoachAdvisor } from './components/AICoachAdvisor';
import { LiveStreamDatasetView } from './components/LiveStreamDatasetView';
import { SSFSecurityDocumentationView } from './components/SSFSecurityDocumentationView';
import { PlayStationSyncModal } from './components/PlayStationSyncModal';
import { PlayerComparisonModal } from './components/PlayerComparisonModal';
import { ProfileAccountSettingsModal } from './components/ProfileAccountSettingsModal';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './components/PlayStationIcons';
import { 
  Layers, 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  Activity, 
  CheckCircle, 
  Flame 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [events, setEvents] = useState<ScheduleEvent[]>(INITIAL_SCHEDULE_EVENTS);
  const [syncItems, setSyncItems] = useState<CrossPlatformSyncItem[]>(INITIAL_CROSS_PLATFORM_SYNCS);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(INITIAL_PLAYERS[0]);

  // Modals
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [comparePlayer1, setComparePlayer1] = useState<Player | null>(INITIAL_PLAYERS[0]);
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Player handlers
  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers(prev => [newPlayer, ...prev]);
    setSelectedPlayer(newPlayer);
    showToast(`Athlete ${newPlayer.gamerTag} registered to PlayStation Roster.`);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
  };

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    if (selectedPlayer?.id === updatedPlayer.id) {
      setSelectedPlayer(updatedPlayer);
    }
    showToast(`Metrics updated for ${updatedPlayer.gamerTag}`);
  };

  const handleComparePlayer = (player: Player) => {
    setComparePlayer1(player);
    setIsCompareModalOpen(true);
  };

  const handleAnalyzeAIForPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setActiveTab('ai-coach');
  };

  // Schedule handlers
  const handleAddEvent = (newEvent: ScheduleEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    showToast(`Scheduled session "${newEvent.title}"`);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Schedule session removed.');
  };

  // Sync handlers
  const handleToggleAutoSync = (id: string) => {
    setSyncItems(prev => prev.map(item => {
      if (item.id === id) {
        const next = !item.autoSyncTelemetry;
        showToast(`${item.platform} auto-sync is now ${next ? 'enabled' : 'disabled'}`);
        return { ...item, autoSyncTelemetry: next };
      }
      return item;
    }));
  };

  const handleSyncAll = () => {
    setIsGlobalSyncing(true);
    setTimeout(() => {
      setSyncItems(prev => prev.map(item => ({
        ...item,
        lastSyncTime: 'Just now',
        lastPingMs: Math.floor(12 + Math.random() * 8),
      })));
      setIsGlobalSyncing(false);
      showToast('Successfully synchronized PlayStation Network, Steam, & Biometric Clouds.');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#00439c] selection:text-white flex flex-col">
      {/* Top PlayStation Ecosystem Status Ribbon */}
      <div className="bg-[#0f172a] border-b border-slate-800 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PS5 Pro Telemetry Node #401: Connected</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-slate-300">
            <PSControllerIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>DualSense Edge Polling: 1000Hz (3.8ms)</span>
          </div>
          <span className="text-slate-700 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1 text-cyan-400">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Live Match Feed Ready</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors"
          >
            <Layers className="w-3 h-3" />
            <span>Sync Hub ({syncItems.filter(s => s.autoSyncTelemetry).length} Active)</span>
          </button>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-1 text-slate-500">
            <PSIconTriangle className="w-2.5 h-2.5 text-emerald-400" />
            <PSIconCircle className="w-2.5 h-2.5 text-rose-500" />
            <PSIconCross className="w-2.5 h-2.5 text-blue-400" />
            <PSIconSquare className="w-2.5 h-2.5 text-pink-400" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <DashboardOverview
                players={players}
                events={events}
                syncItems={syncItems}
                onNavigateToTab={setActiveTab}
                onSelectPlayer={(p) => {
                  setSelectedPlayer(p);
                  setActiveTab('roster');
                }}
                onOpenSyncModal={() => setIsSyncModalOpen(true)}
                onOpenCompareModal={() => {
                  setComparePlayer1(players[0]);
                  setIsCompareModalOpen(true);
                }}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'roster' && (
            <motion.div
              key="roster"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <PlayerRoster
                players={players}
                selectedPlayer={selectedPlayer}
                onSelectPlayer={setSelectedPlayer}
                onAddPlayer={handleAddPlayer}
                onUpdatePlayer={handleUpdatePlayer}
                onComparePlayer={handleComparePlayer}
                onAnalyzeAI={handleAnalyzeAIForPlayer}
              />
            </motion.div>
          )}

          {activeTab === 'live-telemetry' && (
            <motion.div
              key="live-telemetry"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <LiveTelemetryHUD
                players={players}
                selectedPlayer={selectedPlayer}
                onSelectPlayer={setSelectedPlayer}
              />
            </motion.div>
          )}

          {activeTab === 'biometrics' && (
            <motion.div
              key="biometrics"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <AthleticBiometricsView
                players={players}
                onSelectPlayer={setSelectedPlayer}
                onUpdatePlayer={handleUpdatePlayer}
              />
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <TeamScheduleView
                events={events}
                players={players}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </motion.div>
          )}

          {activeTab === 'reaction-lab' && (
            <motion.div
              key="reaction-lab"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <HardwareReactionTester
                players={players}
                onUpdatePlayer={handleUpdatePlayer}
              />
            </motion.div>
          )}

          {activeTab === 'livestream-dataset' && (
            <motion.div
              key="livestream-dataset"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <LiveStreamDatasetView />
            </motion.div>
          )}

          {activeTab === 'ai-coach' && (
            <motion.div
              key="ai-coach"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <AICoachAdvisor
                players={players}
                selectedPlayer={selectedPlayer}
                onSelectPlayer={setSelectedPlayer}
              />
            </motion.div>
          )}

          {activeTab === 'security-ssf' && (
            <motion.div
              key="security-ssf"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <SSFSecurityDocumentationView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0f172a] border border-slate-700 shadow-2xl text-xs text-white font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <PlayStationSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncItems={syncItems}
        onToggleAutoSync={handleToggleAutoSync}
        onSyncAll={handleSyncAll}
        isSyncing={isGlobalSyncing}
      />

      <PlayerComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        players={players}
        initialPlayer1={comparePlayer1}
      />

      <ProfileAccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSaveNotification={showToast}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 mt-auto shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#00439c] flex items-center justify-center text-white">
              <PSControllerIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 font-rajdhani">CHAMPIONS HUB &bull; PLAYSTATION ATHLETIC PERFORMANCE</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              PlayStation Network Telemetry Connected
            </span>
            <span>Biometric Readiness Index v2.8</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
