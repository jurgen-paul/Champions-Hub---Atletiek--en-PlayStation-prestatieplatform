import React, { useState } from 'react';
import { 
  X, 
  User, 
  Settings, 
  ShieldCheck, 
  Radio, 
  Sliders, 
  Smartphone, 
  Gamepad2, 
  Heart, 
  Key, 
  Check, 
  Save, 
  RefreshCw, 
  Bell, 
  Lock, 
  FileCode,
  Layers,
  Award,
  Zap,
  Sparkles,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { PSControllerIcon } from './PlayStationIcons';

interface ProfileAccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNotification?: (msg: string) => void;
}

export const ProfileAccountSettingsModal: React.FC<ProfileAccountSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveNotification
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'telemetry' | 'playstore' | 'security'>('profile');

  // Profile state
  const [displayName, setDisplayName] = useState('Coach Julian Drake');
  const [gamerTag, setGamerTag] = useState('JD_Director');
  const [email, setEmail] = useState('oistarsentertainment@gmail.com');
  const [psnId, setPsnId] = useState('PSN-CHAMP-01');
  const [organization, setOrganization] = useState('Champions Hub Pro Esports');
  const [role, setRole] = useState('Head Athletic Director & Telemetry Specialist');

  // Telemetry Settings state
  const [samplingFrequency, setSamplingFrequency] = useState<'10Hz' | '30Hz' | '60Hz'>('60Hz');
  const [recordTriggerCurves, setRecordTriggerCurves] = useState(true);
  const [recordStickVectors, setRecordStickVectors] = useState(true);
  const [recordHapticFeedback, setRecordHapticFeedback] = useState(true);
  const [maxHeartRateAlert, setMaxHeartRateAlert] = useState(155);
  const [fatigueAlertThreshold, setFatigueAlertThreshold] = useState(65);
  const [minSleepTarget, setMinSleepTarget] = useState(8.0);

  // Play Store & ProGuard state
  const [r8Mode, setR8Mode] = useState<'standard' | 'aggressive'>('aggressive');
  const [keepJniSymbols, setKeepJniSymbols] = useState(true);
  const [autoUploadMapping, setAutoUploadMapping] = useState(true);
  const [debugLogStripping, setDebugLogStripping] = useState(true);

  if (!isOpen) return null;

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveNotification) {
      onSaveNotification('Profile account & hardware preferences saved successfully.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00439c] text-white flex items-center justify-center shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg tracking-tight font-rajdhani">
                  ACCOUNT PROFILE & HARDWARE SETTINGS
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SSF L4 VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage your coach/athlete identity, connected PlayStation devices, sensor telemetry parameters, and Play Store release configs.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white text-xs gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'border-[#00439c] text-[#00439c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & PSN Account</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'telemetry'
                ? 'border-[#00439c] text-[#00439c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Telemetry & Sensor Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('playstore')}
            className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'playstore'
                ? 'border-[#00439c] text-[#00439c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>ProGuard & Play Store</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'security'
                ? 'border-[#00439c] text-[#00439c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SSF Security & Keystore</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 space-y-6">
          {/* TAB 1: Profile & Account */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Card Banner */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#00439c] text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white">
                    JD
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white">
                    ✓
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{displayName}</h4>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-blue-100 text-[#00439c] font-bold">
                      {psnId}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs">{role} &bull; {organization}</p>
                  <span className="text-[11px] text-slate-400 font-mono block">Primary Email: {email}</span>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-bold">
                    Connected • PSN Live
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name / Display</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GamerTag / Call-sign</label>
                  <input
                    type="text"
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PlayStation Network (PSN) Online ID</label>
                  <input
                    type="text"
                    value={psnId}
                    onChange={(e) => setPsnId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-2xs font-medium font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization / Esports Team</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-[#00439c] shadow-2xs font-medium"
                  />
                </div>
              </div>

              {/* Connected Physical Hardware Devices */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-[#00439c]" />
                  <span>Paired Hardware & Sensors</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00439c] flex items-center justify-center">
                        <PSControllerIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">DualSense Edge Wireless</div>
                        <div className="text-[11px] text-slate-500">ID: DSE-PRO-0094 &bull; Latency: 1.2ms</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      92% Bat
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Whoop 4.0 Strap</div>
                        <div className="text-[11px] text-slate-500">BLE 5.3 &bull; HRV & Strain Streaming</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Polar H10 ECG Sensor</div>
                        <div className="text-[11px] text-slate-500">Chest Strap &bull; Millisecond R-R Intervals</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      Synced
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Oura Horizon Gen 3</div>
                        <div className="text-[11px] text-slate-500">Smart Ring &bull; Sleep Architecture</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      Synced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Telemetry & Sensors */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">PlayStation & Biometric Telemetry Engine</h4>
                <p className="text-slate-500 text-xs">
                  Configure high-frequency polling from DualSense controllers and wearable sensors.
                </p>
              </div>

              {/* Sampling Rate */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <label className="block font-semibold text-slate-800">
                  DualSense USB / Bluetooth Polling Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['10Hz', '30Hz', '60Hz'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setSamplingFrequency(freq)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        samplingFrequency === freq
                          ? 'bg-[#00439c] text-white border-[#00439c] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold font-mono text-sm">{freq}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {freq === '60Hz' ? 'Pro Esports Low-Jitter' : freq === '30Hz' ? 'Balanced Scrims' : 'Power Saver'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  Controller Telemetry Channels
                </h5>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Adaptive Trigger Tension Tracking (L2 / R2)</div>
                    <div className="text-[11px] text-slate-500">Record micro-gram pressure resistance curves on trigger pulls</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={recordTriggerCurves}
                    onChange={(e) => setRecordTriggerCurves(e.target.checked)}
                    className="w-4 h-4 accent-[#00439c]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Micro-Stick Deflection & Drift Vectors</div>
                    <div className="text-[11px] text-slate-500">Log thumbstick coordinates (X/Y) with sub-pixel deadzone tracking</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={recordStickVectors}
                    onChange={(e) => setRecordStickVectors(e.target.checked)}
                    className="w-4 h-4 accent-[#00439c]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Haptic Actuator Vibration Amplitude</div>
                    <div className="text-[11px] text-slate-500">Correlate voice-coil motor rumble events with athlete startle reflexes</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={recordHapticFeedback}
                    onChange={(e) => setRecordHapticFeedback(e.target.checked)}
                    className="w-4 h-4 accent-[#00439c]"
                  />
                </label>
              </div>

              {/* Threshold Sliders */}
              <div className="space-y-4 pt-2">
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                  Biometric Safety & Alert Thresholds
                </h5>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5 text-rose-700">
                      <Heart className="w-3.5 h-3.5" /> High Heart Rate Warning Ceiling:
                    </span>
                    <span className="font-mono font-bold text-rose-700">{maxHeartRateAlert} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="185"
                    value={maxHeartRateAlert}
                    onChange={(e) => setMaxHeartRateAlert(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>120 BPM (Safe)</span>
                    <span>155 BPM (Standard Pro)</span>
                    <span>185 BPM (Extreme)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5 text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5" /> Neurological Fatigue Cut-off:
                    </span>
                    <span className="font-mono font-bold text-amber-700">{fatigueAlertThreshold}% Load</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    value={fatigueAlertThreshold}
                    onChange={(e) => setFatigueAlertThreshold(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>50% (Strict)</span>
                    <span>65% (Recommended)</span>
                    <span>90% (Critical)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ProGuard & Play Store */}
          {activeTab === 'playstore' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Google Play Store & ProGuard R8 Release Engine</h4>
                <p className="text-slate-500 text-xs">
                  Review production symbolication, byte-code optimization, and Sony Software Foundation (SSF) rules.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">R8 Compiler Optimization Profile</div>
                    <div className="text-[11px] text-slate-500">Configured in root <code>proguard-rules.pro</code></div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-blue-100 text-[#00439c] font-mono font-bold text-[11px]">
                    R8 Aggressive Full-Mode
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Preserve JNI & DualSense C++ Native Methods</div>
                    <div className="text-[11px] text-slate-500">Prevent obfuscation of <code>com.sony.dualsense.*</code> native calls</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={keepJniSymbols}
                    onChange={(e) => setKeepJniSymbols(e.target.checked)}
                    className="w-4 h-4 accent-[#00439c]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Auto-Upload mapping.txt to Play Console</div>
                    <div className="text-[11px] text-slate-500">Automatic de-obfuscation of ANRs and stack traces in Google Play Console</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoUploadMapping}
                    onChange={(e) => setAutoUploadMapping(e.target.checked)}
                    className="w-4 h-4 accent-[#00439c]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Strip android.util.Log and Telemetry Debug Calls</div>
                    <div className="text-[11px] text-slate-500">Eliminates performance overhead and prevents PII leakage in production APK</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={debugLogStripping}
                    onChange={(e) => setDebugLogStripping(e.target.checked)}
                    className="w-4 h-4 accent-[#00439c]"
                  />
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                <FileCode className="w-4 h-4 text-[#00439c] shrink-0 mt-0.5" />
                <div className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>Play Store Symbol Package Ready:</strong> Native debug symbols zip and ProGuard <code>mapping.txt</code> are automatically compiled into <code>app-release.aab</code> during <code>npm run build</code>.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SSF Security & Keystore */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Sony Software Foundation (SSF) Keystore & Cryptography</h4>
                <p className="text-slate-500 text-xs">
                  Hardware-backed biometric encryption, zero-knowledge telemetry, and enterprise device certificates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Biometric Cipher</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">AES-256-GCM Hardware StrongBox</p>
                  <p className="text-[11px] text-slate-400">All sleep, HRV, and heart rate points encrypted at rest.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">PSN OAuth Token</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800">VALID</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">PKCE SHA-256 Auth v4</p>
                  <p className="text-[11px] text-slate-400">No client secret stored on client; ephemeral Bearer tokens.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h5 className="font-bold text-slate-900 text-xs">SSF Compliance Attestation Key</h5>
                <div className="p-2.5 rounded-lg bg-slate-100 font-mono text-[11px] text-slate-700 break-all border border-slate-200">
                  SHA256: 4B:9A:8C:7E:11:D3:8F:20:9C:62:3A:FF:78:E1:90:2C:4D:7E:88:21:99:A0:5B:C2:33:14:8F:09:DE:10:4A:27
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Issued By: Sony Software Foundation CA-2</span>
                  <span>Expires: Dec 2028</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/70">
          <div className="text-[11px] text-slate-500">
            Auto-saves locally &bull; SSF Audit Log ID: <span className="font-mono font-bold text-slate-700">AUD-2026-X8</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-lg bg-[#00439c] hover:bg-[#00367d] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
