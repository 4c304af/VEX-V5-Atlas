import Foundation
import CryptoKit

enum AtlasError: Error {
    case invalid(String)
    var code: String { switch self { case .invalid(let code): return code } }
}

func matches(_ value: String, _ pattern: String) -> Bool {
    value.range(of: pattern, options: .regularExpression) != nil
}
func sha256(_ data: Data) -> String { SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined() }
func json(_ data: Data) throws -> [String: Any] {
    guard let value = try JSONSerialization.jsonObject(with: data) as? [String: Any] else { throw AtlasError.invalid("invalid-content") }
    return value
}
func readJSON(_ url: URL) throws -> [String: Any] { try json(Data(contentsOf: url)) }
func writeJSON(_ value: Any, _ url: URL) throws {
    try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
    try JSONSerialization.data(withJSONObject: value, options: [.sortedKeys, .fragmentsAllowed]).write(to: url, options: .atomic)
}
func version(_ text: String) throws -> [Int] {
    guard matches(text, "^v?[0-9]+\\.[0-9]+\\.[0-9]+$") else { throw AtlasError.invalid("invalid-version") }
    return try text.replacingOccurrences(of: "v", with: "").split(separator: ".").map {
        guard let part = Int($0) else { throw AtlasError.invalid("invalid-version") }; return part
    }
}
func newer(_ left: String, than right: String) throws -> Bool {
    let a = try version(left), b = try version(right)
    return b.lexicographicallyPrecedes(a)
}
func officialSource(_ url: URL) -> Bool {
    url.scheme == "https" && url.user == nil && url.password == nil &&
        (url.port == nil || url.port == 443) && ((url.host == "api.vex.com" && url.path.hasPrefix("/v5/")) ||
        (url.host == "content.vexrobotics.com" && url.path == "/docs/2026-2027/override/files/Override-2.1.pdf"))
}

// The WebView never accesses the network. These bounded requests are used only by the update bridge.
final class LimitedDownload: NSObject, URLSessionDataDelegate {
    enum Policy { case official, release }
    static let repository = "4c304af/VEX-V5-Atlas"
    let policy: Policy, limit: Int
    private let lock = NSLock()
    private var cancelled = false
    private var task: URLSessionDataTask?
    private var session: URLSession?
    private var continuation: CheckedContinuation<Data, Error>?
    private var bytes = Data()
    private var failure: Error?
    private var redirects = 0

