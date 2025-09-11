# 功能測試清單

## ✅ 基本功能測試

### 1. 創建短網址
- [ ] 縮短當前頁面 URL
- [ ] 自定義 URL 縮短
- [ ] 添加評論
- [ ] 設定自定義 slug
- [ ] 設定過期時間
- [ ] 右鍵選單縮短

### 2. 統計功能
- [ ] 彈出窗口顯示統計
- [ ] 歷史頁面顯示統計
- [ ] 手動刷新統計
- [ ] 統計資料持久保存

### 3. 編輯功能
- [ ] 歷史頁面編輯 URL
- [ ] 修改評論
- [ ] 修改自定義 slug
- [ ] 修改過期時間
- [ ] 編輯表單展開/收合
- [ ] 從彈出窗口編輯（自動導航）

### 4. 刪除功能
- [ ] 歷史頁面刪除
- [ ] 彈出窗口快速刪除
- [ ] 刪除確認對話框
- [ ] 刪除後更新顯示

### 5. 歷史管理
- [ ] 查看完整歷史
- [ ] 搜索功能
- [ ] 導出功能
- [ ] 清除全部功能
- [ ] 複製短網址

## 🔧 API 測試

### 創建 API
```bash
# 測試創建
curl -X POST "https://aiurl.tw/api/link/create" \
  -H "authorization: Bearer YOUR_TOKEN" \
  -H "content-type: application/json" \
  -d '{
    "url": "https://example.com",
    "comment": "測試評論",
    "slug": "test123",
    "expiration": "7d"
  }'
```

### 統計 API
```bash
# 測試統計
curl -X GET "https://aiurl.tw/api/stats/counters?slug=test123" \
  -H "authorization: Bearer YOUR_TOKEN"
```

### 編輯 API
```bash
# 測試編輯
curl -X PUT "https://aiurl.tw/api/link/edit" \
  -H "authorization: Bearer YOUR_TOKEN" \
  -H "content-type: application/json" \
  -d '{
    "url": "https://updated-example.com",
    "slug": "test123",
    "comment": "更新的評論",
    "expiration": "30d"
  }'
```

### 刪除 API
```bash
# 測試刪除
curl -X POST "https://aiurl.tw/api/link/delete" \
  -H "authorization: Bearer YOUR_TOKEN" \
  -H "content-type: application/json" \
  -d '{
    "slug": "test123"
  }'
```

## 🎯 用戶流程測試

### 完整工作流程
1. **設定 API**
   - [ ] 配置主要 API 和令牌
   - [ ] 配置備用 API 和令牌

2. **創建短網址**
   - [ ] 用當前頁面創建
   - [ ] 用自定義設定創建
   - [ ] 檢查在歷史中顯示

3. **查看統計**
   - [ ] 在彈出窗口查看
   - [ ] 在歷史頁面查看
   - [ ] 手動刷新統計

4. **管理短網址**
   - [ ] 編輯現有短網址
   - [ ] 刪除不需要的短網址
   - [ ] 搜索特定短網址

5. **數據管理**
   - [ ] 導出歷史資料
   - [ ] 清除舊資料
   - [ ] 檢查存儲限制

## 🐛 錯誤場景測試

### API 錯誤
- [ ] 無效令牌
- [ ] 網路連線錯誤
- [ ] API 服務不可用
- [ ] 重複 slug 錯誤

### 用戶輸入錯誤
- [ ] 無效 URL 格式
- [ ] 空白必填欄位
- [ ] 特殊字元處理

### 邊界條件
- [ ] 歷史記錄超過 50 筆
- [ ] 存儲空間不足
- [ ] 長 URL 處理
- [ ] 特殊字元 URL

## 📱 瀏覽器兼容性

### Chrome 版本
- [ ] Chrome 最新版本
- [ ] Chrome 舊版本支援
- [ ] Extension Manifest V3 支援

### 跨平台
- [ ] Windows
- [ ] macOS  
- [ ] Linux

## 🔒 安全性測試

### 資料保護
- [ ] 令牌安全存儲
- [ ] 密碼欄位隱藏
- [ ] HTTPS 連線
- [ ] 無敏感資料洩露

### 權限檢查
- [ ] 最小權限原則
- [ ] 必要權限申請
- [ ] 權限使用透明

## 📊 效能測試

### 載入效能
- [ ] 彈出窗口載入速度
- [ ] 歷史頁面載入速度
- [ ] 大量資料處理

### 記憶體使用
- [ ] 記憶體洩漏檢查
- [ ] 長時間運行穩定性

## 📝 測試記錄

| 功能 | 狀態 | 備註 |
|------|------|------|
| 創建短網址 | ⏳ | 待測試 |
| 統計顯示 | ⏳ | 待測試 |
| 編輯功能 | ⏳ | 待測試 |
| 刪除功能 | ⏳ | 待測試 |
| 歷史管理 | ⏳ | 待測試 |

使用此清單來系統性測試所有功能，確保擴展完全正常運作！
