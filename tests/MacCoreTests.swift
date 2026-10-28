import Foundation

func require(_ condition: Bool, _ message: String) throws {
    if !condition { throw AtlasError.invalid("TEST: " + message) }
}

@main enum MacCoreTests {
    static func main() async throws {
        let args = CommandLine.arguments, root = URL(fileURLWithPath: args[1]), bundled = URL(fileURLWithPath: args[2])
        let fixtures = URL(fileURLWithPath: args[3]), store = LibraryStore(data: root, bundled: bundled, version: "1.1.0")
        let official = LimitedDownload(policy: .official, limit: 1), release = LimitedDownload(policy: .release, limit: 1)
        try require(official.allowed(URL(string: "https://api.vex.com/v5/searchindex.js")!, redirected: false), "Official index rejected")
        for url in ["http://api.vex.com/v5/searchindex.js", "https://api.vex.com.evil.test/v5/searchindex.js", "https://api.vex.com:444/v5/searchindex.js", "https://user@api.vex.com/v5/searchindex.js", "https://api.vex.com/v5/home/cpp/index.html"] {
            try require(!official.allowed(URL(string: url)!, redirected: false), "Untrusted official URL accepted")
        }
        try require(release.allowed(URL(string: "https://github.com/4c304af/VEX-V5-Atlas/releases/download/v1.1.0/docs.zip")!, redirected: false), "Release asset rejected")
        let cdn = URL(string: "https://release-assets.githubusercontent.com/asset")!
        try require(!release.allowed(cdn, redirected: false) && release.allowed(cdn, redirected: true), "CDN boundary incorrect")
        try require(!release.allowed(URL(string: "https://github.com/someone/another/releases/download/a/b")!, redirected: true), "Other repository accepted")
        for name in ["../escape.json", "/escape.json", "media/../../escape.svg", "a.js", "-option.json", "a\\b.json"] {
            try require(!LibraryStore.safeName(name), "Unsafe archive member accepted: " + name)
        }
        let original = try store.snapshot()
        for kind in ["traversal", "hash", "missing", "future", "older", "duplicate", "empty-translation"] {
            var rejected = false
            do { _ = try store.install(Data(contentsOf: fixtures.appendingPathComponent(kind + ".zip"))) }
            catch { rejected = true }
            try require(rejected, "Invalid package installed: " + kind)
            try require(try store.snapshot() == original, "Failed update changed the selected corpus")
        }
        let added = try Data(contentsOf: fixtures.appendingPathComponent("added.zip"))
        try require(try store.install(added), "New page did not install")
        let addedID = try store.snapshot()
        try require(addedID != original, "Snapshot did not change")
        try require(!(try store.install(added)), "Identical update installed twice")
        let restarted = LibraryStore(data: root, bundled: bundled, version: "1.1.0")
        try require(try restarted.snapshot() == addedID, "Active corpus was lost after restart")
        try require(try restarted.install(Data(contentsOf: fixtures.appendingPathComponent("modified.zip"))), "Second update failed")
        try Data("corrupt".utf8).write(to: restarted.active.appendingPathComponent("catalog.json"))
        let recovered = LibraryStore(data: root, bundled: bundled, version: "1.1.0")
        try require(try recovered.snapshot() == addedID, "Previous corpus was not recovered")

        let baseline = try readJSON(bundled.appendingPathComponent("update-manifest.json"))
        let documents = baseline["documents"] as! [[String: Any]]
        let first = documents.first { $0["id"] as? String == "index" }!
        let update = MacUpdates(store: LibraryStore(data: root.appendingPathComponent("checker"), bundled: bundled, version: "1.1.0"), version: "1.1.0", fetch: { url, _, _ in
            if url.path.hasSuffix("searchindex.js") {
                let index: [String: Any] = ["docnames": ["home/cpp/index", "home/cpp/Added_Page"], "titles": [first["title"] as! String, "Added Page"]]
                return Data("Search.setIndex(\(String(data: try JSONSerialization.data(withJSONObject: index), encoding: .utf8)!));".utf8)
            }
            return Data("# Changed reference\r\n\r\ncontent\r\n".utf8)
        })
        let checked = await update.check { _ in }
        try require(checked["status"] as? String == "updates", "Official comparison did not finish")
        let changes = checked["changes"] as? [[String: Any]] ?? []
        try require(changes.contains { $0["id"] as? String == "index" && $0["kind"] as? String == "modified" }, "Modified page missing")
        try require(changes.contains { $0["id"] as? String == "Added_Page" && $0["kind"] as? String == "added" }, "Added page missing")
        try require(changes.contains { $0["kind"] as? String == "removed" }, "Removed pages missing")
        let staging = try FileManager.default.contentsOfDirectory(atPath: store.root.path).filter { $0.hasPrefix("staging-") }
        try require(staging.isEmpty, "Staging files leaked")
        print("PASS macOS update boundaries, invalid packages, hashes, traversal, translations, new pages, repeat install, restart, recovery, and official change detection")
    }
}
