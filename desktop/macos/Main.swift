import AppKit
import WebKit

final class LocalResources: NSObject, WKURLSchemeHandler {
    let app: URL, store: LibraryStore
    init(app: URL, store: LibraryStore) { self.app = app; self.store = store }
    static func resolve(_ url: URL, within root: URL) -> URL? {
        guard url.scheme == "atlas", url.host == "app", url.user == nil, url.password == nil, url.port == nil else { return nil }
        let relative = url.path.hasPrefix("/docs/") ? String(url.path.dropFirst(6)) : String(url.path.dropFirst())
        let base = root.resolvingSymlinksInPath().standardizedFileURL
        let target = base.appendingPathComponent(relative.isEmpty ? "index.html" : relative).resolvingSymlinksInPath().standardizedFileURL
        guard target.path.hasPrefix(base.path + "/"), !url.path.contains("\\") else { return nil }; return target
    }
    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url,
              let target = Self.resolve(url, within: url.path.hasPrefix("/docs/") ? store.active : app),
              let data = try? Data(contentsOf: target) else { task.didFailWithError(URLError(.fileDoesNotExist)); return }
        let types = ["html": "text/html", "js": "text/javascript", "css": "text/css", "json": "application/json",
                     "svg": "image/svg+xml", "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
                     "gif": "image/gif", "webp": "image/webp", "woff2": "font/woff2", "txt": "text/plain"]
        let headers = ["Content-Type": types[target.pathExtension] ?? "application/octet-stream", "Cache-Control": "no-store",
                       "Access-Control-Allow-Origin": "*", "X-Content-Type-Options": "nosniff",
                       "Content-Security-Policy": "default-src 'none'; script-src 'self' atlas:; style-src 'self' atlas: 'unsafe-inline'; img-src 'self' atlas: data:; font-src 'self' atlas:; connect-src 'self' atlas:; base-uri 'none'; form-action 'none'; frame-src 'none'"]
        task.didReceive(HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: headers)!)
        task.didReceive(data); task.didFinish()
    }
    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}

final class AtlasApp: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandlerWithReply {
    var window: NSWindow!, webView: WKWebView!
    var store: LibraryStore!, updater: MacUpdates!
    var updateTask: Task<Void, Never>?
    var testOutput: URL?
    var testPhase = "first"
    var testStarted = false
    let appVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.1.1"