    init(policy: Policy, limit: Int) { self.policy = policy; self.limit = limit }
    func allowed(_ url: URL, redirected: Bool) -> Bool {
        guard url.scheme == "https", url.user == nil, url.password == nil, url.port == nil || url.port == 443 else { return false }
        if policy == .official {
            return url.host == "api.vex.com" && (url.path == "/v5/searchindex.js" ||
                url.path.hasPrefix("/v5/_sources/home/cpp/") && url.path.hasSuffix(".md.txt"))
        }
        if url.host == "api.github.com" { return url.path.hasPrefix("/repos/\(Self.repository)/releases/") }
        if url.host == "github.com" { return url.path.hasPrefix("/\(Self.repository)/releases/download/") }
        return redirected && ["release-assets.githubusercontent.com", "objects.githubusercontent.com"].contains(url.host ?? "")
    }
    func fetch(_ url: URL) async throws -> Data {
        guard allowed(url, redirected: false) else { throw AtlasError.invalid("untrusted-download") }
        return try await withTaskCancellationHandler(operation: {
            try await withCheckedThrowingContinuation { continuation in
                let config = URLSessionConfiguration.ephemeral
                config.timeoutIntervalForRequest = 25; config.timeoutIntervalForResource = 180
                let queue = OperationQueue(); queue.maxConcurrentOperationCount = 1
                let session = URLSession(configuration: config, delegate: self, delegateQueue: queue)
                var request = URLRequest(url: url)
                request.setValue("V5Atlas/macOS", forHTTPHeaderField: "User-Agent")
                request.setValue("no-cache", forHTTPHeaderField: "Cache-Control")
                let task = session.dataTask(with: request)
                lock.lock()
                self.continuation = continuation; self.session = session; self.task = task
                let stop = cancelled
                lock.unlock()
                task.resume(); if stop { task.cancel() }
            }
        }, onCancel: {
            self.lock.lock(); self.cancelled = true; let task = self.task; self.lock.unlock(); task?.cancel()
        })
    }
    func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse,
                    newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void) {
        redirects += 1
        guard redirects <= 4, let url = request.url, allowed(url, redirected: true) else {
            failure = AtlasError.invalid("redirect-blocked"); completionHandler(nil); return
        }
        completionHandler(request)
    }
    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive response: URLResponse,
                    completionHandler: @escaping (URLSession.ResponseDisposition) -> Void) {
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            failure = failure ?? AtlasError.invalid("http-\((response as? HTTPURLResponse)?.statusCode ?? 0)")
            completionHandler(.cancel); return
        }
        guard response.expectedContentLength <= limit else {
            failure = AtlasError.invalid("package-too-large"); completionHandler(.cancel); return
        }
        completionHandler(.allow)
    }
    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        guard bytes.count + data.count <= limit else { failure = AtlasError.invalid("package-too-large"); dataTask.cancel(); return }
        bytes.append(data)
    }
    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        lock.lock(); let continuation = self.continuation; self.continuation = nil; let stopped = cancelled; lock.unlock()
        if stopped { continuation?.resume(throwing: CancellationError()) }
        else if let error = failure ?? error { continuation?.resume(throwing: error) }
        else { continuation?.resume(returning: bytes) }
        session.finishTasksAndInvalidate(); self.session = nil
    }
}

// unzip writes only to stdout. Validated names and sizes are copied into an owned staging directory.
// Archive paths and symlinks are never extracted by a command-line tool.
func unzip(_ archive: URL, _ name: String?, limit: Int) throws -> Data {
    try Task.checkCancellation()
    let process = Process(), output = Pipe()
    process.executableURL = URL(fileURLWithPath: "/usr/bin/unzip")
    process.arguments = name.map { ["-p", archive.path, $0] } ?? ["-Z", "-1", archive.path]
    process.standardOutput = output; process.standardError = FileHandle.nullDevice
    try process.run()
    defer { if process.isRunning { process.terminate() }; output.fileHandleForReading.closeFile() }
    var data = Data()
    while true {
        try Task.checkCancellation()
        let chunk = output.fileHandleForReading.readData(ofLength: 65536)
        if chunk.isEmpty { break }
        guard data.count + chunk.count <= limit else { throw AtlasError.invalid("package-too-large") }
        data.append(chunk)
    }
    process.waitUntilExit()
    guard process.terminationStatus == 0 else { throw AtlasError.invalid("invalid-archive") }; return data
}

