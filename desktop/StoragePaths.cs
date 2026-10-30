using System;
using System.IO;

internal sealed class StoragePaths {
    internal string DataRoot { get; private set; }
    internal string Profile { get; private set; }
    internal bool Recovered { get; private set; }
    internal bool LegacySkipped { get; private set; }
    private readonly bool custom;
    private readonly string defaultRoot;
    internal static string DefaultRoot { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "V5 Atlas"); } }

    internal StoragePaths(string customProfile) : this(customProfile, DefaultRoot) { }
    internal StoragePaths(string customProfile, string userRoot) {
        custom = customProfile != null;
        defaultRoot = userRoot;
        Profile = custom ? Path.GetFullPath(customProfile) : Path.Combine(defaultRoot, "profile");
        DataRoot = custom ? Path.Combine(Profile, "atlas-data") : defaultRoot;
    }

    internal void Prepare() {
        try {
            CheckWritable(DataRoot);
            CheckWritable(Profile);
            string webview = Path.Combine(Profile, "EBWebView");
            if (Directory.Exists(webview)) {
                CheckWritable(webview);
                string preferences = Path.Combine(webview, "Default");
                if (Directory.Exists(preferences)) CheckWritable(preferences);
            }
        } catch (UnauthorizedAccessException) { Recover(); }
          catch (System.Security.SecurityException) { Recover(); }
          catch (IOException) { Recover(); }
    }

    internal void Recover() {
        // Never change ACLs or delete data created by an elevated/older process.
        if (custom || Recovered) throw new IOException("无法访问用户数据目录 / Cannot access the user data folder: " + DataRoot);
        string recovery = defaultRoot + " User";
        CheckWritable(recovery);
        CheckWritable(Path.Combine(recovery, "profile"));
        DataRoot = recovery;
        Profile = Path.Combine(recovery, "profile");
        Recovered = true;
    }

    private static void CheckWritable(string path) {
        Directory.CreateDirectory(path);
        using (var probe = new FileStream(Path.Combine(path, ".access-" + Guid.NewGuid().ToString("N")),
            FileMode.CreateNew, FileAccess.ReadWrite, FileShare.None, 1, FileOptions.DeleteOnClose)) { probe.WriteByte(0); }
    }

    internal void MigrateLegacy(string applicationDirectory) {
        string legacy = Path.Combine(applicationDirectory, ".v5-atlas");
        // Copy only user data. Bundles are rebuilt and pending installers belong to the old location.
        foreach (string name in new[] { "profile", "documents" }) {
            string source = Path.Combine(legacy, name), target = Path.Combine(DataRoot, name);
            string staging = Path.Combine(DataRoot, "migration-" + Guid.NewGuid().ToString("N"));
            try {
                if (!Directory.Exists(source) || Directory.Exists(target)) continue;
                Directory.CreateDirectory(DataRoot);
                CopyDirectory(source, staging);
                Directory.Move(staging, target);
            } catch (UnauthorizedAccessException) {
                LegacySkipped = true;
            } catch (System.Security.SecurityException) {
                LegacySkipped = true;
            } catch (IOException) {
                LegacySkipped = true;
            } finally {
                try { if (Directory.Exists(staging)) Directory.Delete(staging, true); }
                catch (UnauthorizedAccessException) { }
                catch (IOException) { }
            }
        }
    }

    private static void CopyDirectory(string source, string target) {
        if ((File.GetAttributes(source) & FileAttributes.ReparsePoint) != 0) throw new IOException("Cannot migrate linked user data.");
        Directory.CreateDirectory(target);
        foreach (string file in Directory.GetFiles(source)) {
            if ((File.GetAttributes(file) & FileAttributes.ReparsePoint) != 0) continue;
            File.Copy(file, Path.Combine(target, Path.GetFileName(file)));
        }
        foreach (string directory in Directory.GetDirectories(source)) CopyDirectory(directory, Path.Combine(target, Path.GetFileName(directory)));
    }
}
