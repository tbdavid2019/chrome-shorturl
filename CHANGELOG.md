# Changelog

All notable changes to this project will be documented in this file.

---

## [2.3.0] - 2026-10-24

### Added (新增 / 核心功能升級)
- **頂部雙分頁導航架構 (Segmented Tab Navigation)**:
  - 將「還原分頁 (Restore Tabs)」與「縮短網址 (Short URL)」重構為頂部流暢切換的雙面板架構，預設首頁聚焦於高頻使用的還原分頁，並自動記憶使用者上次停留的頁籤。
  - 還原分頁獲得完整垂直視窗空間（支援捲動與多筆檢視），徹底解決過往空間狹窄擠壓的問題。
- **關閉分頁即時搜尋與過濾 (Instant Tab Search & Filter)**:
  - 於還原面板新增即時搜尋框，輸入關鍵字即可即刻過濾關閉分頁的標題與網址，秒速尋回重要頁面。
- **英雄級快捷還原大按鈕 (Hero Restore Button)**:
  - 醒目 Saffron 金黃高對比按鈕，支援一鍵還原最後關閉的分頁，並自動偵測系統環境標註快速鍵提示（Mac `⌘+Shift+T` / Windows `Ctrl+Shift+T`），在彈窗內按 Enter 亦可快速觸發。
- **批次還原與重新整理 (Restore All & Refresh)**:
  - 支援「全部還原」一鍵復原清單中所有關閉分頁，以及「重新整理」即時重繪 Chrome sessions。
- **整組視窗關閉折疊預覽 (Window Session Collapse & Preview)**:
  - 智慧識別整組視窗關閉紀錄（例如視窗含 6 個分頁），支援展開預覽內部各分頁標題，亦可一鍵整組視窗復原。

### Changed (變更 / 設計系統重構)
- **品牌視覺全面對標 david888.com & 2md.aiurl.tw (Design System Alignment)**:
  - 引入核心五色品牌調色盤：Saffron 藏紅花黃 (`#ffb010`, Pantone 14-1064 TPG)、Deep Blue 深海藍 (`#17324d`)、Clay 陶土紅 (`#a9471d`)、Warm Cream 暖米白 (`#fff9e8`)、Ink 墨黑 (`#2b251a`) 與 Canvas 溫潤畫布底色 (`#fff0cc`)。
  - 重構淺色模式與深色模式（Dark Mode 對標 david888.com 暗夜藍系 `--bg-base: #0c1927`、`--bg-surface: #13273c`、`--bg-surface-elevated: #1b3450`）。
  - 統一 Popup、Options 與 History 三大核心頁面的主題變數、卡片層級與邊框質感，徹底移除舊有雜亂拼湊的冷綠/淡紫/冷灰配色。

- **WCAG 2.1 AA / AAA 無障礙色彩合規 (Accessibility Compliance)**:
  - 修正黃色背景按鈕使用白字導致嚴重不可讀的嚴重瑕疵：在 Saffron 主色背景 (`#ffb010`) 上全面採用 Ink 墨黑色 (`#2b251a`) 文字與圖示，對比度達到 **8.33:1**，超額通過 **WCAG AAA** 最高對比標準（≥ 7:1）。
  - 次要與功能按鈕採用 Deep Blue (`#17324d`) 搭配白字，對比度達 **12.65:1**（WCAG AAA）。
  - 危險/清除按鈕採用 Clay 陶土紅 (`#a9471d`) 搭配白字，對比度達 **5.96:1**（WCAG AA）。
  - 次要輔助文字在淺色模式採用深暖褐灰 (`#594e36`)，對比度 **6.2:1**（WCAG AA）；在深色模式採用淡冷灰 (`#cbd5e1`)，對比度 **9.1:1**（WCAG AAA）。
  - 優化表單輸入框焦點態光環 (`focus-ring: rgba(255, 176, 16, 0.45)`)，大幅提升鍵盤導航可見度。

- **嚴格規範字體階梯，根除字體忽大忽小 (Typography Standardization)**:
  - 引入 `Noto Sans TC` 與等寬字型 `JetBrains Mono` 跨平台字型族群，提升中文與短網址/代碼的可讀性。
  - 徹底清除所有零散、碎小的字級（刪除 10px、11px、11.5px、12.5px、13.5px 等破碎小數點尺寸）。
  - 確立統一的 5 級階梯標準：
    - 主標題 (Page Header): `22px` (Bold)
    - 次標題 (Card / Modal Header): `15px` ~ `16px` (Semi-bold / Bold)
    - 內文與主要控制項 (Body / Inputs / Buttons): `14px` (Regular / Medium / Semi-bold)
    - 次要文字與列表副標 (Secondary / Form Labels): `13px` (Medium)
    - 輔助說明與時間戳記 (Captions / Badges / Timestamps): `12px` (最小合法字級，保護視力且符合易讀性下限)
  - 短網址顯示區、複製結果與代碼輸入框強制採用等寬字型 (`JetBrains Mono`)，確保短鏈長度與符號清晰整齊不跳動。

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