    func applicationDidFinishLaunching(_ notification: Notification) {
        do {
            let args = CommandLine.arguments
            if let index = args.firstIndex(of: "--smoke-test"), args.indices.contains(index + 1) { testOutput = URL(fileURLWithPath: args[index + 1]) }
            if let index = args.firstIndex(of: "--test-phase"), args.indices.contains(index + 1) { testPhase = args[index + 1] }
            let resources = Bundle.main.resourceURL!
            let data: URL
            if let custom = args.first(where: { $0.hasPrefix("--profile=") }) { data = URL(fileURLWithPath: String(custom.dropFirst(10))) }
            else { data = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true).appendingPathComponent("V5 Atlas") }
            store = LibraryStore(data: data, bundled: resources.appendingPathComponent("app/docs"), version: appVersion)
            updater = MacUpdates(store: store, version: appVersion)
            let config = WKWebViewConfiguration()
            config.setURLSchemeHandler(LocalResources(app: resources.appendingPathComponent("app"), store: store), forURLScheme: "atlas")
            config.preferences.javaScriptCanOpenWindowsAutomatically = false
            config.userContentController.addScriptMessageHandler(self, contentWorld: .page, name: "atlas")
            var bridge = try String(contentsOf: resources.appendingPathComponent("bridge.js"), encoding: .utf8)
            bridge = bridge.replacingOccurrences(of: "__AUTO_ENABLED__", with: testOutput == nil ? "true" : "false")
            if testOutput != nil && testPhase == "first" {
                bridge += "\ntry { localStorage.clear(); } catch {}"
            }
            config.userContentController.addUserScript(WKUserScript(source: bridge, injectionTime: .atDocumentStart, forMainFrameOnly: true))
            webView = WKWebView(frame: .zero, configuration: config)
            webView.navigationDelegate = self; webView.uiDelegate = self
            webView.allowsBackForwardNavigationGestures = true
            webView.underPageBackgroundColor = .windowBackgroundColor
            window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 1440, height: 920),
                              styleMask: [.titled, .closable, .miniaturizable, .resizable], backing: .buffered, defer: false)
            window.title = "V5 Atlas · VEX V5 C++ API"; window.minSize = NSSize(width: 920, height: 680)
            window.isReleasedWhenClosed = false; window.contentView = webView
            window.setFrameAutosaveName("V5Atlas.MainWindow")
            window.center(); createMenu(); window.makeKeyAndOrderFront(nil)
            NSApp.activate(ignoringOtherApps: true)
            webView.load(URLRequest(url: URL(string: "atlas://app/index.html")!))
            if testOutput != nil {
                DispatchQueue.main.asyncAfter(deadline: .now() + 90) { [weak self] in
                    self?.finishTest(["ok": false, "error": "Native WebKit smoke test timed out"])
                }
            }
        } catch { fail(error) }
    }
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }
    func applicationWillTerminate(_ notification: Notification) { updateTask?.cancel() }
    func createMenu() {
        let menu = NSMenu(), app = NSMenu(), edit = NSMenu(), view = NSMenu(), windowMenu = NSMenu()
        func section(_ title: String, _ submenu: NSMenu) { let item = NSMenuItem(title: title, action: nil, keyEquivalent: ""); item.submenu = submenu; menu.addItem(item) }
        section("V5 Atlas", app)
        app.addItem(withTitle: "About V5 Atlas", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
        app.addItem(.separator())
        let preferences = app.addItem(withTitle: "Settings…", action: #selector(settings), keyEquivalent: ","); preferences.target = self
        app.addItem(.separator())
        app.addItem(withTitle: "Hide V5 Atlas", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        app.addItem(withTitle: "Quit V5 Atlas", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        section("Edit", edit)
        for (title, action, key) in [("Undo", Selector(("undo:")), "z"), ("Redo", Selector(("redo:")), "Z"),
                                    ("Cut", #selector(NSText.cut(_:)), "x"), ("Copy", #selector(NSText.copy(_:)), "c"),
                                    ("Paste", #selector(NSText.paste(_:)), "v"), ("Select All", #selector(NSText.selectAll(_:)), "a")] {
            edit.addItem(withTitle: title, action: action, keyEquivalent: key)
        }
        section("View", view)
        let search = view.addItem(withTitle: "Search APIs", action: #selector(searchAPIs), keyEquivalent: "k"); search.target = self
        view.addItem(withTitle: "Enter Full Screen", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f").keyEquivalentModifierMask = [.command, .control]
        section("Window", windowMenu)
        windowMenu.addItem(withTitle: "Minimize", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(withTitle: "Zoom", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: "")
        NSApp.mainMenu = menu; NSApp.windowsMenu = windowMenu
    }
    @objc func settings() { webView.evaluateJavaScript("location.hash='#settings'") }
    @objc func searchAPIs() { webView.evaluateJavaScript("window.dispatchEvent(new KeyboardEvent('keydown',{key:'k',metaKey:true}))") }
    func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Source links are opened by the explicit bridge. Navigation cannot load remote or local-file pages.
        let url = action.request.url
        decisionHandler(url?.scheme == "atlas" && url?.host == "app" && action.targetFrame?.isMainFrame == true ? .allow : .cancel)
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard testOutput != nil, !testStarted else { return }; testStarted = true
        do {
            var script = try String(contentsOf: Bundle.main.resourceURL!.appendingPathComponent("smoke-test.js"), encoding: .utf8)
            script = script.replacingOccurrences(of: "__TEST_PHASE__", with: testPhase)
            webView.evaluateJavaScript(script) { _, error in if let error = error { self.finishTest(["ok": false, "error": error.localizedDescription]) } }
        } catch { fail(error) }
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { fail(error) }
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { webView.reload() }
    nonisolated func progress(_ request: String, _ value: Any) {
        DispatchQueue.main.async {
            guard let bytes = try? JSONSerialization.data(withJSONObject: ["requestId": request, "progress": value]),
                  let encoded = String(data: bytes, encoding: .utf8) else { return }
            self.webView.evaluateJavaScript("window.dispatchEvent(new CustomEvent('atlas:native-progress',{detail:\(encoded)}))")
        }
    }
    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage,
                               replyHandler reply: @escaping (Any?, String?) -> Void) {
        guard message.frameInfo.isMainFrame, message.frameInfo.request.url?.scheme == "atlas", message.frameInfo.request.url?.host == "app",
              let body = message.body as? [String: Any], let action = body["action"] as? String else { reply(nil, "Invalid bridge origin"); return }
        switch action {
        case "minimize": window.miniaturize(nil); reply(true, nil)
        case "maximize": window.zoom(nil); reply(true, nil)
        case "close": reply(true, nil); window.close()
        case "clipboard":
            guard let text = body["text"] as? String, text.utf8.count <= 2*1024*1024 else { reply(nil, "Invalid clipboard text"); return }
            NSPasteboard.general.clearContents(); reply(NSPasteboard.general.setString(text, forType: .string), nil)
        case "source":
            guard let text = body["url"] as? String, let url = URL(string: text), officialSource(url) else { reply(false, nil); return }
            reply(NSWorkspace.shared.open(url), nil)
        case "application:download":
            reply(NSWorkspace.shared.open(URL(string: "https://github.com/\(LimitedDownload.repository)/releases/latest")!), nil)
        case "docs:cancel": updateTask?.cancel(); reply(true, nil)
        case "docs:check", "auto:run":
            guard let id = body["requestId"] as? String, id.count <= 80 else { reply(nil, "Invalid request"); return }
            guard updateTask == nil else { reply(nil, "busy"); return }
            let updater = self.updater!
            updateTask = Task.detached {
                let result: [String: Any]
                if action == "docs:check" { result = await updater.check { self.progress(id, $0) } }
                else { result = await updater.synchronize(documents: body["documents"] as? Bool == true, application: body["application"] as? Bool == true) { self.progress(id, $0) } }
                await MainActor.run {
                    if (result["documents"] as? [String: Any])?["status"] as? String == "updated" {
                        self.webView.evaluateJavaScript("window.dispatchEvent(new Event('atlas:library-updated'))")
                    }
                    self.updateTask = nil; reply(result, nil)
                }
            }
        case "test:clipboard" where testOutput != nil: reply(NSPasteboard.general.string(forType: .string) ?? "", nil)
        case "test:complete" where testOutput != nil:
            reply(true, nil)
            let result = body["result"] as? [String: Any] ?? ["ok": false]
            let output = testOutput!.deletingPathExtension().appendingPathExtension("png")
            webView.takeSnapshot(with: nil) { image, _ in
                if let tiff = image?.tiffRepresentation, let bitmap = NSBitmapImageRep(data: tiff),
                   let png = bitmap.representation(using: .png, properties: [:]) { try? png.write(to: output) }
                self.finishTest(result)
            }
        default: reply(nil, "Unsupported bridge action")
        }
    }
    func finishTest(_ result: [String: Any]) {
        guard let output = testOutput else { return }; testOutput = nil
        try? writeJSON(result, output); NSApp.terminate(nil)
    }
    func fail(_ error: Error) {
        if testOutput != nil { finishTest(["ok": false, "error": error.localizedDescription]); return }
        let alert = NSAlert(); alert.messageText = "V5 Atlas 无法启动 / Could not start V5 Atlas"
        alert.informativeText = error.localizedDescription; alert.runModal(); NSApp.terminate(nil)
    }
}

@main enum Main {
    static func main() {
        let app = NSApplication.shared, delegate = AtlasApp()
        app.setActivationPolicy(.regular); app.delegate = delegate
        withExtendedLifetime(delegate) { app.run() }
    }
}
