export type NavigationTab = 
  | 'overview' 
  | 'roster' 
  | 'live-telemetry' 
  | 'livestream-dataset'
  | 'biometrics' 
  | 'schedule' 
  | 'reaction-lab' 
  | 'ai-coach'
  | 'security-ssf';

export type GameTitle = 
  | 'EA SPORTS FC 25'
  | 'NBA 2K25'
  | 'Gran Turismo 7'
  | 'Apex Legends'
  | 'Call of Duty: Warzone'
  | 'Tekken 8'
  | 'Rocket League';

export type EventType = 
  | 'PSN_SCRIM'
  | 'TOURNAMENT'
  | 'ATHLETIC_TRAINING'
  | 'TACTICAL_REVIEW'
  | 'RECOVERY_PHYSIO'
  | 'COGNITIVE_DRILL';

export type ControllerModel = 'DualSense' | 'DualSense Edge' | 'Custom Scuf Reflex';

export interface AthleticBiometrics {
  restingHeartRate: number; // BPM (e.g. 58)
  hrvMs: number; // Heart Rate Variability in ms (e.g. 82)
  sleepScore: number; // 0 - 100
  sleepDurationHours: number; // e.g. 8.2
  cognitiveFatigueIndex: number; // 0 (fresh) - 100 (exhausted)
  hydrationPercent: number; // 0 - 100
  physicalStrainScore: number; // 0 - 21 (Borg-like strain)
  gripStrengthKg: number; // e.g. 48.5
  deepSleepPercent: number;
}

export interface PSNTechStats {
  avgApm: number; // Actions Per Minute
  peakApm: number;
  reactionTimeMs: number; // Reflex latency
  triggerLatencyMs: number;
  aimPrecisionPercent: number;
  clutchWinRatePercent: number;
  tiltResistanceScore: number; // 0 - 100
  playTimeHoursThisWeek: number;
  dualSenseBatteryPercent: number;
  controllerType: ControllerModel;
  stickDeadzonePercent: number;
  hapticIntensitySetting: 'Standard' | 'Strong' | 'Competitive Low' | 'Disabled';
  triggerEffectSetting: 'Off (Fastest Response)' | 'Low' | 'Adaptive Dynamic';
}

