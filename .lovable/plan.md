# Private web installation and updates

Add an Install / Updates page to the existing Vault, preserving the hive theme and Demo boundaries.

- Add a uniquely identified standalone manifest, local 192/512px icons and Apple home-screen icon.
- Provide supported browser installation prompts and iPhone/iPad instructions, current build, connectivity, update checking and explicit reload consent.
- Generate an offline service worker, disabled and cleaned up in previews/dev/iframes. Cache only a static offline shell and public assets, never account pages or private responses. Offline account and Vault operations remain unavailable.
- Keep the project unpublished. Return the real private preview link and explain that full offline/update testing needs a stable approved non-preview HTTPS origin. No native installers will be invented.
- Document release prerequisites and verify policy tests, manifest/icons, browser page behavior and available automatic build evidence.

## Technical details
Use vite-plugin-pwa generateSW with a single guarded browser registration module; no custom app-shell worker. Version metadata is generated at build time. Workbox handles asset caching; private paths bypass caches. Installed pages never reload automatically.