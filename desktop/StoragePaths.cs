using System;
using System.IO;

internal sealed class StoragePaths {
    internal readonly string DataRoot, Profile;
    internal static string DefaultRoot { get { return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "V5 Atlas"); } }

    internal StoragePaths(string customProfile) {
        Profile = customProfile == null ? Path.Combine(DefaultRoot, "profile") : Path.GetFullPath(customProfile);
        DataRoot = customProfile == null ? DefaultRoot : Path.Combine(Profile, "atlas-data");
    }

    internal void MigrateLegacy(string applicationDirectory) {
        string legacy = Path.Combine(applicationDirectory, ".v5-atlas");
        // Copy only user data. Bundles are rebuilt and pending installers belong to the old location.
        foreach (string name in new[] { "profile", "documents" }) {
            string source = Path.Combine(legacy, name), target = Path.Combine(DataRoot, name);
            if (!Directory.Exists(source) || Directory.Exists(target)) continue;
            Directory.CreateDirectory(DataRoot);
            string staging = Path.Combine(DataRoot, "migration-" + Guid.NewGuid().ToString("N"));
            try {
                CopyDirectory(source, staging);
                Directory.Move(staging, target);
            } finally {
                if (Directory.Exists(staging)) Directory.Delete(staging, true);
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
