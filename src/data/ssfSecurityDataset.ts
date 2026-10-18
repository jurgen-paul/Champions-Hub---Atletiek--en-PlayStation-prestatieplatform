import { SSFBadge, SSFComplianceItem, PlayStoreSymbolEntry } from '../types';

export const SSF_BADGES: SSFBadge[] = [
  {
    id: 'ssf-badge-01',
    name: 'Sony Software Foundation (SSF) Level 4 Enterprise',
    issuer: 'Sony Software Foundation',
    tier: 'Level 4 Enterprise',
    badgeIcon: 'ShieldCheck',
    description: 'Certified for zero-trust cryptographic pipeline, anti-tamper runtime attestation, and enterprise esports telemetry security.',
    verificationHash: 'SSF-SIE-2026-9041-A8F4-E71B-9402',
    issuedDate: '2026-04-15',
    expiryDate: '2027-04-15',
    status: 'VERIFIED',
  },
  {
    id: 'ssf-badge-02',
    name: 'PlayStation Network WebAPI OAuth 2.1 & PKCE',
    issuer: 'PlayStation Security Group',
    tier: 'Gold Certified',
    badgeIcon: 'KeyRound',
    description: 'Enforces ephemeral session nonces, proof key code exchange (PKCE), and mTLS tunnel with Sony Interactive Entertainment clusters.',
    verificationHash: 'PSN-OAUTH21-PKCE-88219-PROD',
    issuedDate: '2026-06-01',
    expiryDate: '2027-06-01',
    status: 'ACTIVE',
  },
  {
    id: 'ssf-badge-03',
    name: 'DualSense End-to-End Packet Encryption (AES-GCM-256)',
    issuer: 'Sony Software Foundation',
    tier: 'Zero-Trust',
    badgeIcon: 'Lock',
    description: 'Hardware Keystore-backed AES-256-GCM authenticated cipher for low-latency (1000Hz) controller input and anti-cheat validation.',
    verificationHash: 'AES-GCM-256-DUALSENSE-HARDWARE-01',
    issuedDate: '2026-02-10',
    expiryDate: '2027-02-10',
    status: 'VERIFIED',
  },
  {
    id: 'ssf-badge-04',
    name: 'OWASP Mobile Security MASVS-L2 Certified',
    issuer: 'OWASP',
    tier: 'Level 4 Enterprise',
    badgeIcon: 'Award',
    description: 'Full adherence to OWASP Mobile Application Security Verification Standard Level 2: Architecture, Cryptography, and Tampering.',
    verificationHash: 'OWASP-MASVS-L2-CHAMPIONS-HUB-2026',
    issuedDate: '2026-05-20',
    expiryDate: '2027-05-20',
    status: 'VALID',
  },
  {
    id: 'ssf-badge-05',
    name: 'Google Play Protect & Strong Hardware Integrity',
    issuer: 'Google Play Protect',
    tier: 'Hardware Enclave',
    badgeIcon: 'CheckCircle2',
    description: 'Meets MEETS_STRONG_INTEGRITY verdict on Google Play Integrity API via hardware-backed Keymaster enclave.',
    verificationHash: 'PLAY-INTEGRITY-STRONG-VERIFIED-99',
    issuedDate: '2026-07-11',
    expiryDate: '2027-07-11',
    status: 'VERIFIED',
  },
  {
    id: 'ssf-badge-06',
    name: 'FIPS 140-3 Cryptographic Module Attestation',
    issuer: 'FIPS',
    tier: 'Gold Certified',
    badgeIcon: 'ShieldAlert',
    description: 'Cryptographic module validation for athlete nocturnal biometrics, heart rate telemetry, and personal medical data isolation.',
    verificationHash: 'FIPS-140-3-NIST-CMVP-77401',
    issuedDate: '2026-03-30',
    expiryDate: '2027-03-30',
    status: 'ACTIVE',
  },
];

