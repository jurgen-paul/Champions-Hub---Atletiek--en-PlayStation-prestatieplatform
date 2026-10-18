import React, { useState, useEffect, useMemo } from 'react';
import { 
  LiveStreamMatch, 
  LiveStreamTelemetryPacket, 
  LiveStreamEvent, 
  GameTitle 
} from '../types';
import { LIVESTREAM_MATCH_DATASETS } from '../data/livestreamDataset';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Download, 
  FileCode, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Activity, 
  Heart, 
  Zap, 
  Eye, 
  Sliders, 
  Flame, 
  Tv, 
  Wifi, 
  ShieldCheck, 
  Sparkles, 
  Search,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export const LiveStreamDatasetView: React.FC = () => {
  const [matches, setMatches] = useState<LiveStreamMatch[]>(LIVESTREAM_MATCH_DATASETS);
  const [selectedMatchId, setSelectedMatchId] = useState<string>(LIVESTREAM_MATCH_DATASETS[0].id);
  const [packetIndex, setPacketIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'stream-hud' | 'dataset-explorer' | 'packet-injector'>('stream-hud');
  const [jsonFilterQuery, setJsonFilterQuery] = useState<string>('');

  // Custom packet injection state
  const [injectHr, setInjectHr] = useState<number>(155);
  const [injectApm, setInjectApm] = useState<number>(410);
  const [injectEventText, setInjectEventText] = useState<string>('Custom 1v2 Scrim Clutch Point');
  const [injectSuccessNotice, setInjectSuccessNotice] = useState<string | null>(null);

  const activeMatch = useMemo(() => {
    return matches.find(m => m.id === selectedMatchId) || matches[0];
  }, [matches, selectedMatchId]);

  const packets = activeMatch.telemetryPackets;
  const currentPacket: LiveStreamTelemetryPacket = packets[packetIndex] || packets[0];

  // Auto playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = Math.max(1200 / playbackSpeed, 500);
    const interval = setInterval(() => {
      setPacketIndex(prev => (prev + 1) % packets.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, packets.length]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeMatch, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeMatch, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `championshub-livestream-${activeMatch.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCsv = () => {
    // Generate CSV from telemetry packets
    const headers = [
      'packetId',
      'timestamp',
      'timeSeconds',
      'heartRateBpm',
      'hrvMs',
      'stressIndex',
      'currentApm',
      'l2TriggerPressurePct',
      'r2TriggerPressurePct',
      'leftStickX',
      'leftStickY',
      'rightStickX',
      'rightStickY',
      'controllerPollingLatencyMs',
      'gameScore',
      'gameStatePhase',
      'inGameEvent',
    ];

    const rows = packets.map(p => [
      p.packetId,
      p.timestamp,
      p.timeSeconds,
      p.heartRateBpm,
      p.hrvMs,
      p.stressIndex,
      p.currentApm,
      p.l2TriggerPressurePct,
      p.r2TriggerPressurePct,
      p.leftStick.x,
      p.leftStick.y,
      p.rightStick.x,
      p.rightStick.y,
      p.controllerPollingLatencyMs,
      `"${p.gameScore}"`,
      `"${p.gameStatePhase}"`,
      `"${p.inGameEvent || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `championshub-telemetry-${activeMatch.id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleInjectPacket = (e: React.FormEvent) => {
    e.preventDefault();
    const newPacket: LiveStreamTelemetryPacket = {
      packetId: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      timeSeconds: packets.length * 30,
      heartRateBpm: Number(injectHr),
      hrvMs: Math.max(30, 95 - Number(injectHr) * 0.35),
      stressIndex: Math.min(100, Math.floor(Number(injectHr) * 0.6)),
      galvanicSkinMicroSiemens: 12.4,
      pupilDilationMm: 4.9,
      leftStick: { x: 0.62, y: -0.45 },
      rightStick: { x: -0.55, y: 0.8 },
      l2TriggerPressurePct: 95,
      r2TriggerPressurePct: 100,
      currentApm: Number(injectApm),
      controllerPollingLatencyMs: 3.5,
      hapticFeedbackLoadHz: 180,
      activeButtons: ['R1', 'CROSS', 'TRIANGLE'],
      gameScore: 'Live Test Injection',
      gameStatePhase: 'Custom Packet Ingestion',
      inGameEvent: injectEventText,
    };

    setMatches(prev => prev.map(m => {
      if (m.id === activeMatch.id) {
        return {
          ...m,
          telemetryPackets: [...m.telemetryPackets, newPacket],
        };
      }
      return m;
    }));

    setPacketIndex(packets.length); // Jump to injected packet
    setInjectSuccessNotice(`Injected telemetry packet #${newPacket.packetId} into stream dataset.`);
    setTimeout(() => setInjectSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Match Selector */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              LIVE STREAM DATASET FEED
            </span>
            <span className="text-xs text-slate-500 font-mono">
              WebSocket Direct 1000Hz Ingest
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-rajdhani tracking-tight">
            PLAYSTATION & ESPORTS BROADCAST TELEMETRY MATRIX
          </h2>
          <p className="text-xs text-slate-600">
            Real-time biometric data sync, DualSense stick/trigger telemetry streams, and frame-accurate match datasets.
          </p>
        </div>

        {/* Match Picker and View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedMatchId}
            onChange={(e) => {
              setSelectedMatchId(e.target.value);
              setPacketIndex(0);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00439c] shadow-sm"
          >
            {matches.map(m => (
              <option key={m.id} value={m.id}>
                {m.game} &bull; {m.athleteTag} ({m.platform})
              </option>
            ))}
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('stream-hud')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'stream-hud' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stream HUD
            </button>
            <button
              onClick={() => setActiveSubTab('dataset-explorer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'dataset-explorer' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              JSON & CSV Export
            </button>
            <button
              onClick={() => setActiveSubTab('packet-injector')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'packet-injector' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Packet Injector
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'stream-hud' && (
        <div className="space-y-6">
          {/* Main Visualizer Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream Video & Real-time Telemetry Screen (Left 2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl aspect-video flex flex-col justify-between p-5 text-white">
                {/* Background Game Art */}
                <img
                  src={activeMatch.thumbnailUrl}
                  alt={activeMatch.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity filter blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80"></div>

                {/* Top Overlay Bar */}
                <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      LIVE STREAM
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
                      {activeMatch.platform}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      Viewers: <strong className="text-white font-mono">{activeMatch.currentViewerCount.toLocaleString()}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeMatch.quality.resolution}</span>
                    <span className="text-slate-500">|</span>
                    <span>{activeMatch.quality.fps} FPS</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-cyan-400">{activeMatch.quality.streamLatencySeconds}s Delay</span>
                  </div>
                </div>

                {/* Center In-Game Event Banner if active */}
                <div className="relative z-10 my-auto text-center space-y-2">
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/30 inline-block">
                    {currentPacket.gameStatePhase}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-rajdhani text-white drop-shadow-md">
                    {currentPacket.inGameEvent || activeMatch.title}
                  </h3>
                  <div className="inline-block bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-1.5 font-mono text-sm font-bold text-emerald-400 shadow-lg">
                    {currentPacket.gameScore}
                  </div>
                </div>

                {/* Bottom Overlay: Real-time Telemetry Gauges */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-800/80 backdrop-blur-sm bg-slate-950/50 -mx-5 -mb-5 p-4">
                  {/* Heart Rate */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Heart Rate</span>
                      <span className="text-lg font-bold font-mono text-rose-400 leading-none">
                        {currentPacket.heartRateBpm} <span className="text-[10px] font-sans text-slate-400">BPM</span>
                      </span>
                    </div>
                  </div>

                  {/* Real-time APM */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Actions/Min</span>
                      <span className="text-lg font-bold font-mono text-blue-400 leading-none">
                        {currentPacket.currentApm} <span className="text-[10px] font-sans text-slate-400">APM</span>
                      </span>
                    </div>
                  </div>

                  {/* DualSense Trigger Latency */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <PSControllerIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">DualSense Latency</span>
                      <span className="text-lg font-bold font-mono text-emerald-400 leading-none">
                        {currentPacket.controllerPollingLatencyMs} <span className="text-[10px] font-sans text-slate-400">ms</span>
                      </span>
                    </div>
                  </div>

                  {/* Stress Index */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Stress Index</span>
                      <span className="text-lg font-bold font-mono text-purple-400 leading-none">
                        {currentPacket.stressIndex}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stream Playback & Packet Stepper Controller */}
              <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-xl bg-[#00439c] hover:bg-[#00367d] text-white shadow-sm transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setPacketIndex(0)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    title="Restart Stream Telemetry"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPacketIndex((packetIndex + 1) % packets.length)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    title="Next Telemetry Packet"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <div className="text-xs font-mono font-bold text-slate-800 ml-2">
                    Packet {packetIndex + 1} / {packets.length} ({currentPacket.timestamp})
                  </div>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-semibold mr-1">Speed:</span>
                  {[0.5, 1, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        playbackSpeed === spd
                          ? 'bg-[#00439c] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Direct Event Jump Badges */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs text-slate-400 font-semibold">Events:</span>
                  {activeMatch.events.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => {
                        // Find closest packet index
                        const foundIdx = packets.findIndex(p => p.timeSeconds >= ev.timeSeconds);
                        setPacketIndex(foundIdx >= 0 ? foundIdx : 0);
                      }}
                      className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#00439c] border border-blue-200 hover:bg-blue-100 transition-all whitespace-nowrap"
                    >
                      {ev.timestamp} {ev.type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-time DualSense Controller & Biometric Diagnostic (Right 1 col) */}
            <div className="space-y-4">
              {/* DualSense Hardware Telemetry Box */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <PSControllerIcon className="w-5 h-5 text-[#00439c]" />
                    <h4 className="font-bold text-slate-900 text-sm font-rajdhani">
                      DUALSENSE EDGE LIVE TELEMETRY
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-blue-50 text-[#00439c] border border-blue-200">
                    USB 1000Hz
                  </span>
                </div>

                {/* Left & Right Stick Coordinate Visualizer */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Stick (Move) */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Left Stick (Movement)
                    </span>
                    <div className="w-20 h-20 mx-auto rounded-full border-2 border-dashed border-slate-300 relative bg-white flex items-center justify-center shadow-inner">
                      {/* Center Crosshairs */}
                      <div className="absolute w-full h-[1px] bg-slate-200"></div>
                      <div className="absolute h-full w-[1px] bg-slate-200"></div>
                      {/* Dynamic Stick Head */}
                      <div
                        className="w-5 h-5 rounded-full bg-[#00439c] border-2 border-white shadow-md transition-all duration-150 absolute"
                        style={{
                          transform: `translate(${currentPacket.leftStick.x * 26}px, ${-currentPacket.leftStick.y * 26}px)`,
                        }}
                      ></div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-600 font-semibold">
                      X: {currentPacket.leftStick.x.toFixed(2)} | Y: {currentPacket.leftStick.y.toFixed(2)}
                    </div>
                  </div>

                  {/* Right Stick (Aim / Camera) */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Right Stick (Aiming)
                    </span>
                    <div className="w-20 h-20 mx-auto rounded-full border-2 border-dashed border-slate-300 relative bg-white flex items-center justify-center shadow-inner">
                      {/* Center Crosshairs */}
                      <div className="absolute w-full h-[1px] bg-slate-200"></div>
                      <div className="absolute h-full w-[1px] bg-slate-200"></div>
                      {/* Dynamic Stick Head */}
                      <div
                        className="w-5 h-5 rounded-full bg-cyan-600 border-2 border-white shadow-md transition-all duration-150 absolute"
                        style={{
                          transform: `translate(${currentPacket.rightStick.x * 26}px, ${-currentPacket.rightStick.y * 26}px)`,
                        }}
                      ></div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-600 font-semibold">
                      X: {currentPacket.rightStick.x.toFixed(2)} | Y: {currentPacket.rightStick.y.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Adaptive Trigger Pressure Bars */}
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span className="font-semibold">L2 Trigger Depression:</span>
                      <span className="font-mono font-bold text-slate-900">{currentPacket.l2TriggerPressurePct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-150"
                        style={{ width: `${currentPacket.l2TriggerPressurePct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span className="font-semibold">R2 Trigger Depression:</span>
                      <span className="font-mono font-bold text-slate-900">{currentPacket.r2TriggerPressurePct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-600 rounded-full transition-all duration-150"
                        style={{ width: `${currentPacket.r2TriggerPressurePct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500 font-medium">Haptic Feedback Load:</span>
                    <span className="font-mono font-bold text-slate-800">{currentPacket.hapticFeedbackLoadHz} Hz</span>
                  </div>
                </div>

                {/* Active PlayStation Buttons Pressed */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 block mb-2 uppercase tracking-wide">
                    Active Button Matrix:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border font-mono font-bold text-xs transition-all ${
                      currentPacket.activeButtons.includes('TRIANGLE')
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-300 border-slate-200'
                    }`}>
                      <PSIconTriangle className="w-4 h-4" />
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border font-mono font-bold text-xs transition-all ${
                      currentPacket.activeButtons.includes('CIRCLE')
                        ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 text-slate-300 border-slate-200'
                    }`}>
                      <PSIconCircle className="w-4 h-4" />
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border font-mono font-bold text-xs transition-all ${
                      currentPacket.activeButtons.includes('CROSS')
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-slate-50 text-slate-300 border-slate-200'
                    }`}>
                      <PSIconCross className="w-4 h-4" />
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border font-mono font-bold text-xs transition-all ${
                      currentPacket.activeButtons.includes('SQUARE')
                        ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                        : 'bg-slate-50 text-slate-300 border-slate-200'
                    }`}>
                      <PSIconSquare className="w-4 h-4" />
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs ${
                      currentPacket.activeButtons.includes('R1') ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      R1
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg border font-mono font-bold text-xs ${
                      currentPacket.activeButtons.includes('L1') ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      L1
                    </div>
                  </div>
                </div>
              </div>

              {/* Athlete Stream Card */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeMatch.athleteAvatar}
                    alt={activeMatch.athleteName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{activeMatch.athleteTag}</h4>
                    <p className="text-xs text-slate-500">{activeMatch.athleteName}</p>
                    <span className="text-[10px] font-mono text-[#00439c] font-bold">
                      {activeMatch.tournament}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Peak Heart Rate:</span>
                    <span className="font-mono font-bold text-rose-600">{activeMatch.summaryStats.peakHeartRate} BPM</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Peak Actions:</span>
                    <span className="font-mono font-bold text-blue-600">{activeMatch.summaryStats.peakApm} APM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Timeline Table */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-base font-rajdhani flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00439c]" />
              <span>Match Event Stream Timeline</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Event Title & Tactical Description</th>
                    <th className="py-2.5 px-3 text-center">Heart Rate</th>
                    <th className="py-2.5 px-3 text-center">APM</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeMatch.events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{ev.timestamp}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ev.type === 'CLUTCH_WON' || ev.type === 'GOAL' || ev.type === 'OVERTAKE'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : ev.type === 'HEART_SPIKE'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {ev.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 block">{ev.title}</strong>
                        <span className="text-slate-500 text-[11px]">{ev.description}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-600">
                        {ev.heartRateAtEvent} BPM
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600">
                        {ev.apmAtEvent} APM
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            const foundIdx = packets.findIndex(p => p.timeSeconds >= ev.timeSeconds);
                            setPacketIndex(foundIdx >= 0 ? foundIdx : 0);
                          }}
                          className="px-2.5 py-1 rounded bg-[#00439c] text-white font-bold text-[11px] hover:bg-[#00367d]"
                        >
                          Jump To
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'dataset-explorer' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
          {/* Header & Export Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-rajdhani">
                LIVESTREAM TELEMETRY DATASET REPOSITORY
              </h3>
              <p className="text-xs text-slate-500">
                Full schema compliant with ML training, sports science analytics, and PlayStation Network telemetry replay.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all shadow-sm"
              >
                {copiedJson ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedJson ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export .JSON</span>
              </button>

              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export .CSV</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-semibold">Total Packets in Feed:</span>
              <span className="text-lg font-mono font-bold text-slate-900">{activeMatch.telemetryPackets.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-semibold">Logged Game Events:</span>
              <span className="text-lg font-mono font-bold text-slate-900">{activeMatch.events.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-semibold">Edge Stream Ingestion:</span>
              <span className="text-lg font-mono font-bold text-emerald-700">{activeMatch.quality.edgeServerNode}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-semibold">Bitrate / Quality:</span>
              <span className="text-lg font-mono font-bold text-blue-700">{activeMatch.quality.bitrateKbps.toLocaleString()} Kbps</span>
            </div>
          </div>

          {/* JSON Dataset Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono font-semibold">Raw JSON Document Preview</span>
              <span>Schema Version 3.4 &bull; PlayStation Certified</span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-blue-300 font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800 shadow-inner">
              {JSON.stringify(activeMatch, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {activeSubTab === 'packet-injector' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-rajdhani">
              LIVE TELEMETRY PACKET INJECTOR & SIMULATOR
            </h3>
            <p className="text-xs text-slate-500">
              Simulate live tournament spikes, sudden motor APM bursts, and test live ingest listeners.
            </p>
          </div>

          {injectSuccessNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{injectSuccessNotice}</span>
            </div>
          )}

          <form onSubmit={handleInjectPacket} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Heart Rate (BPM):
                </label>
                <input
                  type="number"
                  min="60"
                  max="200"
                  value={injectHr}
                  onChange={(e) => setInjectHr(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#00439c]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Actions Per Minute (APM):
                </label>
                <input
                  type="number"
                  min="100"
                  max="600"
                  value={injectApm}
                  onChange={(e) => setInjectApm(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-[#00439c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">
                In-Game Tactical Event Description:
              </label>
              <input
                type="text"
                value={injectEventText}
                onChange={(e) => setInjectEventText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00439c]"
                placeholder="e.g. 1v3 Match Point Clutch Win"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#00439c] hover:bg-[#00367d] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Inject Packet into Active Stream Dataset</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
