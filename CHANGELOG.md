# Changelog

All notable changes to this project will be documented in this file.

---

## [2.2.0] - 2026-07-21

### Fixed (修復)
- **Options Page Launch Crash (修復設定頁面閃退)**: Resolved a critical runtime `TypeError: Cannot set properties of null` where [options.js](file:///Users/david/git/tbdavid2019/chrome-shorturl/options.js) attempted to load settings into a commented-out primary token input. Restored the field in [options.html](file:///Users/david/git/tbdavid2019/chrome-shorturl/options.html) with a secure, modernized design.
- **Context Menu Backup Fallback (修復右鍵選單備援機制)**: Fixed the nested `try/catch` flow in [background.js](file:///Users/david/git/tbdavid2019/chrome-shorturl/background.js) so that the backup API shortening is correctly triggered upon primary API failure.
- **Popup Backup Fallback (修復彈出頁面備援機制)**: Implemented backup API fallback for popup-driven shortening in [popup.js](file:///Users/david/git/tbdavid2019/chrome-shorturl/popup.js).

### Added (新增)
- **Vector SVG Icon Upgrades (向量圖示升級)**: Replaced all legacy emoji icons (`⏮️`, `📄`, `🔳`, `⚙️`, `🎯`, `📚`, `🗑️`, `📋`, `💾`, etc.) across the Popup, Options, and History pages with clean, modern inline SVG vector icons.
- **Themed Section Color Coding (功能區塊微配色)**: Applied custom themed background tints to each Double-Bezel functional container card (green for current tab shortening, blue for custom shortening, purple for recent history, and soft neutral gray for tab restore and settings).
- **Closed Tabs Pagination (還原分頁支援加載更多)**: Upgraded the session restoration list in [popup.js](file:///Users/david/git/tbdavid2019/chrome-shorturl/popup.js) to retrieve up to 25 items from Chrome history, displaying 5 initially with a "Show More (+)" button to paginate.
- **Manifest Multi-Language Localization (Manifest 獨立多國語言)**: Separated English and Traditional Chinese extension metadata names and descriptions into structured `_locales/` directory messages, dynamically resolving names and descriptions based on the browser's language setting.
- **Extension Rename (變更套件名稱)**: Renamed the extension in `manifest.json` to `Undo Closed Tabs & Short URL (還原分頁與短網址) 333` to emphasize the restore functionality as the priority feature with the user's signature marker.
- **Closed Tabs Ergonomic Reordering (調整還原分頁至首位)**: Repositioned the "Recently Closed Tabs" section shell to the very top of the popup layout based on user frequency preference.
- **Double-Bezel Nested Card Layout (雙邊框嵌套硬體感佈局)**: Adopted premium "Doppelrand" hardware nested containers (`section-shell` + `section-core`) for popup sections, providing tangible depth and strong visual division of functional blocks.
- **Unified Corner Radius Lock (一致性圓角鎖定)**: Locked corner sizes strictly to 12px for shells, 8px for cards/inputs, and 6px for buttons to eliminate visual inconsistencies.
- **Premium Geist Font Stack (頂級 Geist 字型家族)**: Upgraded typography across the Popup, Options, and History pages to the high-end `Geist` + `Plus Jakarta Sans` sans-serif font stack.
- **Anti-Slop Layout Refactoring (去套路化排版重構)**: Removed nested card borders and backgrounds from the popup page, creating a flat layout using thin hairline dividers to reduce visual clutter and align with modern design standards.
- **Dark/Light Theme Toggle (暗黑/明亮主題切換)**: Introduced synchronized dark/light mode switches across the Popup, Options, and History pages, persisting choices in storage.
- **Auto-Protocol Prepending (網址協定自動補全)**: Automatically prepends `https://` to inputs without a protocol (e.g. `google.com` becomes `https://google.com`), preventing API submission errors.
- **Enter Key Shortening Listener (按 Enter 鍵快速縮網址)**: Enabled pressing `Enter` inside the custom URL input box in the popup to trigger shortening.
- **QR Code Download Button (QR Code 下載功能)**: Added a "Download QR Code" button in [popup.html](file:///Users/david/git/tbdavid2019/chrome-shorturl/popup.html) to let users save the generated QR code canvas directly as a PNG file.
- **Tab Favicons in Restore List (還原分頁支援 Favicon)**: Displayed favicons next to items in the recently closed tabs list in the popup, with fallback mechanisms for missing favicons and directories.
- **URL Shortening Loading States (縮短網址讀取狀態)**: Buttons now transition to a disabled loading state (`⏳ Shortening...` / `⏳ 縮短中...`) during API calls to prevent duplicate requests.
- **Settings Multi-language Support (設定頁面多國語言)**: Implemented dynamic switching between English and Traditional Chinese in the options page.
- **History Multi-language Support (歷史紀錄多國語言)**: Added localization translation support for all elements, dynamic list entries, and dialogues in the history page.
- **Authorization Token Visibility Toggle (驗證密碼切換開關)**: Added interactive visibility toggles (👁️/🙈) for both primary and backup tokens on the options page.
- **Custom Scrollbar Styling (自訂美化捲軸)**: Added customized webkit-scrollbar styles to the popup window.

### Changed (變更)
- **Settings UI Redesign (設定頁面視覺重構)**: Redesigned the options page to feature a modern, responsive, card-based interface with Inter typography, micro-shadows, and focus highlights.
- **History UI Redesign (歷史頁面視覺重構)**: Redesigned the history page to use clean cards, interactive status badges, and cleaner alignment.
- **Storage Display Precision (儲存空間精確顯示)**: Changed storage sync display in the history page from Megabytes (MB) to Kilobytes (KB) to align with Chrome's 100KB sync storage quota.