final class LibraryStore {
    let root: URL, bundled: URL, appVersion: String
    private let lock = NSLock()
    private var selected: URL
    var active: URL { lock.lock(); defer { lock.unlock() }; return selected }
    init(data: URL, bundled: URL, version: String) {
        root = data.appendingPathComponent("documents"); self.bundled = bundled; appVersion = version; selected = bundled
        for name in ["active.json", "active.previous.json"] {
            do {
                let pointer = try json(Data(contentsOf: root.appendingPathComponent(name)))
                guard let id = pointer["snapshotId"] as? String, matches(id, "^[a-f0-9]{64}$") else { continue }
                let candidate = root.appendingPathComponent("datasets/\(id)")
                let manifest = try readJSON(candidate.appendingPathComponent("package-manifest.json"))
                guard FileManager.default.fileExists(atPath: candidate.appendingPathComponent(".complete").path),
                      manifest["snapshotId"] as? String == id,
                      let minimum = manifest["minimumAppVersion"] as? String,
                      !(try newer(minimum, than: version)),
                      let date = manifest["snapshotDate"] as? String,
                      let builtDate = try readJSON(bundled.appendingPathComponent("update-manifest.json"))["snapshotDate"] as? String,
                      date >= builtDate else { continue }
                try validate(candidate, manifest); selected = candidate; break
            } catch { continue }
        }
    }
    static func safeName(_ name: String) -> Bool {
        matches(name, "^[A-Za-z0-9_][A-Za-z0-9_-]*\\.json$") || matches(name, "^media/[A-Za-z0-9_-]+\\.(png|jpg|jpeg|gif|webp|svg)$")
    }
    func snapshot() throws -> String {
        guard let id = try readJSON(active.appendingPathComponent("catalog.json"))["snapshotId"] as? String else { throw AtlasError.invalid("invalid-snapshot") }; return id
    }
    private func validate(_ path: URL, _ manifest: [String: Any]) throws {
        guard manifest["format"] as? Int == 1, let id = manifest["snapshotId"] as? String, matches(id, "^[a-f0-9]{64}$"),
              let count = manifest["documentCount"] as? Int, (1...2000).contains(count),
              let files = manifest["files"] as? [[String: Any]], files.count <= 6000 else { throw AtlasError.invalid("invalid-package") }
        var names = Set<String>(), total = 0
        for file in files {
            try Task.checkCancellation()
            guard let name = file["name"] as? String, Self.safeName(name), names.insert(name.lowercased()).inserted,
                  let size = file["size"] as? Int, (0...16*1024*1024).contains(size),
                  let hash = file["sha256"] as? String, matches(hash, "^[a-f0-9]{64}$") else { throw AtlasError.invalid("invalid-file") }
            total += size; guard total <= 128*1024*1024 else { throw AtlasError.invalid("package-too-large") }
            let data = try Data(contentsOf: path.appendingPathComponent(name))
            guard data.count == size, sha256(data) == hash else { throw AtlasError.invalid("checksum-mismatch") }
        }
        guard names.contains("catalog.json"), names.contains("update-manifest.json") else { throw AtlasError.invalid("incomplete-package") }
        let catalog = try readJSON(path.appendingPathComponent("catalog.json")), baseline = try readJSON(path.appendingPathComponent("update-manifest.json"))
        guard catalog["snapshotId"] as? String == id, baseline["snapshotId"] as? String == id,
              let date = manifest["snapshotDate"] as? String, matches(date, "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"),
              baseline["snapshotDate"] as? String == date,
              let entries = catalog["documents"] as? [[String: Any]], entries.count == count,
              let originals = baseline["documents"] as? [[String: Any]], originals.count == count else { throw AtlasError.invalid("incomplete-library") }
        var ids = Set<String>(), keys = Set<String>()
        for entry in entries {
            guard let pageID = entry["id"] as? String, matches(pageID, "^[A-Za-z0-9_-]+(/[A-Za-z0-9_-]+)*$"), ids.insert(pageID).inserted,
                  let key = entry["key"] as? String, keys.insert(key.lowercased()).inserted, names.contains((key + ".json").lowercased()),
                  !(entry["title"] as? String ?? "").isEmpty, !(entry["zhTitle"] as? String ?? "").isEmpty else { throw AtlasError.invalid("invalid-catalog") }
            let page = try readJSON(path.appendingPathComponent(key + ".json"))
            guard page["id"] as? String == pageID, !(page["en"] as? String ?? "").isEmpty,
                  !(page["zh"] as? String ?? "").isEmpty else { throw AtlasError.invalid("incomplete-translation") }
        }
    }
    func install(_ data: Data) throws -> Bool {
        let fm = FileManager.default, staging = root.appendingPathComponent("staging-" + UUID().uuidString)
        try fm.createDirectory(at: staging, withIntermediateDirectories: true)
        defer { try? fm.removeItem(at: staging) }
        let archive = staging.appendingPathComponent("download.zip")
        try data.write(to: archive)
        guard let listing = String(data: try unzip(archive, nil, limit: 1024*1024), encoding: .utf8) else { throw AtlasError.invalid("invalid-archive") }
        let names = listing.split(separator: "\n").map(String.init)
        guard names.count <= 6001, Set(names.map { $0.lowercased() }).count == names.count,
              names.contains("package-manifest.json"), names.allSatisfy({ $0 == "package-manifest.json" || Self.safeName($0) }) else { throw AtlasError.invalid("invalid-archive") }
        let manifestData = try unzip(archive, "package-manifest.json", limit: 2*1024*1024), manifest = try json(manifestData)
        guard let minimum = manifest["minimumAppVersion"] as? String else { throw AtlasError.invalid("invalid-package") }
        guard !(try newer(minimum, than: appVersion)) else { throw AtlasError.invalid("app-update-required") }
        guard let files = manifest["files"] as? [[String: Any]], files.count + 1 == names.count else { throw AtlasError.invalid("unexpected-files") }
        var total = 0
        for file in files {
            guard let name = file["name"] as? String, Self.safeName(name), names.contains(name),
                  let size = file["size"] as? Int, (0...16*1024*1024).contains(size) else { throw AtlasError.invalid("invalid-file") }
            total += size; guard total <= 128*1024*1024 else { throw AtlasError.invalid("package-too-large") }
            let bytes = try unzip(archive, name, limit: size)
            let target = staging.appendingPathComponent(name)
            try fm.createDirectory(at: target.deletingLastPathComponent(), withIntermediateDirectories: true)
            try bytes.write(to: target)
        }
        try manifestData.write(to: staging.appendingPathComponent("package-manifest.json"))
        try validate(staging, manifest)
        let id = manifest["snapshotId"] as! String
        if id == (try snapshot()) { return false }
        let old = try readJSON(active.appendingPathComponent("update-manifest.json"))
        guard let date = manifest["snapshotDate"] as? String, date >= (old["snapshotDate"] as? String ?? "") else { throw AtlasError.invalid("older-snapshot") }
        try Task.checkCancellation()
        try fm.removeItem(at: archive)
        try Data(id.utf8).write(to: staging.appendingPathComponent(".complete"))
        let destination = root.appendingPathComponent("datasets/" + id)
        try fm.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)
        if fm.fileExists(atPath: destination.path) { try validate(destination, manifest) }
        else { try fm.moveItem(at: staging, to: destination) }
        let pointer = root.appendingPathComponent("active.json")
        if let previous = try? Data(contentsOf: pointer) { try previous.write(to: root.appendingPathComponent("active.previous.json"), options: .atomic) }
        try writeJSON(["snapshotId": id], pointer)
        lock.lock(); selected = destination; lock.unlock()
        return true
    }
}

