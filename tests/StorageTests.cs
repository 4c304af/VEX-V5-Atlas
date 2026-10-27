using System;
using System.IO;

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
        Console.WriteLine("PASS user-data paths, custom isolation, preference/document migration, repeat migration, and unchanged application directory");
    }
}