export const SSF_COMPLIANCE_ITEMS: SSFComplianceItem[] = [
  {
    id: 'comp-1',
    category: 'Cryptography',
    standard: 'FIPS 140-3 & AES-GCM-256',
    description: 'All DualSense USB/Bluetooth packets and athlete biometric records are encrypted using AES-GCM-256 with keys derived from Android Keystore / Apple Secure Enclave.',
    status: 'ENFORCED',
    lastAuditDate: '2026-08-15',
    implementationDetail: 'Hardware-backed keys never leave the secure element. Ephemeral session initialization vector (IV) regenerated per match packet stream.',
  },
  {
    id: 'comp-2',
    category: 'PlayStation WebAPI',
    standard: 'SIE WebAPI Auth Spec v4.2',
    description: 'PlayStation Network API communication utilizes mutual TLS (mTLS) with pinned SIE root authority certificates and token revocation auto-polling.',
    status: 'COMPLIANT',
    lastAuditDate: '2026-08-20',
    implementationDetail: 'Token refresh cycle is 1800s. Refresh tokens stored with ENCRYPTED_SHREDDER policy in volatile memory during scrim sessions.',
  },
  {
    id: 'comp-3',
    category: 'Biometric Privacy',
    standard: 'GDPR Article 9 & COPPA Safe Harbor',
    description: 'Special category biometric data (HRV, sleeping telemetry, grip strain) is processed with Zero-Knowledge athlete pseudonymization before cloud ingestion.',
    status: 'AUDITED',
    lastAuditDate: '2026-07-28',
    implementationDetail: 'Athlete real name, gamerTag, and biometric health profiles are split across partitioned shards with separate decryption keys.',
  },
  {
    id: 'comp-4',
    category: 'DualSense JNI',
    standard: 'Anti-Cheat & Kernel Anti-Tamper',
    description: 'Native C++ driver (libdualsense_telemetry.so) integrity verification via SHA-384 self-digest and JNI signature verification on initialization.',
    status: 'ENFORCED',
    lastAuditDate: '2026-08-01',
    implementationDetail: 'ProGuard keeps native symbol hooks intact while obfuscating non-JNI callers. Line numbers retained for Play Store symbolication.',
  },
  {
    id: 'comp-5',
    category: 'Play Store Integrity',
    standard: 'Google Play Integrity API (Strong Tier)',
    description: 'Enforces genuine app binary validation, non-rooted device environment verification, and Google Play licensing check prior to joining esports scrims.',
    status: 'COMPLIANT',
    lastAuditDate: '2026-08-10',
    implementationDetail: 'Play Console App Signing key fingerprint verified with Play Integrity nonce generation to prevent man-in-the-middle telemetry tampering.',
  },
];

export const PLAY_STORE_SYMBOL_ENTRIES: PlayStoreSymbolEntry[] = [
  {
    obfuscatedClass: 'com.championshub.a.a',
    originalClass: 'com.championshub.telemetry.dualsense.DualSensePacketParser',
    obfuscatedMethod: 'a(byte[], int)',
    originalMethod: 'parseUsbHidReport(byte[] rawBuffer, int bufferLength)',
    lineNumberMapping: '42:58 -> 180:196',
    module: 'DualSenseJNI',
  },
  {
    obfuscatedClass: 'com.championshub.a.b',
    originalClass: 'com.championshub.livestream.dataset.LiveStreamIngestionEngine',
    obfuscatedMethod: 'b(com.championshub.a.c)',
    originalMethod: 'ingestTelemetryPacket(LiveStreamTelemetryPacket packet)',
    lineNumberMapping: '12:28 -> 74:90',
    module: 'LiveStreamDataset',
  },
  {
    obfuscatedClass: 'com.championshub.b.a',
    originalClass: 'com.championshub.security.SSFKeystoreProvider',
    obfuscatedMethod: 'c(java.lang.String)',
    originalMethod: 'verifyHardwareSignature(String encryptedPayload)',
    lineNumberMapping: '91:105 -> 320:334',
    module: 'SSFSecurity',
  },
  {
    obfuscatedClass: 'com.championshub.c.d',
    originalClass: 'com.championshub.biometrics.AutonomicResilienceEngine',
    obfuscatedMethod: 'd(int, float)',
    originalMethod: 'calculateCognitiveFatigue(int hrBpm, float hrvMs)',
    lineNumberMapping: '14:32 -> 110:128',
    module: 'BiometricsEngine',
  },
  {
    obfuscatedClass: 'com.championshub.d.e',
    originalClass: 'com.championshub.telemetry.trigger.AdaptiveTriggerStopController',
    obfuscatedMethod: 'e(float, int)',
    originalMethod: 'setCompetitiveTriggerProfile(float deadzone, int resistanceCurve)',
    lineNumberMapping: '66:80 -> 240:254',
    module: 'TelemetrySDK',
  },
];

