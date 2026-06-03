# Changelog

## [0.6.0] — 2026-06-03

### Added
- **Multi-color highlights** — 5 color swatches (yellow, red, green, blue, orange) when highlighting text. Each color has a semantic label: general, disagree, key finding, method, question.
- **Tag system** — tag papers with custom labels, filter library by tag, add/remove tags on any PDF card.
- **URL import** — paste an arXiv link or direct PDF URL to download and open the paper.
- **Sidebar hover-expand** — collapsed sidebar auto-expands on hover, stays pinned on click.
- **Improved outline detection** — better heading hierarchy with deeper nesting (up to 4 levels) and more academic heading patterns.

### Fixed
- **Ollama auto-start** — now searches `%LOCALAPPDATA%`, `%ProgramFiles%`, and `%ProgramFiles(x86)%` for ollama.exe. Shows a clear error banner if not found.
- **Ollama indicator flickering** — replaced unreliable `AbortSignal.timeout` with manual timeout, increased poll interval to 15s.
- **PDF outline** — cleaner tree building with proper parent-child nesting at all depths.

### Changed
- **Sidebar** — cleaner layout, always visible on all screens, navigation items for Library and Settings.
- **TitleBar** — removed Library and Settings tabs (now in sidebar).
- **Toolbar** — highlight color selector appears inline when highlight tool is active.
