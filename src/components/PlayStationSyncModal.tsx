import React, { useState } from 'react';
import { CrossPlatformSyncItem } from '../types';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Zap, 
  Activity, 
  Radio, 
  Globe, 
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface PlayStationSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncItems: CrossPlatformSyncItem[];
  onToggleAutoSync: (id: string) => void;
  onSyncAll: () => void;
  isSyncing: boolean;
}

export const PlayStationSyncModal: React.FC<PlayStationSyncModalProps> = ({
  isOpen,
  onClose,
  syncItems,
  onToggleAutoSync,
  onSyncAll,
  isSyncing,
}) => {
  const [psnIdInput, setPsnIdInput] = useState('TeamChampions_Official');
  const [ps5IpInput, setPs5IpInput] = useState('192.168.1.145');
  const [isCalibratingController, setIsCalibratingController] = useState(false);
  const [calibratedLatency, setCalibratedLatency] = useState<number | null>(3.8);

  if (!isOpen) return null;

  const handleCalibrate = () => {
    setIsCalibratingController(true);
    setTimeout(() => {
      setCalibratedLatency(Number((3.4 + Math.random() * 0.5).toFixed(1)));
      setIsCalibratingController(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#00439c]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight font-rajdhani">
                  PLAYSTATION NETWORK & CROSS-PLATFORM SYNC HUB
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Low-latency WebSocket & REST sync for PS5 Pro, Xbox, Steam, Riot, and EA telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PS5 DualSense Edge Hardware Calibration Card */}
        <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <PSControllerIcon className="w-4 h-4 text-[#00439c]" />
              <span>DualSense Edge Direct Polling Calibration</span>
            </div>
            <span className="text-[11px] font-mono text-[#00439c] font-bold">
              USB 1000Hz (1.0ms Target)
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Real-time packet verification for stick deadzones, adaptive trigger resistance, and haptic feedback load.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-blue-100">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Active Latency:</span>
                <span className="font-mono font-bold text-emerald-700">{calibratedLatency}ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Stick Drift Jitter:</span>
                <span className="font-mono font-bold text-[#00439c]">0.002%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Haptic Channels:</span>
                <span className="font-mono font-bold text-slate-700">Stereo + Triggers</span>
              </div>
            </div>

            <button
              onClick={handleCalibrate}
              disabled={isCalibratingController}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalibratingController ? 'animate-spin' : ''}`} />
              <span>{isCalibratingController ? 'Calibrating...' : 'Recalibrate Latency'}</span>
            </button>
          </div>
        </div>

        {/* Cross-Platform Integration Accounts Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">Connected Gaming Networks & Clouds</h4>
            <button
              onClick={onSyncAll}
              disabled={isSyncing}
              className="text-xs text-[#00439c] hover:underline flex items-center gap-1 font-bold disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync All Networks Now</span>
            </button>
          </div>

          <div className="space-y-2">
            {syncItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 flex-wrap shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {item.platform.includes('PlayStation') ? (
                      <PSControllerIcon className="w-4 h-4 text-[#00439c]" />
                    ) : item.platform.includes('Steam') ? (
                      <Globe className="w-4 h-4 text-cyan-600" />
                    ) : (
                      <Activity className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{item.platform}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{item.accountTag}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-emerald-700 font-mono font-bold flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{item.lastPingMs}ms Ping</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block">Synced {item.lastSyncTime}</span>
                  </div>

                  <button
                    onClick={() => onToggleAutoSync(item.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all shadow-sm ${
                      item.autoSyncTelemetry
                        ? 'bg-blue-50 text-[#00439c] border-blue-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.autoSyncTelemetry ? 'Auto-Sync ON' : 'Paused'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct PSN Credentials Config */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00439c]" />
            <span>PlayStation Network WebAPI Direct Telemetry Tunnel</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">PSN Organization ID</label>
              <input
                type="text"
                value={psnIdInput}
                onChange={(e) => setPsnIdInput(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono focus:outline-none focus:border-[#00439c] shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Local PS5 Console IP / Host</label>
              <input
                type="text"
                value={ps5IpInput}
                onChange={(e) => setPs5IpInput(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono focus:outline-none focus:border-[#00439c] shadow-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 flex justify-between items-center border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <PSIconTriangle className="w-2.5 h-2.5 text-emerald-600" />
            <PSIconCircle className="w-2.5 h-2.5 text-rose-500" />
            <PSIconCross className="w-2.5 h-2.5 text-[#00439c]" />
            <PSIconSquare className="w-2.5 h-2.5 text-pink-500" />
            <span className="ml-1 text-[11px]">Champions Hub v2.8 Live Protocol</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#00439c] hover:bg-[#00367d] text-white font-bold shadow-sm"
          >
            Done & Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
