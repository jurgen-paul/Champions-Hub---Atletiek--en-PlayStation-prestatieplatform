# ------------------------------------------------------------------------------------------------
# CHAMPIONS HUB - ATHLETIC & PLAYSTATION PERFORMANCE PLATFORM
# Production ProGuard / R8 Obfuscation & Security Rules
# Sony Software Foundation (SSF) Compliant - Level 4 Enterprise
# Google Play Store & PlayStation Partner Release Configuration
# ------------------------------------------------------------------------------------------------

# --------------------------------------------------
# General Optimization & Shrinking Settings
# --------------------------------------------------
-repackageclasses 'com.championshub.internal'
-allowaccessmodification
-mergeinterfacesaggressively
-overloadaggressively
-repackageclasses
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose

# --------------------------------------------------
# Symbolication & Crash Reporting (Google Play Console)
# Critical for Play Store Crash Reporting & De-obfuscation
# --------------------------------------------------
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,Exceptions
-printmapping build/outputs/mapping/release/mapping.txt
-printseeds build/outputs/mapping/release/seeds.txt
-printusage build/outputs/mapping/release/usage.txt

# --------------------------------------------------
# PlayStation DualSense & Edge Controller Telemetry SDK
# Preserve native JNI bridges, HID packets, and BLE handlers
# --------------------------------------------------
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

# --------------------------------------------------
# Sony Software Foundation (SSF) Security Framework
# Preserve encryption, token storage, and WebAPI bridges
# --------------------------------------------------
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

# Preserve Hardware Keystore and biometric attestation
-keep class androidx.biometric.** { *; }
-keep class androidx.security.crypto.** { *; }
-keep interface androidx.biometric.** { *; }

# --------------------------------------------------
# Live Stream Game Telemetry Dataset & Serialization
# Preserve Gson / Moshi / Kotlinx serialization data models
# --------------------------------------------------
-keepattributes EnclosingMethod
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Telemetry data models
-keep class com.championshub.livestream.dataset.** {
    public <fields>;
    public <methods>;
}

-keep class com.championshub.models.telemetry.** {
    public <fields>;
    public <methods>;
}

# Google Play Integrity API
-keep class com.google.android.play.core.integrity.** { *; }

# OkHttp & WebSocket streaming client for live matches
-dontwarn okhttp3.**
-dontwarn okio.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
-keepclassmembers class * extends okhttp3.WebSocketListener {
    public void on*(...);
}

# --------------------------------------------------
# Remove Debug & Verbose Logging in Release Builds
# --------------------------------------------------
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
}

-assumenosideeffects class com.championshub.util.Logger {
    public static void d(...);
    public static void v(...);
}