export interface TrophySummary {
  level: number;
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface GameSession {
  id: string;
  gameTitle: GameTitle;
  durationMinutes: number;
  date: string;
  result: 'VICTORY' | 'DEFEAT' | 'DRAW' | '1ST_PLACE' | 'PODIUM';
  scoreOrKD: string;
  avgHeartRate: number;
  maxHeartRate: number;
  apmAverage: number;
  clutchMomentsWon: number;
  fatigueDelta: number;
  platform: 'PlayStation 5' | 'PlayStation 5 Pro' | 'PC Crossplay';
  notes: string;
}

export interface ReactionDrill {
  id: string;
  date: string;
  type: 'Visual Trigger' | 'Audio Reflex' | 'Aim Tracking' | 'Spatial DualSense';
  scoreMs: number;
  accuracyPercent: number;
}

export interface Player {
  id: string;
  name: string;
  gamerTag: string;
  avatarUrl: string;
  countryCode: string;
  role: 'Captain / Main Fragger' | 'Playmaker / Midfielder' | 'Tactical Anchor' | 'Flex Competitor' | 'Sim Racer / Specialist';
  primaryGame: GameTitle;
  secondaryGame?: GameTitle;
  psnId: string;
  psPlusTier: 'PlayStation Plus Premium' | 'PlayStation Plus Extra' | 'PlayStation Plus Essential';
  status: 'ONLINE_PS5' | 'IN_SCRIM' | 'IN_GYM' | 'RECOVERY' | 'OFFLINE';
  readinessScore: number; // 0 - 100 overall biometric readiness
  biometrics: AthleticBiometrics;
  psnTelemetry: PSNTechStats;
  trophies: TrophySummary;
  recentSessions: GameSession[];
  reactionDrills: ReactionDrill[];
  radarAttributes: {
    mechanicalSpeed: number; // 0 - 100
    staminaEndurance: number;
    tacticalIQ: number;
    reactionReflex: number;
    clutchComposure: number;
    stressResilience: number;
  };
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  assignedPlayerIds: string[];
  locationOrPlatform: 'PlayStation Network' | 'High Performance Gym' | 'Team War Room' | 'Physio Recovery Suite' | 'Discord / VOD Stream';
  intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CHAMPIONSHIP';
  notes: string;
  hasConflict?: boolean;
  conflictDetails?: string;
}

export interface CrossPlatformSyncItem {
  id: string;
  platform: 'PlayStation 5 Pro' | 'PlayStation Network' | 'Xbox Live' | 'Steam Cloud' | 'Epic Games' | 'Riot Games' | 'EA Account';
  accountTag: string;
  status: 'SYNCED_LIVE' | 'STANDBY' | 'SYNCING' | 'DISCONNECTED';
  lastPingMs: number;
  lastSyncTime: string;
  autoSyncTelemetry: boolean;
}

export interface LiveTelemetryPoint {
  timestamp: string;
  timeSeconds: number;
  heartRate: number;
  apm: number;
  stressIndex: number;
  reactionMs: number;
  triggerPressionPct: number;
  gameStatusEvent?: string;
}

export interface AIAnalysisResult {
  readinessScore: number;
  peakWindow: string;
  fatigueRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  keyInsights: string[];
  recommendations: string[];
  tacticalFocus: string;
}

// -------------------------------------------------------------
// LIVESTREAM GAME DATASET TYPES
// -------------------------------------------------------------

export type LiveStreamPlatform = 'PlayStation Network Live' | 'Twitch Interactive' | 'YouTube Gaming' | 'Steam Broadcast';

export interface LiveStreamEvent {
  id: string;
  timestamp: string; // "MM:SS"
  timeSeconds: number;
  type: 'KILL' | 'DEATH' | 'GOAL' | 'OVERTAKE' | 'CLUTCH_WON' | 'ULTIMATE_USED' | 'TACTICAL_PAUSE' | 'TIMEOUT' | 'HEART_SPIKE';
  title: string;
  description: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  playerInvolved: string;
  heartRateAtEvent: number;
  apmAtEvent: number;
}

export interface LiveStreamTelemetryPacket {
  packetId: number;
  timestamp: string; // e.g. "14:22.400"
  timeSeconds: number;
  // Biometrics
  heartRateBpm: number;
  hrvMs: number;
  stressIndex: number; // 0-100
  galvanicSkinMicroSiemens: number;
  pupilDilationMm: number;
  // DualSense Edge Controller Telemetry
  leftStick: { x: number; y: number }; // -1.0 to 1.0
  rightStick: { x: number; y: number }; // -1.0 to 1.0
  l2TriggerPressurePct: number; // 0 - 100%
  r2TriggerPressurePct: number; // 0 - 100%
  currentApm: number;
  controllerPollingLatencyMs: number;
  hapticFeedbackLoadHz: number;
  activeButtons: ('TRIANGLE' | 'CIRCLE' | 'CROSS' | 'SQUARE' | 'L1' | 'R1' | 'L2' | 'R2')[];
  // Game state
  gameScore: string;
  gameStatePhase: string;
  inGameEvent?: string;
}

export interface LiveStreamQualityMetrics {
  bitrateKbps: number; // e.g. 18500
  fps: number; // 60 or 120
  resolution: string; // "3840x2160 (4K HDR)"
  packetLossPercent: number; // 0.01%
  audioCodec: string; // "Dolby Atmos 5.1 / 48kHz"
  streamLatencySeconds: number; // 1.2s ultra-low latency
  edgeServerNode: string; // "EU-LON-PSN-EDGE-09"
}

export interface LiveStreamMatch {
  id: string;
  title: string;
  game: GameTitle;
  tournament: string;
  platform: LiveStreamPlatform;
  streamUrl: string;
  thumbnailUrl: string;
  casterTag: string;
  athleteTag: string;
  athleteName: string;
  athleteAvatar: string;
  currentViewerCount: number;
  status: 'LIVE_BROADCASTING' | 'REPLAY_VOD' | 'SCRIM_SIMULATION';
  durationSeconds: number;
  quality: LiveStreamQualityMetrics;
  events: LiveStreamEvent[];
  telemetryPackets: LiveStreamTelemetryPacket[];
  summaryStats: {
    avgHeartRate: number;
    peakHeartRate: number;
    avgApm: number;
    peakApm: number;
    totalClutches: number;
    avgTriggerLatencyMs: number;
  };
}

// -------------------------------------------------------------
// SONY SOFTWARE FOUNDATION (SSF) & PROGUARD / PLAY STORE DEBUG
// -------------------------------------------------------------

export interface SSFBadge {
  id: string;
  name: string;
  issuer: 'Sony Software Foundation' | 'PlayStation Security Group' | 'Google Play Protect' | 'OWASP' | 'FIPS';
  tier: 'Level 4 Enterprise' | 'Gold Certified' | 'Hardware Enclave' | 'Zero-Trust';
  badgeIcon: string;
  description: string;
  verificationHash: string;
  issuedDate: string;
  expiryDate: string;
  status: 'VERIFIED' | 'VALID' | 'ACTIVE';
}

export interface SSFComplianceItem {
  id: string;
  category: 'Cryptography' | 'PlayStation WebAPI' | 'Biometric Privacy' | 'DualSense JNI' | 'Play Store Integrity';
  standard: string;
  description: string;
  status: 'COMPLIANT' | 'ENFORCED' | 'AUDITED';
  lastAuditDate: string;
  implementationDetail: string;
}

export interface PlayStoreSymbolEntry {
  obfuscatedClass: string;
  originalClass: string;
  obfuscatedMethod: string;
  originalMethod: string;
  lineNumberMapping: string;
  module: 'TelemetrySDK' | 'LiveStreamDataset' | 'DualSenseJNI' | 'SSFSecurity' | 'BiometricsEngine';
}
