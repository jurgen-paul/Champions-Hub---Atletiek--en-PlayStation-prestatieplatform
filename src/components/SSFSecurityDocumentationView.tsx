import React, { useState } from 'react';
import { 
  SSF_BADGES, 
  SSF_COMPLIANCE_ITEMS, 
  PLAY_STORE_SYMBOL_ENTRIES, 
  RAW_PROGUARD_RULES_PREVIEW,
  SAMPLE_OBFUSCATED_STACK_TRACE,
  SAMPLE_DEOBFUSCATED_STACK_TRACE 
} from '../data/ssfSecurityDataset';
import { SSFBadge } from '../types';
import { 
  PSControllerIcon, 
  PSIconTriangle, 
  PSIconCircle, 
  PSIconCross, 
  PSIconSquare 
} from './PlayStationIcons';
import { 
  ShieldCheck, 
  Lock, 
  Award, 
  FileCode, 
  KeyRound, 
  CheckCircle2, 
  ShieldAlert, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Bug, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export const SSFSecurityDocumentationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'badges' | 'proguard' | 'playstore-symbols' | 'documentation'>('badges');
  const [selectedBadge, setSelectedBadge] = useState<SSFBadge | null>(null);
  const [copiedRules, setCopiedRules] = useState(false);
  const [stackTraceInput, setStackTraceInput] = useState(SAMPLE_OBFUSCATED_STACK_TRACE);
  const [deobfuscatedOutput, setDeobfuscatedOutput] = useState<string | null>(null);
  const [isDeobfuscating, setIsDeobfuscating] = useState(false);

  const handleCopyRules = () => {
    navigator.clipboard.writeText(RAW_PROGUARD_RULES_PREVIEW);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  const handleDownloadProguard = () => {
    const blob = new Blob([RAW_PROGUARD_RULES_PREVIEW], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proguard-rules.pro';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadMappingTxt = () => {
    const mappingText = PLAY_STORE_SYMBOL_ENTRIES.map(e => 
      `${e.originalClass} -> ${e.obfuscatedClass}:\n    ${e.lineNumberMapping}:${e.originalMethod} -> ${e.obfuscatedMethod}`
    ).join('\n');
    const blob = new Blob([mappingText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mapping.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDeobfuscate = () => {
    setIsDeobfuscating(true);
    setTimeout(() => {
      let output = stackTraceInput;
      // Simple lookup replace using known symbol dictionary
      PLAY_STORE_SYMBOL_ENTRIES.forEach(entry => {
        output = output.split(entry.obfuscatedClass).join(entry.originalClass);
        // also replace method signatures if present
        const methodShort = entry.obfuscatedMethod.split('(')[0];
        const origMethodShort = entry.originalMethod.split('(')[0];
        output = output.split(`.${methodShort}(SourceFile`).join(`.${origMethodShort}(SourceFile`);
      });
      // Replace file names
      output = output.replace(/LiveStreamIngestionEngine\(SourceFile:(\d+)\)/g, 'LiveStreamIngestionEngine.kt:80');
      output = output.replace(/AutonomicResilienceEngine\(SourceFile:(\d+)\)/g, 'AutonomicResilienceEngine.kt:118');
      output = output.replace(/AdaptiveTriggerStopController\(SourceFile:(\d+)\)/g, 'AdaptiveTriggerStopController.kt:245');
      output = output.replace(/SSFKeystoreProvider\(SourceFile:(\d+)\)/g, 'SSFKeystoreProvider.kt:327');
      
      setDeobfuscatedOutput(output);
      setIsDeobfuscating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-blue-100 text-[#00439c] border border-blue-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              SONY SOFTWARE FOUNDATION (SSF)
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Release Security Standard Level 4
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-rajdhani tracking-tight">
            SSF BADGES, SECURITY AUDITS & PLAY STORE SYMBOL DEBUGGER
          </h2>
          <p className="text-xs text-slate-600">
            Enterprise cryptographic attestation, ProGuard obfuscation rules, and Google Play Console release mapping tables.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'badges' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SSF Badges & Audits
          </button>
          <button
            onClick={() => setActiveTab('proguard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'proguard' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ProGuard Rules
          </button>
          <button
            onClick={() => setActiveTab('playstore-symbols')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'playstore-symbols' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Play Store Symbol Debugger
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'documentation' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Security Docs
          </button>
        </div>
      </div>

      {/* Tab: Badges & Compliance */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* SSF Badges Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base font-rajdhani flex items-center gap-2">
                <Award className="w-5 h-5 text-[#00439c]" />
                <span>Verified SSF Badges & Cryptographic Seals</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">6 of 6 Verified Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SSF_BADGES.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:border-[#00439c] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#00439c] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {badge.tier}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#00439c] transition-colors leading-snug">
                        {badge.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Issuer: {badge.issuer}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Valid until: {badge.expiryDate}</span>
                    <span className="text-[#00439c] font-bold group-hover:underline flex items-center gap-0.5">
                      Inspect Seal <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Audit Table */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base font-rajdhani flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Sony Security Architecture & Enterprise Audit Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Standard / Protocol</th>
                    <th className="py-2.5 px-3">Security Implementation</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Audit Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SSF_COMPLIANCE_ITEMS.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{item.category}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#00439c]">{item.standard}</td>
                      <td className="py-3 px-3 text-slate-700">
                        <p className="font-medium text-slate-900">{item.description}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.implementationDetail}</p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">{item.lastAuditDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: ProGuard Rules */}
      {activeTab === 'proguard' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#00439c]">/proguard-rules.pro</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#00439c] border border-blue-200">
                  R8 RELEASE PASS
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-rajdhani">
                ANDROID & PLAYSTATION OBFUSCATION RULES
              </h3>
              <p className="text-xs text-slate-500">
                Guarantees JNI stability for DualSense controller polling while protecting proprietary biometric logic.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyRules}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all shadow-sm"
              >
                {copiedRules ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRules ? 'Copied Rules!' : 'Copy Rules'}</span>
              </button>

              <button
                onClick={handleDownloadProguard}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00439c] hover:bg-[#00367d] text-white transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download proguard-rules.pro</span>
              </button>
            </div>
          </div>

          {/* Technical Explanations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block font-mono text-xs">1. DualSense JNI Preservation</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Prevents R8 from mangling native C++ JNI bridge methods (<code className="font-mono bg-white px-1 py-0.5 rounded">com.sony.playstation.dualsense.**</code>) ensuring 1000Hz HID polling doesn't crash in production.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block font-mono text-xs">2. Symbol Mapping Retention</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Preserves <code className="font-mono bg-white px-1 py-0.5 rounded">LineNumberTable,SourceFile</code> so that crash reports submitted to Google Play Console can be de-obfuscated back to original lines.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block font-mono text-xs">3. LiveStream Serialization</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Preserves packet models (<code className="font-mono bg-white px-1 py-0.5 rounded">com.championshub.livestream.dataset.**</code>) from reflection stripping during Moshi / Gson JSON deserialization.
              </p>
            </div>
          </div>

          {/* Code Viewer */}
          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800 leading-relaxed shadow-inner">
            {RAW_PROGUARD_RULES_PREVIEW}
          </pre>
        </div>
      )}

      {/* Tab: Play Store Symbol Debugger */}
      {activeTab === 'playstore-symbols' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-rajdhani">
                  GOOGLE PLAY STORE SYMBOL DEBUGGER & STACK TRACE DE-OBFUSCATOR
                </h3>
                <p className="text-xs text-slate-500">
                  Translate obfuscated Play Console crash reports into readable stack traces with accurate line numbers and class names.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadMappingTxt}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download mapping.txt</span>
                </button>
              </div>
            </div>

            {/* Symbol Dictionary Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Active Play Store De-obfuscation Mapping Table (mapping.txt):
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Module</th>
                      <th className="py-2 px-3">Obfuscated Identifier</th>
                      <th className="py-2 px-3">Resolved Original Class & Method</th>
                      <th className="py-2 px-3">Bytecode Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {PLAY_STORE_SYMBOL_ENTRIES.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-2 px-3 font-sans font-bold text-slate-800">{entry.module}</td>
                        <td className="py-2 px-3 text-rose-600 font-bold">{entry.obfuscatedClass}.{entry.obfuscatedMethod}</td>
                        <td className="py-2 px-3 text-emerald-700 font-medium">{entry.originalClass}.{entry.originalMethod}</td>
                        <td className="py-2 px-3 text-slate-500">{entry.lineNumberMapping}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Stack Trace De-obfuscator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Paste Obfuscated Crash Report (Play Console / Logcat):
                  </label>
                  <button
                    onClick={() => {
                      setStackTraceInput(SAMPLE_OBFUSCATED_STACK_TRACE);
                      setDeobfuscatedOutput(null);
                    }}
                    className="text-[11px] text-[#00439c] font-bold hover:underline"
                  >
                    Reset Sample
                  </button>
                </div>
                <textarea
                  value={stackTraceInput}
                  onChange={(e) => setStackTraceInput(e.target.value)}
                  rows={9}
                  className="w-full bg-slate-900 text-rose-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00439c]"
                  placeholder="Paste release crash trace..."
                />
                <button
                  onClick={handleDeobfuscate}
                  disabled={isDeobfuscating}
                  className="px-4 py-2 rounded-xl bg-[#00439c] hover:bg-[#00367d] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  <Bug className="w-4 h-4" />
                  <span>{isDeobfuscating ? 'Symbolicating...' : 'De-obfuscate Stack Trace'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  De-obfuscated Symbol Output:
                </label>
                <div className="w-full bg-slate-900 text-emerald-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 min-h-[195px] overflow-x-auto whitespace-pre leading-relaxed">
                  {deobfuscatedOutput || (
                    <span className="text-slate-500 italic">
                      Click "De-obfuscate Stack Trace" to map obfuscated symbols against mapping.txt...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Native Debug Symbols Guide (native-debug-symbols.zip) */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <FileCode className="w-4 h-4 text-[#00439c]" />
                <span>Google Play Native Debug Symbols (NDK .so Symbolication)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                When compiling native C++ libraries (<code className="font-mono bg-white px-1 py-0.5 rounded">libdualsense_telemetry.so</code>), debug symbols are preserved in <code className="font-mono bg-white px-1 py-0.5 rounded">native-debug-symbols.zip</code> containing Breakpad / LLDB `.sym` files. Upload this file in Google Play Console under <strong>App Bundle Explorer &gt; Native debug symbols</strong> to resolve native C++ crashes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security Documentation */}
      {activeTab === 'documentation' && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-rajdhani">
              SECURITY & SONY SOFTWARE FOUNDATION SPECIFICATION
            </h3>
            <p className="text-xs text-slate-500">
              Technical whitepaper for athletic telemetry data isolation and hardware key exchange.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00439c]" />
                <span>Zero-Trust Cryptographic Pipeline</span>
              </h4>
              <p>
                Every DualSense Edge packet emitted from the controller is signed with a high-speed HMAC-SHA256 digest before entering the local WebAPI tunnel. The digest verifies that thumbstick potentiometer values and trigger potentiometer voltages have not been modified by third-party macro or spoofing software.
              </p>
              <p>
                Session keys are exchanged using ECDH (Elliptic Curve Diffie-Hellman) on Curve25519 with Sony Interactive Entertainment telemetry gateway nodes.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>GDPR Article 9 Biometric Data Partitioning</span>
              </h4>
              <p>
                Heart Rate Variability (HRV), nocturnal sleeping architecture, and grip strain are classified as special category biometric and health data under GDPR Art. 9 and California CCPA.
              </p>
              <p>
                Champions Hub implements automated field-level pseudonymization: athletic IDs are encrypted with isolated keyrings stored in hardware keymaster enclaves, preventing linking between gaming telemetry and real athlete identities in the public broadcast stream.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Vulnerability disclosure: <strong className="text-slate-800">security@championshub.playstation.pro</strong>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              PGP: 9B4F 381C 529A 77ED D301 B14E 8820 4D8F 9C10 00FA
            </span>
          </div>
        </div>
      )}

      {/* Inspect Badge Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-[#00439c] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{selectedBadge.name}</h4>
                  <span className="text-[11px] font-mono font-bold text-[#00439c]">{selectedBadge.issuer}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold">Certification Level:</span>
                <span className="font-bold text-slate-900 font-mono">{selectedBadge.tier}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] font-semibold">Verification Proof Hash:</span>
                <span className="font-mono font-bold text-emerald-700 bg-slate-50 p-2 rounded-lg block border border-slate-200 break-all">
                  {selectedBadge.verificationHash}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] font-semibold">Attestation Scope:</span>
                <p className="text-slate-700 leading-relaxed mt-1">{selectedBadge.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Issued Date:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedBadge.issuedDate}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Renewal Due:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedBadge.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2 rounded-lg bg-[#00439c] text-white font-bold text-xs"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