final class MacUpdates {
    typealias Fetch = (URL, LimitedDownload.Policy, Int) async throws -> Data
    let store: LibraryStore
    let appVersion: String
    let fetch: Fetch
    init(store: LibraryStore, version: String, fetch: @escaping Fetch = { url, policy, limit in
        try await LimitedDownload(policy: policy, limit: limit).fetch(url)
    }) { self.store = store; appVersion = version; self.fetch = fetch }
    func release(_ endpoint: String) async throws -> [String: Any] {
        let url = URL(string: "https://api.github.com/repos/\(LimitedDownload.repository)/releases/\(endpoint)")!
        let value = try json(await fetch(url, .release, 2*1024*1024))
        guard value["draft"] as? Bool == false, value["assets"] is [[String: Any]] else { throw AtlasError.invalid("invalid-release") }; return value
    }
    func synchronize(documents: Bool, application: Bool, progress: @escaping (String) -> Void) async -> [String: Any] {
        var docs: [String: Any] = ["status": "skipped"], app: [String: Any] = ["status": "skipped"]
        if documents {
            do {
                progress("documents:check")
                let feed = try await release("tags/documentation-latest")
                guard feed["tag_name"] as? String == "documentation-latest",
                      let asset = (feed["assets"] as? [[String: Any]])?.first(where: { $0["name"] as? String == "V5-Atlas-documents.zip" }),
                      let digest = asset["digest"] as? String, matches(digest, "^sha256:[a-f0-9]{64}$"),
                      let size = asset["size"] as? Int, (1...48*1024*1024).contains(size),
                      let link = asset["browser_download_url"] as? String, let url = URL(string: link) else { throw AtlasError.invalid("missing-checksum") }
                let receipt = store.root.appendingPathComponent("receipt.json"), snapshot = try store.snapshot()
                let cached = try? readJSON(receipt)
                if cached?["digest"] as? String == digest && cached?["snapshotId"] as? String == snapshot { docs = ["status": "current"] }
                else {
                    progress("documents:download")
                    let bytes = try await fetch(url, .release, size)
                    guard bytes.count == size, "sha256:" + sha256(bytes) == digest else { throw AtlasError.invalid("checksum-mismatch") }
                    progress("documents:verify")
                    let changed = try store.install(bytes)
                    try writeJSON(["digest": digest, "snapshotId": try store.snapshot()], receipt)
                    docs = ["status": changed ? "updated" : "current"]
                }
            } catch { docs = ["status": Task.isCancelled ? "cancelled" : "error", "error": (error as? AtlasError)?.code ?? "network"] }
        }
        if application {
            do {
                try Task.checkCancellation(); progress("application:check")
                let latest = try await release("latest")
                guard latest["prerelease"] as? Bool == false, let tag = latest["tag_name"] as? String else { throw AtlasError.invalid("invalid-release") }
                let available = try newer(tag, than: appVersion)
                let assetName = "V5-Atlas-\(tag.replacingOccurrences(of: "v", with: ""))-macOS-universal.dmg"
                let hasMac = (latest["assets"] as? [[String: Any]])?.contains { $0["name"] as? String == assetName } == true
                app = ["status": available ? (hasMac ? "available" : "skipped") : "current", "version": tag]
            } catch { app = ["status": Task.isCancelled ? "cancelled" : "error", "error": (error as? AtlasError)?.code ?? "network"] }
        }
        return ["documents": docs, "application": app, "checkedAt": ISO8601DateFormatter().string(from: Date())]
    }
    func check(progress: @escaping ([String: Any]) -> Void) async -> [String: Any] {
        var result: [String: Any] = ["status": "error", "changes": [], "failures": [], "total": 0, "checkedCount": 0]
        do {
            let baseline = try readJSON(store.active.appendingPathComponent("update-manifest.json"))
            result["snapshotDate"] = baseline["snapshotDate"]; result["snapshotId"] = baseline["snapshotId"]
            guard baseline["schemaVersion"] as? Int == 1, let originals = baseline["documents"] as? [[String: Any]], !originals.isEmpty else { throw AtlasError.invalid("invalid-snapshot") }
            var previous: [String: [String: Any]] = [:]
            for item in originals {
                guard let id = item["id"] as? String, matches(id, "^[A-Za-z0-9_-]+(/[A-Za-z0-9_-]+)*$"),
                      let hash = item["sha256"] as? String, matches(hash, "^[a-f0-9]{64}$"), previous[id] == nil else { throw AtlasError.invalid("invalid-snapshot") }
                previous[id] = item
            }
            progress(["phase": "index", "completed": 0, "total": 0])
            let data = try await fetch(URL(string: "https://api.vex.com/v5/searchindex.js")!, .official, 8*1024*1024)
            guard var text = String(data: data, encoding: .utf8) else { throw AtlasError.invalid("invalid-index") }
            text = text.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines.union(CharacterSet(charactersIn: "\u{feff}")))
            guard let prefix = text.range(of: "^Search\\.setIndex\\s*\\(", options: .regularExpression),
                  let suffix = text.range(of: "\\)\\s*;?\\s*$", options: .regularExpression) else { throw AtlasError.invalid("invalid-index") }
            let index = try json(Data(text[prefix.upperBound..<suffix.lowerBound].utf8))
            guard let names = index["docnames"] as? [String], let titles = index["titles"] as? [String], names.count == titles.count else { throw AtlasError.invalid("invalid-index") }
            var remote: [(String, String)] = [], seen = Set<String>()
            for (name, title) in zip(names, titles) where name.hasPrefix("home/cpp/") {
                let id = String(name.dropFirst(9))
                guard matches(id, "^[A-Za-z0-9_-]+(/[A-Za-z0-9_-]+)*$"), !title.isEmpty, seen.insert(id).inserted else { throw AtlasError.invalid("invalid-index") }
                remote.append((id, title))
            }
            guard seen.contains("index"), remote.count <= 2000 else { throw AtlasError.invalid("invalid-index") }
            func change(_ id: String, _ title: String, _ kind: String) -> [String: Any] {
                ["id": id, "title": title, "zhTitle": previous[id]?["zhTitle"] as? String ?? "", "kind": kind, "source": "https://api.vex.com/v5/home/cpp/\(id).html"]
            }
            var changes = previous.keys.sorted().filter { !seen.contains($0) }.map { change($0, previous[$0]?["title"] as? String ?? $0, "removed") }
            var failures: [[String: Any]] = [], checked = 0, completed = 0
            result["total"] = remote.count
            // Four independent bounded requests at a time, with cancellation propagated to URLSession.
            for start in stride(from: 0, to: remote.count, by: 4) {
                try Task.checkCancellation()
                let batch = Array(remote[start..<min(start + 4, remote.count)])
                let outcomes = await withTaskGroup(of: (String, String, String?, String?).self, returning: [(String, String, String?, String?)].self) { group in
                    for (id, title) in batch {
                        group.addTask {
                            do {
                                let bytes = try await self.fetch(URL(string: "https://api.vex.com/v5/_sources/home/cpp/\(id).md.txt")!, .official, 8*1024*1024)
                                guard var content = String(data: bytes, encoding: .utf8), matches(content, "(?m)^#\\s+\\S"), !content.trimmingCharacters(in: .whitespacesAndNewlines).hasPrefix("<") else { throw AtlasError.invalid("invalid-content") }
                                if content.hasPrefix("\u{feff}") { content.removeFirst() }
                                content = content.replacingOccurrences(of: "\r\n", with: "\n").replacingOccurrences(of: "\r", with: "\n")
                                return (id, title, sha256(Data(content.utf8)), nil)
                            } catch { return (id, title, nil, (error as? AtlasError)?.code ?? "network") }
                        }
                    }
                    var values: [(String, String, String?, String?)] = []
                    for await value in group { values.append(value) }; return values
                }
                for (id, title, hash, error) in outcomes {
                    if previous[id] == nil { changes.append(change(id, title, "added")) }
                    if let error = error { failures.append(["id": id, "title": title, "code": error]) }
                    else {
                        checked += 1
                        if let old = previous[id], old["sha256"] as? String != hash || old["title"] as? String != title { changes.append(change(id, title, "modified")) }
                    }
                    completed += 1; progress(["phase": "documents", "completed": completed, "total": remote.count])
                }
            }
            try Task.checkCancellation()
            result["status"] = !failures.isEmpty ? "partial" : changes.isEmpty ? "current" : "updates"
            result["changes"] = changes.sorted { ($0["id"] as? String ?? "") < ($1["id"] as? String ?? "") }
            result["failures"] = failures; result["checkedCount"] = checked
        } catch { result["status"] = Task.isCancelled ? "cancelled" : "error"; result["errorCode"] = (error as? AtlasError)?.code ?? "network" }
        result["checkedAt"] = ISO8601DateFormatter().string(from: Date()); return result
    }
}
