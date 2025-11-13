# 短網址擴展 (Short URL Extension)

一個簡單易用的 Chrome 瀏覽器擴展，可以快速將長網址轉換為短網址。支援自定義 API 服務，提供完整的歷史記錄管理功能。

## ✨ 主要功能

- 🔗 **一鍵縮短網址**：點擊擴展圖標即可縮短當前頁面網址
- 🖱️ **右鍵快捷操作**：右鍵任何鏈接或頁面即可快速縮短
- 📝 **自定義輸入**：手動輸入任何網址進行縮短
- 📚 **歷史記錄管理**：保存最近 50 筆縮短記錄，支援搜索和導出
- ⚙️ **自定義 API**：支援配置自己的縮網址服務
- 📋 **自動複製**：縮短後自動複製到剪貼板
- 🔔 **即時通知**：操作結果即時反饋

## 🚀 安裝方式

### 從 Chrome Web Store 安裝
1. 前往 [Chrome Web Store](https://chrome.google.com/webstore) 搜索 "Short URL Extension 333"
2. 點擊 "加到 Chrome" 進行安裝

### 手動安裝（開發版本）
1. 下載或克隆此專案
2. 打開 Chrome 瀏覽器，前往 `chrome://extensions/`
3. 啟用右上角的 "開發者模式"
4. 點擊 "載入未封裝項目"，選擇專案資料夾
5. 安裝完成！


### 打包方式

```
zip -r chrome-shorturl-extension.zip . -x "*.md" "*.git*" "*.DS_Store" "test-*" "permissions-strategy.md" "stats-feature.md" "edit-delete-feature.md" "refresh-feature.md"
```

## 🎯 使用方法

### 快速縮短
- **當前頁面**：點擊擴展圖標 → 點擊 "縮短當前頁面網址"
- **自定義網址**：點擊擴展圖標 → 輸入網址 → 點擊 "縮短自定義網址"
- **右鍵操作**：右鍵任何鏈接 → 選擇 "縮短網址"

### 歷史記錄
- 在彈出窗口查看最近 10 筆記錄
- 點擊 "查看全部" 進入完整歷史頁面
- 支援搜索、導出和清除功能

### 設定配置
1. 點擊擴展圖標 → 點擊 "設定"
2. 配置 API 端點和授權令牌
3. 可設定主要和備用 API 服務

## ⚙️ 支援的 API 服務

- **aiurl.tw** - 預設服務
- **glsoft.ai** - 備用服務
- **自定義服務** - 支援任何相容的縮網址 API

### API 格式要求
```
POST /api/link/create
Headers:
  authorization: Bearer YOUR_TOKEN
  content-type: application/json
Body:
  {
    "url": "https://example.com"
  }

Response:
  {
    "link": {
      "slug": "abc123"
    }
  }
```

## � 文檔索引 (Documentation Index)

本專案包含多個詳細的說明文檔，幫助開發者和用戶了解擴展的各項功能：

### 🔧 **開發相關文檔**
- **[test-api.md](./test-api.md)** - API 測試說明和請求格式範例
- **[test-checklist.md](./test-checklist.md)** - 完整的功能測試清單，包含 API 測試和用戶流程測試
- **[permissions-strategy.md](./permissions-strategy.md)** - Chrome 擴展權限策略說明，解釋為什麼不使用通配符

### 📊 **功能特性文檔**
- **[stats-feature.md](./stats-feature.md)** - 統計功能說明，包含 visits、visitors、referers 數據顯示
- **[edit-delete-feature.md](./edit-delete-feature.md)** - 編輯和刪除功能說明，包含 API 整合和用戶介面
- **[refresh-feature.md](./refresh-feature.md)** - 歷史頁面刷新功能說明，解決多分頁同步問題

### 📋 **政策和隱私**
- **[PRIVACY.md](./PRIVACY.md)** - 完整的隱私權政策，符合 Chrome Web Store 要求

### 📖 **如何使用這些文檔**

| 文檔 | 適用對象 | 主要內容 |
|------|----------|----------|
| `test-api.md` | 開發者 | API 請求格式、測試範例 |
| `test-checklist.md` | 開發者/測試者 | 系統性測試所有功能 |
| `permissions-strategy.md` | 開發者 | Chrome Web Store 上架權限策略 |
| `stats-feature.md` | 開發者/用戶 | 統計功能使用說明 |
| `edit-delete-feature.md` | 開發者/用戶 | 編輯刪除功能使用說明 |
| `refresh-feature.md` | 用戶 | 歷史頁面刷新功能說明 |
| `PRIVACY.md` | 用戶/Chrome Store | 隱私權政策和數據處理說明 |

---

## 🔒 隱私權保護

- ✅ 不收集任何個人資料
- ✅ 所有資料僅存儲在本地瀏覽器
- ✅ 使用 HTTPS 加密傳輸
- ✅ 授權令牌以密碼形式保護
- ✅ 可隨時清除所有資料

## 🛠️ 開發資訊

### 技術規格
- **平台**：Chrome Extension Manifest V3
- **語言**：JavaScript, HTML, CSS
- **權限**：contextMenus, storage, activeTab, clipboardWrite, notifications, scripting

### 專案結構
```
chrome-shorturl/
├── manifest.json                 # 擴展配置
├── background.js                 # 背景腳本
├── popup.html                    # 彈出窗口
├── popup.js                      # 彈出窗口邏輯
├── options.html                  # 設定頁面
├── options.js                    # 設定頁面邏輯
├── history.html                  # 歷史記錄頁面
├── history.js                    # 歷史記錄邏輯
├── utils.js                      # 共用工具函數
├── icons/                        # 圖標文件
├── PRIVACY.md                    # 隱私權政策
├── README.md                     # 主要說明文檔
├── test-api.md                   # API 測試說明
├── test-checklist.md             # 功能測試清單
├── permissions-strategy.md       # 權限策略說明
├── stats-feature.md              # 統計功能說明
├── edit-delete-feature.md        # 編輯刪除功能說明
└── refresh-feature.md            # 刷新功能說明
```

### 本地開發
```bash
git clone https://github.com/tbdavid2019/chrome-shorturl.git
cd chrome-shorturl
# 在 Chrome 中載入未封裝的擴展
```


打包方式
```
zip -r ../chrome-shorturl-extension.zip . -x "*.git*" -x "*.DS_Store" -x "*.md" -x ".gitignore"
```

## 📄 授權條款

請聯絡開發者了解授權相關事宜。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

# Short URL Extension

A simple and easy-to-use Chrome browser extension that quickly converts long URLs into short URLs. Supports custom API services and provides complete history management functionality.

## ✨ Key Features

- 🔗 **One-click URL shortening**: Click the extension icon to shorten the current page URL
- 🖱️ **Right-click shortcuts**: Right-click any link or page for quick shortening
- 📝 **Custom input**: Manually enter any URL to shorten
- 📚 **History management**: Save the last 50 shortened records with search and export support
- ⚙️ **Custom API**: Support for configuring your own URL shortening service
- 📋 **Auto-copy**: Automatically copy shortened URLs to clipboard
- 🔔 **Instant notifications**: Real-time feedback on operations

## 🚀 Installation

### From Chrome Web Store
1. Go to [Chrome Web Store](https://chrome.google.com/webstore) and search for "Short URL Extension"
2. Click "Add to Chrome" to install

### Manual Installation (Development Version)
1. Download or clone this project
2. Open Chrome browser and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the project folder
5. Installation complete!

## 🎯 How to Use

### Quick Shortening
- **Current page**: Click extension icon → Click "Shorten Current Page URL"
- **Custom URL**: Click extension icon → Enter URL → Click "Shorten Custom URL"
- **Right-click**: Right-click any link → Select "Shorten URL"

### History Records
- View the last 10 records in the popup window
- Click "View All" to access the complete history page
- Supports search, export, and clear functions

### Configuration
1. Click extension icon → Click "Settings"
2. Configure API endpoint and authorization token
3. Can set primary and backup API services

## ⚙️ Supported API Services

- **aiurl.tw** - Default service
- **glsoft.ai** - Backup service
- **Custom service** - Support any compatible URL shortening API

### API Format Requirements
```
POST /api/link/create
Headers:
  authorization: Bearer YOUR_TOKEN
  content-type: application/json
Body:
  {
    "url": "https://example.com"
  }

Response:
  {
    "link": {
      "slug": "abc123"
    }
  }
```

## 🔒 Privacy Protection

- ✅ No personal data collection
- ✅ All data stored locally in browser only
- ✅ HTTPS encrypted transmission
- ✅ Authorization tokens protected in password form
- ✅ Can clear all data anytime

## 🛠️ Development Information

### Technical Specifications
- **Platform**: Chrome Extension Manifest V3
- **Language**: JavaScript, HTML, CSS
- **Permissions**: contextMenus, storage, activeTab, clipboardWrite, notifications, scripting

### Project Structure
```
chrome-shorturl/
<<<<<<< HEAD
├── manifest.json          # Extension configuration
├── background.js          # Background script
├── popup.html            # Popup window
├── popup.js              # Popup window logic
├── options.html          # Settings page
├── options.js            # Settings page logic
├── history.html          # History page
├── history.js            # History page logic
├── icons/                # Icon files
└── PRIVACY.md            # Privacy policy
```

### Local Development
=======
├── manifest.json                 # Extension configuration
├── background.js                 # Background script
├── popup.html                    # Popup window
├── popup.js                      # Popup window logic
├── options.html                  # Settings page
├── options.js                    # Settings page logic
├── history.html                  # History page
├── history.js                    # History page logic
├── utils.js                      # Shared utility functions
├── icons/                        # Icon files
├── PRIVACY.md                    # Privacy policy
├── README.md                     # Main documentation
├── test-api.md                   # API testing guide
├── test-checklist.md             # Feature testing checklist
├── permissions-strategy.md       # Permissions strategy guide
├── stats-feature.md              # Statistics feature guide
├── edit-delete-feature.md        # Edit/delete feature guide
└── refresh-feature.md            # Refresh feature guide
```

## Documentation Index

This project includes comprehensive documentation for different aspects of the extension:

### Development Documentation

| Document | Purpose | Target Audience |
|----------|---------|----------------|
| `test-api.md` | API testing procedures and examples | Developers testing API integration |
| `test-checklist.md` | Comprehensive feature testing checklist | QA testers and developers |
| `permissions-strategy.md` | Chrome Web Store permissions strategy | Developers, Store reviewers |

### Feature Documentation

| Document | Purpose | Target Audience |
|----------|---------|----------------|
| `stats-feature.md` | Statistics display functionality | Users, Feature reviewers |
| `edit-delete-feature.md` | URL management capabilities | Users, Feature reviewers |
| `refresh-feature.md` | Data synchronization and refresh | Users, Troubleshooters |

### Policy Documentation

| Document | Purpose | Target Audience |
|----------|---------|----------------|
| `PRIVACY.md` | Privacy policy and data handling | Users, Store reviewers |

### Local Development

>>>>>>> de2aaf5 (1.1版本 增加了許多 edit / del /  還有統計數據)
```bash
git clone https://github.com/tbdavid2019/chrome-shorturl.git
cd chrome-shorturl
# Load unpacked extension in Chrome
```

## 📄 License

Please contact the developer for licensing information.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📞 Contact

- **Developer**: DAVID
- **Website**: DAVID888.com
- **GitHub**: [tbdavid2019](https://github.com/tbdavid2019)

---

## Author

Made with ❤️ by DAVID
