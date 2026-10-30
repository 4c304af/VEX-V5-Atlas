using System;
using System.IO;
using System.Security.AccessControl;
using System.Security.Principal;

internal static class StorageTests {
    private static void Assert(bool value, string message) { if (!value) throw new Exception(message); }
    private static void Main(string[] args) {
        string root = args[0], app = Path.Combine(root, "application"), legacy = Path.Combine(app, ".v5-atlas");
        Directory.CreateDirectory(Path.Combine(legacy, "profile", "storage"));
        File.WriteAllText(Path.Combine(legacy, "profile", "storage", "preferences"), "bookmarks-and-colors");
        Directory.CreateDirectory(Path.Combine(legacy, "documents"));
        File.WriteAllText(Path.Combine(legacy, "documents", "active.json"), "snapshot");
        var standard = new StoragePaths(null);
        Assert(standard.DataRoot == Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "V5 Atlas"), "Default data is not in LocalAppData");
        Assert(standard.Profile == Path.Combine(standard.DataRoot, "profile"), "Profile escaped user data");
        string profile = Path.Combine(root, "custom-profile");
        var isolated = new StoragePaths(profile);
        Assert(isolated.Profile == profile && isolated.DataRoot == Path.Combine(profile, "atlas-data"), "Custom profile is not isolated");
        isolated.MigrateLegacy(app);
        string migrated = Path.Combine(isolated.DataRoot, "profile", "storage", "preferences");
        Assert(File.ReadAllText(migrated) == "bookmarks-and-colors", "Preferences were not migrated");
        Assert(File.ReadAllText(Path.Combine(isolated.DataRoot, "documents", "active.json")) == "snapshot", "Documents were not migrated");
        File.WriteAllText(migrated, "new-settings");
        isolated.MigrateLegacy(app);
        Assert(File.ReadAllText(migrated) == "new-settings", "Migration overwrote newer preferences");
        Assert(File.ReadAllText(Path.Combine(legacy, "profile", "storage", "preferences")) == "bookmarks-and-colors", "Legacy data changed");
        Assert(Directory.GetDirectories(app).Length == 1 && Directory.GetFiles(app).Length == 0, "Migration wrote beside the executable");
        Assert(Directory.GetDirectories(isolated.DataRoot, "migration-*").Length == 0, "Migration leaked staging data");
        // Use real Windows ACLs to reproduce directories that a standard token cannot access.
        var sid = WindowsIdentity.GetCurrent().User;
        string denied = Path.Combine(root, "denied-user-data");
        Directory.CreateDirectory(denied);
        DirectorySecurity original = Directory.GetAccessControl(denied);
        var restricted = Directory.GetAccessControl(denied);
        restricted.AddAccessRule(new FileSystemAccessRule(sid, FileSystemRights.Write, AccessControlType.Deny));
        try {
            Directory.SetAccessControl(denied, restricted);
            bool blocked = false;
            try { File.WriteAllText(Path.Combine(denied, "probe"), "x"); } catch (UnauthorizedAccessException) { blocked = true; }
            Assert(blocked, "ACL fixture did not deny writes");
            var recovery = new StoragePaths(null, denied);
            recovery.Prepare();
            Assert(recovery.Recovered && recovery.DataRoot == denied + " User", "Inaccessible user data prevented recovery");
            Assert(Directory.Exists(recovery.Profile), "Recovery profile was not created");
        } finally { Directory.SetAccessControl(denied, original); }

        string deniedLegacy = Path.Combine(legacy, "profile");
        original = Directory.GetAccessControl(deniedLegacy);
        restricted = Directory.GetAccessControl(deniedLegacy);
        restricted.AddAccessRule(new FileSystemAccessRule(sid, FileSystemRights.ReadData, AccessControlType.Deny));
        try {
            Directory.SetAccessControl(deniedLegacy, restricted);
            var fresh = new StoragePaths(Path.Combine(root, "fresh-profile"));
            fresh.MigrateLegacy(app);
            fresh.Prepare();
            Assert(fresh.LegacySkipped, "Unreadable migration was not reported");
            Assert(!Directory.Exists(Path.Combine(fresh.DataRoot, "profile")), "Partial migration was activated");
            Assert(File.Exists(Path.Combine(fresh.DataRoot, "documents", "active.json")), "Other readable legacy data was skipped");
        } finally { Directory.SetAccessControl(deniedLegacy, original); }
        Assert(File.ReadAllText(Path.Combine(legacy, "profile", "storage", "preferences")) == "bookmarks-and-colors", "Recovery changed legacy data");
        Console.WriteLine("PASS user-data isolation, migration, real ACL-denied migration and writable storage recovery without changing old data");
    }
}
