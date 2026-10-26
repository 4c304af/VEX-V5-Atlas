# offline-vexv5cpp-api

**V5 Atlas** 是 VEX V5 C++ 中英双语离线桌面阅读器，采用 Material 3 Expressive 风格界面，包含 66 篇文档、示例代码和 56 张本地配图。

A bilingual, offline Windows desktop reference for the VEX V5 C++ API, with a Material 3 Expressive interface and on-demand checks against the official documentation.

[下载 Windows 版本](https://github.com/4c304af/offline-vexv5cpp-api/releases/latest) · [官方 C++ API](https://api.vex.com/v5/home/cpp/index.html) · [第三方内容说明](THIRD_PARTY_NOTICES.md)

![V5 Atlas 概览](docs/images/overview.png)

## 使用

在 [Releases](https://github.com/4c304af/offline-vexv5cpp-api/releases) 下载 `V5-Atlas-1.0.2-Windows-x64.exe`。关闭正在运行的旧版后，将新版放在可写入的文件夹中双击运行。首次启动会在程序旁创建 `.v5-atlas`，其中保存文档资源、收藏和偏好设置。

运行平台为 Windows 10/11 x64，使用系统的 Microsoft Edge WebView2 Runtime。文档、搜索、示例、图片、字体和动画在本地运行；“文档更新”按需联网核对，点击官方来源链接会打开系统浏览器。

快捷键 `Ctrl+K` 打开全文搜索。顶部可切换中文、English 和中英对照。中文为机器辅助翻译，并进行了术语统一和重点语义校订；英文原文随包保留。

## 文档更新（1.0.2）

在左侧打开“文档更新”，点击“立即检查”。应用通过系统代理设置连接 `api.vex.com`，读取官方 C++ 索引及原始 Markdown，以内容哈希识别新增、修改与移除的页面。换行格式与 UTF-8 BOM 不会触发误报。

检查支持进度显示、取消、变化分类筛选和官方原文链接；结果保存在当前阅读配置中，断网仍可查看。读取失败的页面会标为未完成核对，不会显示为已确认没有更新。默认不会在启动时联网检查。

变化清单对应官方英文内容；离线文档与中文译文需要随新的双语包一起更新。新离线快照会使用独立的核对基线，避免把旧结果误用于新内容。

![官方文档更新检查](docs/images/documentation-updates.png)

## 1.0.1 修复

- 修复内置 WebView2 托管组件被 .NET 当作远程程序集而拒绝加载的问题。
- 区分组件加载失败与运行时缺失，错误详情写入程序旁的 `V5Atlas-startup.log`。
- 将 Windows 打包命令切换到实际交付的原生启动器。
- 增加成品启动、断网阅读、搜索、代码复制、双语代码一致性和收藏重启持久化测试。

## 开发

前端使用 React、TypeScript、Vite、Motion 和 Prism。Windows 启动器使用 .NET Framework 与 Microsoft WebView2 WinForms SDK 1.0.2903.40。构建需要 Windows x64、Node.js 24、Python 3.10 或更高版本，以及 .NET Framework 4.8 的 C# 编译器。

```powershell
git clone https://github.com/4c304af/offline-vexv5cpp-api.git
cd offline-vexv5cpp-api
npm ci
npm run setup:windows
npm run package
```

`setup:windows` 从 Microsoft NuGet 下载固定版本的构建 SDK，校验 SHA-256 后解压到 `build/webview2/sdk`，不会安装系统软件。`package` 生成 `release/V5-Atlas-1.0.2-Windows-x64.exe` 和 `release/SHA256SUMS.txt`。

```powershell
npm run dev
npm run verify:docs
npm run test:desktop
npm run test:updates
npm test
npm run test:desktop-updates
```

界面测试使用 Microsoft Edge。桌面测试使用独立配置目录，`test:desktop-updates` 需要能够访问官方站点。仓库的 Windows 构建工作流会验证文档、测试更新核对逻辑并生成程序。

`npm run build` 会根据原始源文件生成规范化的更新核对基线；随后可用 `python tools/package_windows.py` 单独重新打包已构建的前端。

## 文档数据

- `sources/en/`：官方原始 Markdown，保留原始文件字节。
- `sources/manifest.json`：原始链接、快照日期和 SHA-256。
- `sources/editorial.json`：中文重点校订。
- `sources/translation-cache.json`：构建阶段使用的翻译缓存。
- `public/docs/`：应用使用的离线双语文档和图片。
- `desktop/`：Windows 启动器和原生更新检测。

普通前端构建直接使用已提交的离线内容。重新导入或编译文档时，可先运行 `python -m pip install -r tools/requirements-docs.txt`，再使用 `tools/import_docs.py` 和 `tools/build_docs.py`。翻译请求发生在文档构建阶段。

这是独立制作的离线阅读器，非 VEX Robotics 官方产品。官方文档、代码示例、配图和商标的权利归原权利人所有，本仓库没有对第三方内容重新授予许可。详细来源与依赖说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
