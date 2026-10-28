# Third-party materials

## VEX documentation

The English reference sources, API examples, and official device illustrations are snapshots of the [VEX V5 C++ API reference](https://api.vex.com/v5/home/cpp/index.html). Their rights remain with VEX Robotics and the respective rights holders. This repository does not relicense those materials or claim affiliation with VEX Robotics.

`sources/manifest.json` records source URLs, the snapshot date, and SHA-256 hashes. `sources/en/` preserves the source bytes. Chinese text uses machine-assisted translation, a controlled glossary, and targeted editorial corrections; English remains available for comparison. `sources/editorial.json` records the editorial overrides.

VEX and VEXcode are marks of their respective owners.

## Runtime and dependencies

- Microsoft WebView2 SDK: Microsoft NuGet package `Microsoft.Web.WebView2`, version `1.0.2903.40`. The build preparation script downloads the official package and verifies its SHA-256. The SDK and system WebView2 Runtime retain Microsoft's applicable license terms.
- The macOS host uses Apple's system AppKit, WebKit, Foundation, and CryptoKit frameworks. These frameworks are provided by macOS; the application does not redistribute a browser engine.
- Manrope: Copyright 2019 The Manrope Project Authors; SIL Open Font License 1.1. The license is included in `public/licenses/Manrope-OFL.txt` and in packaged application resources.
- React, Motion, and Prism: MIT-licensed packages; see their upstream licenses and package metadata.
- Lucide: ISC-licensed icons; see the upstream Lucide license.

The app's robot illustration and application icon are project-specific assets. No repository-wide license is asserted over the third-party reference content above.
