# Chrome 擴展權限策略說明

## 🔒 為什麼不使用 `*` 通配符

### Chrome Web Store 政策
- **嚴格審查**：使用 `*://*/*` 或 `<all_urls>` 會觸發額外審查
- **審核延遲**：需要詳細說明使用理由，審核時間延長數週
- **拒絕風險**：可能直接被拒絕上架
- **用戶體驗**：會顯示「可以讀取和更改所有網站數據」警告

### 安全性考量
- **最小權限原則**：只申請必要的權限
- **用戶信任**：減少用戶的安全顧慮
- **隱私保護**：避免不必要的數據存取

## ✅ 推薦的權限策略

### 當前配置（最佳實踐）

```json
{
  "permissions": [
    "contextMenus",
    "storage", 
    "activeTab",
    "clipboardWrite",
    "notifications",
    "scripting",
    "permissions"
  ],
  "host_permissions": [
    "https://aiurl.tw/*",
    "https://glsoft.ai/*"
  ],
  "optional_host_permissions": [
    "https://*/*"
  ]
}
```

### 權限說明

#### 必需權限 (permissions)
- `contextMenus` - 右鍵選單功能
- `storage` - 存儲設定和歷史
- `activeTab` - 獲取當前頁面 URL
- `clipboardWrite` - 複製短網址到剪貼板
- `notifications` - 顯示操作結果通知
- `scripting` - 在頁面中執行剪貼板操作
- `permissions` - 管理可選權限

#### 預設主機權限 (host_permissions)
- `https://aiurl.tw/*` - 主要 API 服務
- `https://glsoft.ai/*` - 備用 API 服務

#### 可選主機權限 (optional_host_permissions)
- `https://*/*` - 支援自定義 HTTPS API

## 🎯 用戶體驗流程

### 初始安裝
1. 用戶安裝擴展時只看到最小權限申請
2. 預設支援 aiurl.tw 和 glsoft.ai
3. 不會顯示「所有網站」警告

### 啟用自定義 API
1. 用戶進入設定頁面
2. 看到「Custom API Support」區域
3. 點擊「🔓 Enable Custom APIs」按鈕
4. 系統請求額外權限（僅 HTTPS）
5. 用戶同意後可使用任何 HTTPS API

### 權限狀態顯示
- ✅ Custom APIs enabled - 已啟用
- ⚠️ Custom APIs not enabled - 未啟用
- ❌ Permission denied - 用戶拒絕

## 🔧 技術實作

### 權限檢查
```javascript
const hasPermissions = await chrome.permissions.contains({
  origins: ['https://*/*']
});
```

### 權限請求
```javascript
const granted = await chrome.permissions.request({
  origins: ['https://*/*']
});
```

### 動態 UI 更新
- 檢查當前權限狀態
- 根據狀態調整按鈕文字和顏色
- 提供即時反饋

## 📋 Chrome Web Store 上架優勢

### 審核優勢
1. **快速審核**：使用最小權限，審核更快
2. **低風險**：不會觸發額外安全審查
3. **用戶友好**：權限申請更合理

### 用戶接受度
1. **安裝率更高**：權限警告較少
2. **信任度提升**：透明的權限管理
3. **漸進式授權**：需要時才申請權限

## 🎨 設定頁面 UI

### Custom API Support 區域
```
┌─────────────────────────────────────┐
│ Custom API Support                  │
├─────────────────────────────────────┤
│ To use custom APIs outside of       │
│ aiurl.tw and glsoft.ai, you need    │
│ to grant additional permissions.    │
│                                     │
│ [🔓 Enable Custom APIs]            │
│ ⚠️ Custom APIs not enabled         │
└─────────────────────────────────────┘
```

### 狀態指示
- 🔓 Enable Custom APIs (未啟用)
- ✅ Custom APIs Enabled (已啟用，按鈕禁用)

## 🚀 使用建議

### 對於開發者
1. 保持當前配置用於上架
2. 透明地說明權限用途
3. 提供用戶控制權限的方式

### 對於用戶
1. 初次安裝：安全的最小權限
2. 需要自定義 API：手動啟用額外權限
3. 隨時可以在瀏覽器設定中撤銷權限

這種方法既滿足了功能需求，又符合 Chrome Web Store 的政策要求，是最佳的權限管理策略！
