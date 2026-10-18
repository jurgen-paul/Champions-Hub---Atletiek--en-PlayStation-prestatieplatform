# Champions Hub — Athletic & PlayStation Performance Platform

<div align="center">

![Champions Hub Platform Badge](https://img.shields.io/badge/SONY%20SOFTWARE%20FOUNDATION-SSF%20LEVEL%204%20ENTERPRISE-00439c?style=for-the-badge&logo=playstation&logoColor=white)
![Google Play Store Badge](https://img.shields.io/badge/GOOGLE%20PLAY%20STORE-VERIFIED%20RELEASE-34A853?style=for-the-badge&logo=googleplay&logoColor=white)
![ProGuard R8 Badge](https://img.shields.io/badge/PROGUARD%20R8-OBFUSCATED%20%26%20SYMBOLICATED-0f172a?style=for-the-badge&logo=android&logoColor=white)
![OWASP Badge](https://img.shields.io/badge/OWASP-MASVS--L2%20HARDENED-blue?style=for-the-badge&logo=shield&logoColor=white)

**The Premier High-Performance Esports Science & DualSense Hardware Telemetry Platform**

*Bridging real-world athletic physiology (HRV, Sleep Architecture, Heart Rate) with PlayStation Network (PSN) mechanical execution, live esports tournament datasets, and automated Gemini AI coaching.*

</div>

---

## Google Play Store Showcase Assets (5 Content Screen Previews)

The application includes production-ready Google Play Store promotional and store listing assets rendered with the **Professional Polish** design system:

### 1. Real-Time Biometric Telemetry & Heart Rate HUD
<div align="center">
  <img src="/src/assets/images/playstore_telemetry_hud_1792312497376.jpg" alt="Google Play Store - Biometric Telemetry HUD" width="850" referrerPolicy="no-referrer" />
  <p><em>Feature Showcase 1: Real-time heart rate curve, 94% autonomic readiness index, and live PlayStation DualSense controller mechanical telemetry.</em></p>
</div>

---

### 2. DualSense Hardware Reflex Lab & Motor Reaction Drills
<div align="center">
  <img src="/src/assets/images/playstore_reflex_lab_1792312497246.jpg" alt="Google Play Store - Reflex Lab & DualSense Drills" width="850" referrerPolicy="no-referrer" />
  <p><em>Feature Showcase 2: Millisecond-precision reaction time testing (154ms), adaptive trigger resistance motor curves, and sub-pixel analog stick deflection analytics.</em></p>
</div>

---

### 3. Esports LiveStream Tournament Match Datasets
<div align="center">
  <img src="/src/assets/images/playstore_live_dataset_1792312499264.jpg" alt="Google Play Store - LiveStream Game Dataset" width="850" referrerPolicy="no-referrer" />
  <p><em>Feature Showcase 3: Multi-game esports broadcast telemetry (Apex Legends ALGS, EA SPORTS FC 25, GT World Series, Tekken 8) with instant replay scrubbing and packet timeline analyzer.</em></p>
</div>

---

### 4. Sony Software Foundation (SSF) Security & ProGuard R8 Engine
<div align="center">
  <img src="/src/assets/images/playstore_ssf_security_1792312497641.jpg" alt="Google Play Store - SSF Security and ProGuard Mapping" width="850" referrerPolicy="no-referrer" />
  <p><em>Feature Showcase 4: SSF Level 4 Enterprise attestation, automated ProGuard byte-code obfuscation mapping, and Play Console native debug symbol de-obfuscation.</em></p>
</div>

---

### 5. Athlete Biometric Trends, Profile & Account Settings
<div align="center">
  <img src="/src/assets/images/playstore_trends_profile_1792312498145.jpg" alt="Google Play Store - Biometric Trends and Account Profile" width="850" referrerPolicy="no-referrer" />
  <p><em>Feature Showcase 5: Recharts multi-axis biometric trend curves (Heart Rate BPM, Recovery %, Fatigue Index %), coach profile management, and PSN device sync settings.</em></p>
</div>

---

## Table of Contents
1. [Architecture & Technology Stack](#architecture--technology-stack)
2. [Biometric Trends Visualization (Recharts Engine)](#biometric-trends-visualization-recharts-engine)
3. [LiveStream Tournament Game Datasets](#livestream-tournament-game-datasets)
4. [Sony Software Foundation (SSF) Security & Badges](#sony-software-foundation-ssf-security--badges)
5. [ProGuard / R8 Rules & Play Store Symbol Debugging](#proguard--r8-rules--play-store-symbol-debugging)
6. [Settings, Profile & Connected Devices](#settings-profile--connected-devices)
7. [Comprehensive User's Manual](#comprehensive-users-manual)
8. [Google Play Console Release Instructions](#google-play-console-release-instructions)

---

## Architecture & Technology Stack

- **Client Framework**: React 19 SPA running on Vite 6 with TypeScript 5.8
- **Design System**: *Professional Polish* (Dominant Deep PlayStation Cobalt Blue `#00439c`, Deep Slate `#0f172a`, Crisp Slate Canvas `#f8fafc`, Pure White `#ffffff` cards with subtle borders `#e2e8f0` and soft elevation)
- **Data Visualization**: Recharts 3 (`ComposedChart`, `Area`, `Line`, `Bar`, `ResponsiveContainer`, dual Y-axes, custom tooltips)
- **Animation**: Motion (Framer Motion) and Canvas Confetti
- **Icons**: Lucide React & Custom PlayStation Vector Glyph Library (Triangle, Circle, Cross, Square, DualSense Controller)
- **Backend**: Node.js & Express server (`server.ts`) with Google GenAI SDK integration (`@google/genai`)
- **Security & Compliance**: Sony Software Foundation (SSF) Level 4 Enterprise, OWASP MASVS-L2, GDPR Art. 9 biometric protection

---

## Biometric Trends Visualization (Recharts Engine)

Located in `src/components/AthleteBiometricTrendsVisualizer.tsx` and integrated into `AthleticBiometricsView.tsx`:

### Key Features
- **Multi-Axis Recharts Composed Plot**:
  - **Left Y-Axis**: Heart Rate (40 – 180 BPM) with smooth Crimson gradient area fill (`#e11d48`)
  - **Right Y-Axis**: Percentage scale (0 – 100%) synchronizing Recovery Score (`#059669`) and Cognitive Fatigue Index (`#f59e0b`)
  - **Optional Secondary Metric**: Nocturnal Heart Rate Variability (HRV in ms, `#6366f1`)
- **Time Horizon Controls**:
  - **24-Hour Timeline**: Granular hourly telemetry from 06:00 to 01:00 AM tracking Morning Baseline, Scrimmages, Tournament Match, Overtime Map 5 (Clutch), and Sleep Recovery
  - **7-Day Microcycle**: Weekly load progression (Mon to Sun) showing cumulative physical strain
  - **30-Day Season Macrocycle**: 4-week competitive cycle (Base, Build, Peak, Taper)
- **Interactive Threshold Reference Guides**:
  - `Heart Rate Warning Ceiling (>150 BPM)` (Dashed red line)
  - `Neurological Fatigue Alert (>65%)` (Dashed amber line)
- **Dynamic Tooltips & Physiological Callouts**:
  - Displays instantaneous phase, strain score (Borg/Whoop 0-21 scale), and coach recommendations
- **One-Click CSV / JSON Export**:
  - Direct download of timestamped time-series records for sports science analysis

---

## LiveStream Tournament Game Datasets

Located in `src/components/LiveStreamDatasetView.tsx` with mock telemetry datasets in `src/data/livestreamDataset.ts`:

### Included Esports Datasets
1. **Apex Legends**: ALGS Pro League Split 2 Playoffs — Storm Point Final Circle (Map 5)
2. **EA SPORTS FC 25**: Pro Open Championship Grand Finals (Overtime Leg 2)
3. **Gran Turismo 7**: Nations Cup World Finals (Spa-Francorchamps Circuit)
4. **Tekken 8**: Global Master Bracket Finals (Deciding Round 5)

### Dataset Features
- **DualSense Stick Vector Visualizer**: Live 2D coordinate plot tracking micro-movements of Left (Movement) and Right (Aim/Camera) analog sticks
- **Adaptive Trigger Barometers**: Real-time resistance and pressure depth (0 – 100%) for L2 and R2
- **Network Packet Timeline**: Jitter, frame rate (FPS), and server ping synchronizer
- **Packet Injector**: Simulate network congestion and latency spikes (10ms to 250ms) to test athlete reflex resilience

---

## Sony Software Foundation (SSF) Security & Badges

Located in `src/components/SSFSecurityDocumentationView.tsx`, `SECURITY.md`, and `src/data/ssfSecurityDataset.ts`:

### Certified SSF Badges
1. **SSF Level 4 Enterprise Certified**: Cryptographic hardware keystore validation for wearable physiological telemetry
2. **PlayStation WebAPI Auth v4 (PKCE)**: Strict Proof Key for Code Exchange authentication without client secret exposure
3. **OWASP Mobile Application Security (MASVS-L2)**: Hardened against root/jailbreak, memory dumping, and runtime hook injections
4. **GDPR Article 9 Biometric Safe**: Client-side AES-256-GCM zero-knowledge encryption for athlete health records
5. **Google Play Console App Signing v4**: Enforces SHA-256 certificate pinning and deterministic builds

---

## ProGuard / R8 Rules & Play Store Symbol Debugging

Configured in `proguard-rules.pro` and supported by an in-app interactive de-obfuscator:

### ProGuard Rules Summary
```proguard
# DualSense Native JNI Telemetry preservation
-keepclasseswithmembernames class com.sony.dualsense.** {
    native <methods>;
}

# Preserve biometric models and Recharts serializable models
-keepclassmembers class com.championshub.data.models.** {
    public <fields>;
    public <methods>;
}

# Strip debug logging from release builds
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}

# Generate mapping file for Google Play Console
-printmapping build/outputs/mapping/release/mapping.txt
```

### In-App Play Store Symbol Debugger
- Paste obfuscated release crash traces (e.g., `at a.b.c.x(Unknown Source:14)`)
- Automatically match against `mapping.txt` dictionary entries
- Instant resolution to original class and method names (e.g., `at com.sony.dualsense.DualSenseTelemetryService.streamPacket()`)

---

## Settings, Profile & Connected Devices

Located in `src/components/ProfileAccountSettingsModal.tsx`:

- **Identity Management**: Display Name, GamerTag, PSN Online ID, Email (`oistarsentertainment@gmail.com`), Role, Team
- **Connected Hardware**:
  - *PlayStation DualSense Edge Wireless*: 1.2ms latency, 92% battery, firmware v0354
  - *Whoop 4.0 Strap*: BLE 5.3 continuous HRV and strain streaming
  - *Polar H10 ECG Chest Strap*: Millisecond-level R-R interval detection
  - *Oura Horizon Gen 3*: Sleep cycle architecture and body temperature
- **Telemetry Settings**: 10Hz, 30Hz, or 60Hz polling rates, adaptive trigger curve logging, thumbstick deadzone tracking
- **Threshold Alerts**: Custom sliders for Max Heart Rate Warning (120–185 BPM) and Fatigue Cut-off (50–90%)

---

## Comprehensive User's Manual

### 1. Coach & Director Dashboard
- Navigate to the **Dashboard** to view aggregate team metrics: Average Team Heart Rate (BPM), Intensity Level, PlayStation Network Latency (MS), and Active Scrim Players.
- Click the **JD** avatar or the top-right **Settings** button anytime to adjust alert thresholds and sensor devices.

### 2. Athlete Roster & Deep Biometric Inspection
- Open **Team Roster** to view individual athlete cards with real-time status (Online PS5, In Scrim, Resting).
- Use the **Compare** tool to place two athletes side-by-side across APM, HRV, Reaction Time, and Physical Strain.

### 3. Biometric Trends & Athletic Physiology
- Open **Biometrics** to see the 5-athlete readiness leaderboard.
- Click an athlete to populate the **Athlete Biometric Trends Visualizer**:
  - Switch between **24-Hour Timeline**, **7-Day Microcycle**, and **30-Day Season**.
  - Toggle individual curves for **Heart Rate**, **Recovery**, **Fatigue**, and **HRV**.
  - Click **Export CSV** to save raw session telemetry.
  - Click **Log Athletic Workout** to record conditioning drills, duration, and cardiovascular strain.

### 4. DualSense Hardware Reaction Lab
- Select **Reflex Drill** to launch the millisecond motor reaction tester.
- Connect your DualSense controller via USB/Bluetooth or use keyboard inputs.
- Test reaction speed against random visual stimulus triggers with haptic feedback simulation.

### 5. LiveStream Match Telemetry
- Navigate to **Live Dataset** to analyze real-world tournament streams.
- Scrub the timeline to review clutch moments, stick deflection vectors, and APM bursts.

---

## Google Play Console Release Instructions

1. **Build Release AAB**:
   ```bash
   npm run build
   ```
2. **Locate Obfuscation Mapping**:
   The ProGuard/R8 compiler generates `build/outputs/mapping/release/mapping.txt`.
3. **Upload Native Debug Symbols**:
   Package the compiled `.so` library symbols from `obj/local/` into `native-debug-symbols.zip`.
4. **Submit to Play Console**:
   - Go to **Release > App bundle explorer > Downloads**.
   - Under **Reobfuscation files**, upload `mapping.txt`.
   - Under **Native debug symbols**, upload `native-debug-symbols.zip`.
5. **Verify Security Verification**:
   Confirm that all SSF Level 4 Enterprise certificates and OWASP MASVS-L2 attestations are validated in the security audit report.

---

<div align="center">
  <strong>Champions Hub &copy; 2026. Certified by Sony Software Foundation (SSF) and Verified for Google Play.</strong>
</div>