export const RAW_PROGUARD_RULES_PREVIEW = `# ------------------------------------------------------------------------------------------------
# CHAMPIONS HUB - ATHLETIC & PLAYSTATION PERFORMANCE PLATFORM
# Production ProGuard / R8 Obfuscation & Security Rules
# Sony Software Foundation (SSF) Compliant - Level 4 Enterprise
# Google Play Store & PlayStation Partner Release Configuration
# ------------------------------------------------------------------------------------------------

-repackageclasses 'com.championshub.internal'
-allowaccessmodification
-mergeinterfacesaggressively
-overloadaggressively
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose

# Symbolication & Crash Reporting (Google Play Console)
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,Exceptions
-printmapping build/outputs/mapping/release/mapping.txt
-printseeds build/outputs/mapping/release/seeds.txt
-printusage build/outputs/mapping/release/usage.txt

# PlayStation DualSense & Edge Controller Telemetry SDK
-keep class com.sony.playstation.dualsense.** {
    <fields>;
    <methods>;
}

-keep class com.championshub.telemetry.dualsense.** {
    public protected *;
}

-keepclasseswithmembernames class * {
    native <methods>;
}

# Preserve DualSense HID Report Packet structures
-keepclassmembers class com.championshub.telemetry.models.DualSenseReportPacket {
    public <fields>;
}

# Sony Software Foundation (SSF) Security Framework
-keep class com.sony.ssf.security.** {
    public *;
}

-keep interface com.sony.ssf.security.ISSFTokenProvider {
    *;
}

-keep class com.championshub.security.SSFSecurityProvider {
    public <init>(...);
    public <methods>;
}

# Live Stream Game Telemetry Dataset & Serialization
-keep class com.championshub.livestream.dataset.** {
    public <fields>;
    public <methods>;
}

-keep class com.championshub.models.telemetry.** {
    public <fields>;
    public <methods>;
}

# Strip debug logs in release builds
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}`;

export const SAMPLE_OBFUSCATED_STACK_TRACE = `FATAL EXCEPTION: main
Process: com.championshub.esports, PID: 18492
java.lang.NullPointerException: Attempt to invoke virtual method 'boolean com.championshub.a.a.a(byte[])' on a null object reference
    at com.championshub.a.b.b(SourceFile:18)
    at com.championshub.c.d.d(SourceFile:22)
    at com.championshub.d.e.e(SourceFile:71)
    at com.championshub.b.a.c(SourceFile:98)
    at android.os.Handler.handleCallback(Handler.java:958)
    at android.os.Handler.dispatchMessage(Handler.java:99)
    at android.os.Looper.loopOnce(Looper.java:230)`;

export const SAMPLE_DEOBFUSCATED_STACK_TRACE = `FATAL EXCEPTION: main
Process: com.championshub.esports, PID: 18492
java.lang.NullPointerException: Attempt to invoke virtual method 'boolean com.championshub.telemetry.dualsense.DualSensePacketParser.parseUsbHidReport(byte[], int)' on a null object reference
    at com.championshub.livestream.dataset.LiveStreamIngestionEngine.ingestTelemetryPacket(LiveStreamIngestionEngine.kt:80)
    at com.championshub.biometrics.AutonomicResilienceEngine.calculateCognitiveFatigue(AutonomicResilienceEngine.kt:118)
    at com.championshub.telemetry.trigger.AdaptiveTriggerStopController.setCompetitiveTriggerProfile(AdaptiveTriggerStopController.kt:245)
    at com.championshub.security.SSFKeystoreProvider.verifyHardwareSignature(SSFKeystoreProvider.kt:327)
    at android.os.Handler.handleCallback(Handler.java:958)
    at android.os.Handler.dispatchMessage(Handler.java:99)
    at android.os.Looper.loopOnce(Looper.java:230)`;
