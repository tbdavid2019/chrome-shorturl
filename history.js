// History page script with complete localization support and polished UI interactions
document.addEventListener('DOMContentLoaded', async () => {
  const translations = {
    en: {
      historyTitle: 'URL History - Short URL Extension',
      backLink: 'Back to Extension',
      historyTitleHeader: '🔗 URL History',
      historySubtitle: 'Complete history of all your shortened URLs',
      historyHint: '💡 Press F5 or click "Refresh All" to reload new URLs and statistics',
      refreshBtn: 'Refresh All',
      exportBtn: 'Export',
      clearAllBtn: 'Clear All',
      searchPlaceholder: 'Search URLs or titles...',
      emptyTitle: 'No URLs shortened yet',
      emptyDesc: 'Start shortening URLs to see them appear here!',
      
      originalLabel: 'Original',
      shortLabel: 'Short',
      copyBtn: 'Copy',
      copiedBtn: 'Copied!',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      
      statsVisits: 'visits',
      statsVisitors: 'visitors',
      statsReferers: 'referers',
      
      commentPrefix: 'Comment',
      slugPrefix: 'Custom slug',
      expiresPrefix: 'Expires',
      untitledPage: 'Untitled Page',
      
      editFormTitle: 'Edit URL Settings',
      editUrlLabel: 'Original URL:',
      editCommentLabel: 'Comment / Note:',
      editSlugLabel: 'Custom Slug:',
      editExpirationLabel: 'Expiration duration:',
      editSaveBtn: 'Save Settings',
      editCancelBtn: 'Cancel',
      
      confirmDelete: 'Are you sure you want to delete this URL?',
      confirmClearAll: 'Are you sure you want to delete all URLs? This cannot be undone.',
      successSaved: 'URL updated successfully',
      successDeleted: 'URL deleted successfully',
      successCleared: 'History cleared successfully',
      errorSave: 'Failed to edit URL',
      errorDelete: 'Failed to delete URL',
      errorClear: 'Failed to clear history',
      configureApiAlert: 'Please configure API settings first',
      urlRequired: 'URL is required',
      noHistoryExport: 'No history to export',
      loadingStats: 'Loading...',
      loadingHistory: 'Loading history...',
      loadingProgress: 'Loading stats',
      savingHistory: 'Saving...',
      refreshSuccess: 'URLs refreshed successfully',
      refreshFailed: 'Failed to refresh',
      refreshNoApi: 'History reloaded (API not configured for stats)',
      noUrlsFound: 'No URLs found',
      
      expirationNone: 'No expiration',
      expiration1h: '1 hour',
      expiration24h: '24 hours',
      expiration7d: '7 days',
      expiration30d: '30 days',
      expiration1y: '1 year',
      urlsCountSuffix: ' URLs'
    },
    'zh-TW': {
      historyTitle: '歷史網址紀錄 - 短網址擴充套件',
      backLink: '返回擴充功能',
      historyTitleHeader: '歷史產生紀錄',
      historySubtitle: '您過去產生的所有短網址完整紀錄與點擊統計',
      historyHint: '💡 可以按下 F5 鍵或點擊「重新整理」來同步最新的短網址與統計數據',
      refreshBtn: '重新整理',
      exportBtn: '匯出資料',
      clearAllBtn: '清除全部',
      searchPlaceholder: '搜尋網址、標題或備註...',
      emptyTitle: '尚未產生任何短網址',
      emptyDesc: '開始縮短網址後，產生的紀錄將會顯示在此處！',
      
      originalLabel: '原始網址',
      shortLabel: '短網址',
      copyBtn: '複製',
      copiedBtn: '已複製！',
      editBtn: '編輯',
      deleteBtn: '刪除',
      
      statsVisits: '次點擊',
      statsVisitors: '訪客',
      statsReferers: '來源',
      
      commentPrefix: '備註',
      slugPrefix: '自訂代碼',
      expiresPrefix: '過期時間',
      untitledPage: '未命名頁面',
      
      editFormTitle: '編輯短網址內容',
      editUrlLabel: '原始網址：',
      editCommentLabel: '備註說明：',
      editSlugLabel: '自訂代碼 (Slug)：',
      editExpirationLabel: '有效期限：',
      editSaveBtn: '儲存變更',
      editCancelBtn: '取消',
      
      confirmDelete: '您確定要刪除此短網址嗎？',
      confirmClearAll: '您確定要刪除所有的歷史網址紀錄嗎？此動作將無法復原。',
      successSaved: '短網址內容已成功更新',
      successDeleted: '短網址已成功刪除',
      successCleared: '歷史網址紀錄已成功清除',
      errorSave: '更新短網址失敗',
      errorDelete: '刪除短網址失敗',
      errorClear: '清除歷史紀錄失敗',
      configureApiAlert: '請先在設定頁面中設定 API 與 Token',
      urlRequired: '原始網址欄位不能為空',
      noHistoryExport: '目前沒有歷史紀錄可以匯出',
      loadingStats: '載入中...',
      loadingHistory: '讀取歷史紀錄中...',
      loadingProgress: '載入統計數據中',
      savingHistory: '儲存變更中...',
      refreshSuccess: '個網址統計數據已成功重新整理',
      refreshFailed: '統計數據重新整理失敗',
      refreshNoApi: '歷史紀錄已載入（尚未設定 API Token，無法獲取統計數據）',
      noUrlsFound: '沒有找到任何網址',
      
      expirationNone: '不設定到期',
      expiration1h: '1 小時',
      expiration24h: '24 小時',
      expiration7d: '7 天',
      expiration30d: '30 天',
      expiration1y: '1 年',
      urlsCountSuffix: ' 個網址'
    }
  };

  const historyContainer = document.getElementById('history-container');
  const emptyState = document.getElementById('empty-state');
  const totalCount = document.getElementById('total-count');
  const storageInfo = document.getElementById('storage-info');
  const searchBox = document.getElementById('search-box');
  const exportBtn = document.getElementById('export-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const refreshStatsBtn = document.getElementById('refresh-stats-btn');
  const backLink = document.getElementById('back-link');

  let allHistory = [];
  let filteredHistory = [];
  let activeLanguage = 'en';

  const detectBrowserLanguage = () => {
    const lang = navigator.language?.toLowerCase() || '';
    if (lang.includes('zh')) return 'zh-TW';
    return 'en';
  };

  const resolveLanguage = (preference) => {
    if (preference && preference !== 'auto') return preference;
    return detectBrowserLanguage();
  };

  const t = (key) => translations[activeLanguage]?.[key] || translations.en[key] || key;

  const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = t(key);
    });

    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      document.title = t(titleEl.dataset.i18n);
    }

    if (searchBox) {
      searchBox.placeholder = t('searchPlaceholder');
    }
  };

  // Format date based on selected language locale
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(activeLanguage === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Calculate storage usage (sync storage has max 100KB, so display in KB)
  const getStorageInfo = async () => {
    try {
      const result = await chrome.storage.sync.getBytesInUse();
      const maxBytes = chrome.storage.sync.QUOTA_BYTES;
      const usedKB = (result / 1024).toFixed(2);
      const maxKB = (maxBytes / 1024).toFixed(1);
      return `${usedKB}KB / ${maxKB}KB used`;
    } catch (error) {
      return 'Storage info unavailable';
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text, button) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalText = button.textContent;
      button.textContent = t('copiedBtn');
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Render history items
  const renderHistory = (history) => {
    historyContainer.innerHTML = '';
    
    if (history.length === 0) {
      emptyState.classList.remove('hidden');
      historyContainer.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    historyContainer.classList.remove('hidden');

    history.forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const itemHeader = document.createElement('div');
      itemHeader.className = 'item-header';
      
      const title = document.createElement('h3');
      title.className = 'item-title';
      title.textContent = item.title || t('untitledPage');
      title.title = item.title || item.original;
      
      const date = document.createElement('div');
      date.className = 'item-date';
      date.textContent = formatDate(item.createdAt);
      
      itemHeader.appendChild(title);
      itemHeader.appendChild(date);
      historyItem.appendChild(itemHeader);
      
      // Details container (meta info: comments, custom slug, expiration tags)
      const tagsContainer = document.createElement('div');
      tagsContainer.style.display = 'flex';
      tagsContainer.style.flexWrap = 'wrap';
      tagsContainer.style.gap = '8px';
      tagsContainer.style.marginBottom = '12px';

      // Comment
      if (item.comment && item.comment.trim()) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'tag-info';
        commentDiv.textContent = `💬 ${t('commentPrefix')}: ${item.comment}`;
        tagsContainer.appendChild(commentDiv);
      }
      
      // Custom slug info
      if (item.slug && item.slug.trim()) {
        const slugDiv = document.createElement('div');
        slugDiv.className = 'tag-info';
        slugDiv.style.color = '#0284c7';
        slugDiv.style.borderColor = '#bae6fd';
        slugDiv.style.backgroundColor = '#f0f9ff';
        slugDiv.textContent = `🎯 ${t('slugPrefix')}: ${item.slug}`;
        tagsContainer.appendChild(slugDiv);
      }
      
      // Expiration info
      if (item.expiration && item.expiration.trim()) {
        const expirationDiv = document.createElement('div');
        expirationDiv.className = 'tag-info';
        expirationDiv.style.color = '#ea580c';
        expirationDiv.style.borderColor = '#fed7aa';
        expirationDiv.style.backgroundColor = '#fff7ed';
        
        let expireLabel = item.expiration;
        if (item.expiration === '1h') expireLabel = t('expiration1h');
        else if (item.expiration === '24h') expireLabel = t('expiration24h');
        else if (item.expiration === '7d') expireLabel = t('expiration7d');
        else if (item.expiration === '30d') expireLabel = t('expiration30d');
        else if (item.expiration === '1y') expireLabel = t('expiration1y');

        expirationDiv.textContent = `⏰ ${t('expiresPrefix')}: ${expireLabel}`;
        tagsContainer.appendChild(expirationDiv);
      }
      
      if (tagsContainer.children.length > 0) {
        historyItem.appendChild(tagsContainer);
      }
      
      // Statistics display
      if (item.stats) {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'history-stats';
        statsDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px; color: var(--green-dark);"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>${item.stats.visits} ${t('statsVisits')} • ${item.stats.visitors} ${t('statsVisitors')} • ${item.stats.referers} ${t('statsReferers')}`;
        historyItem.appendChild(statsDiv);
      }
      
      // Original URL row
      const originalRow = document.createElement('div');
      originalRow.className = 'item-urls';
      
      const originalLabel = document.createElement('div');
      originalLabel.className = 'url-label';
      originalLabel.textContent = t('originalLabel');
      
      const originalLink = document.createElement('a');
      originalLink.className = 'url-link';
      originalLink.href = item.original;
      originalLink.textContent = item.original;
      originalLink.target = '_blank';
      
      const originalCopyBtn = document.createElement('button');
      originalCopyBtn.className = 'copy-btn-small';
      originalCopyBtn.textContent = t('copyBtn');
      originalCopyBtn.onclick = () => copyToClipboard(item.original, originalCopyBtn);
      
      originalRow.appendChild(originalLabel);
      originalRow.appendChild(originalLink);
      originalRow.appendChild(originalCopyBtn);
      
      // Short URL row
      const shortRow = document.createElement('div');
      shortRow.className = 'item-urls';
      
      const shortLabel = document.createElement('div');
      shortLabel.className = 'url-label';
      shortLabel.textContent = t('shortLabel');
      
      const shortLink = document.createElement('a');
      shortLink.className = 'url-link';
      shortLink.href = item.short;
      shortLink.textContent = item.short;
      shortLink.target = '_blank';
      
      const shortCopyBtn = document.createElement('button');
      shortCopyBtn.className = 'copy-btn-small';
      shortCopyBtn.textContent = t('copyBtn');
      shortCopyBtn.onclick = () => copyToClipboard(item.short, shortCopyBtn);
      
      shortRow.appendChild(shortLabel);
      shortRow.appendChild(shortLink);
      shortRow.appendChild(shortCopyBtn);
      
      // Action buttons
      const actionButtons = document.createElement('div');
      actionButtons.className = 'action-buttons';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'action-btn edit';
      editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>${t('editBtn')}`;
      editBtn.onclick = () => showEditForm(index);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'action-btn delete';
      deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>${t('deleteBtn')}`;
      deleteBtn.onclick = () => deleteUrl(item, index);
      
      actionButtons.appendChild(editBtn);
      actionButtons.appendChild(deleteBtn);
      
      historyItem.appendChild(originalRow);
      historyItem.appendChild(shortRow);
      historyItem.appendChild(actionButtons);
      
      // Edit form (initially hidden)
      const editForm = document.createElement('div');
      editForm.className = 'edit-form';
      editForm.id = `edit-form-${index}`;
      
      editForm.innerHTML = `
        <h4 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 700; color: var(--text);">${t('editFormTitle')}</h4>
        
        <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px; color:var(--text);">${t('editUrlLabel')}</label>
        <input type="text" class="edit-input" id="edit-url-${index}" value="${item.original}">
        
        <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px; color:var(--text);">${t('editCommentLabel')}</label>
        <input type="text" class="edit-input" id="edit-comment-${index}" value="${item.comment || ''}">
        
        <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px; color:var(--text);">${t('editSlugLabel')}</label>
        <input type="text" class="edit-input" id="edit-slug-${index}" value="${item.slug || ''}">
        
        <label style="display:block; font-size:12px; font-weight:600; margin-bottom:4px; color:var(--text);">${t('editExpirationLabel')}</label>
        <select class="edit-input" id="edit-expiration-${index}" style="height:38px;">
          <option value="" ${item.expiration === '' ? 'selected' : ''}>${t('expirationNone')}</option>
          <option value="1h" ${item.expiration === '1h' ? 'selected' : ''}>${t('expiration1h')}</option>
          <option value="24h" ${item.expiration === '24h' ? 'selected' : ''}>${t('expiration24h')}</option>
          <option value="7d" ${item.expiration === '7d' ? 'selected' : ''}>${t('expiration7d')}</option>
          <option value="30d" ${item.expiration === '30d' ? 'selected' : ''}>${t('expiration30d')}</option>
          <option value="1y" ${item.expiration === '1y' ? 'selected' : ''}>${t('expiration1y')}</option>
        </select>
        
        <div class="edit-buttons" style="margin-top: 14px;">
          <button class="edit-btn save" id="save-edit-btn-${index}" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            ${t('editSaveBtn')}
          </button>
          <button class="edit-btn cancel" id="cancel-edit-btn-${index}" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ${t('editCancelBtn')}
          </button>
        </div>
      `;
      
      historyItem.appendChild(editForm);
      historyContainer.appendChild(historyItem);

      // Event listener registration for edit buttons to avoid inline eval issues
      const saveBtnEl = editForm.querySelector(`#save-edit-btn-${index}`);
      const cancelBtnEl = editForm.querySelector(`#cancel-edit-btn-${index}`);
      if (saveBtnEl) saveBtnEl.onclick = () => saveEdit(index);
      if (cancelBtnEl) cancelBtnEl.onclick = () => cancelEdit(index);
    });
  };

  // Filter history
  const filterHistory = (searchTerm) => {
    if (!searchTerm.trim()) {
      filteredHistory = [...allHistory];
    } else {
      const term = searchTerm.toLowerCase();
      filteredHistory = allHistory.filter(item => 
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.comment && item.comment.toLowerCase().includes(term)) ||
        item.original.toLowerCase().includes(term) ||
        item.short.toLowerCase().includes(term)
      );
    }
    renderHistory(filteredHistory);
  };

  // Load history
  const loadHistory = async () => {
    try {
      const { history } = await chrome.storage.sync.get('history');
      allHistory = history || [];
      filteredHistory = [...allHistory];
      
      totalCount.textContent = `${allHistory.length}${t('urlsCountSuffix')}`;
      storageInfo.textContent = await getStorageInfo();
      
      renderHistory(filteredHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
      historyContainer.innerHTML = `<div class="empty-state"><h3>${t('errorClear')}</h3></div>`;
    }
  };

  // Export history
  const exportHistory = () => {
    if (allHistory.length === 0) {
      alert(t('noHistoryExport'));
      return;
    }
    
    const data = {
      exportDate: new Date().toISOString(),
      totalItems: allHistory.length,
      history: allHistory
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `url-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all history
  const clearAllHistory = async () => {
    if (allHistory.length === 0) {
      alert(t('noHistoryExport'));
      return;
    }
    
    if (confirm(t('confirmClearAll'))) {
      try {
        await chrome.storage.sync.set({ history: [] });
        await loadHistory();
        alert(t('successCleared'));
      } catch (error) {
        console.error('Failed to clear history:', error);
        alert(t('errorClear'));
      }
    }
  };

  // Refresh statistics for all URLs
  const refreshStats = async () => {
    refreshStatsBtn.textContent = t('loadingStats');
    refreshStatsBtn.disabled = true;

    try {
      refreshStatsBtn.textContent = t('loadingHistory');
      const { history } = await chrome.storage.sync.get('history');
      allHistory = history || [];
      
      if (allHistory.length === 0) {
        alert(t('noUrlsFound'));
        return;
      }

      const { baseUrl, token } = await chrome.storage.sync.get(['baseUrl', 'token']);
      
      if (!baseUrl || !token) {
        filteredHistory = [...allHistory];
        renderHistory(filteredHistory);
        totalCount.textContent = `${allHistory.length}${t('urlsCountSuffix')}`;
        storageInfo.textContent = await getStorageInfo();
        
        showToast(t('refreshNoApi'), '#15a34a');
        return;
      }

      refreshStatsBtn.textContent = `${t('loadingProgress')} (0/${allHistory.length})...`;
      
      const updatedHistory = await Promise.all(
        allHistory.map(async (item, index) => {
          const stats = await getUrlStats(item.short, baseUrl, token);
          refreshStatsBtn.textContent = `${t('loadingProgress')} (${index + 1}/${allHistory.length})...`;
          return { ...item, stats };
        })
      );

      refreshStatsBtn.textContent = t('savingHistory');
      await chrome.storage.sync.set({ history: updatedHistory });
      
      allHistory = updatedHistory;
      filteredHistory = [...allHistory];
      renderHistory(filteredHistory);
      
      totalCount.textContent = `${allHistory.length}${t('urlsCountSuffix')}`;
      storageInfo.textContent = await getStorageInfo();
      
      showToast(`✅ ${allHistory.length} ${t('refreshSuccess')}`, '#15a34a');
      
    } catch (error) {
      console.error('Failed to refresh:', error);
      showToast(`❌ ${t('refreshFailed')}: ${error.message}`, '#ef4444');
    } finally {
      refreshStatsBtn.textContent = t('refreshBtn');
      refreshStatsBtn.disabled = false;
    }
  };

  // Toast notification helper
  const showToast = (message, bgColor) => {
    const toast = document.createElement('div');
    toast.style.cssText = `position: fixed; top: 24px; right: 24px; background: ${bgColor}; color: white; padding: 12px 20px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 13.5px; font-weight: 600; font-family: var(--font); animation: slideIn 0.3s ease;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Show edit form
  const showEditForm = (index) => {
    const editForm = document.getElementById(`edit-form-${index}`);
    if (editForm) {
      editForm.classList.add('show');
    }
  };

  // Cancel edit
  const cancelEdit = (index) => {
    const editForm = document.getElementById(`edit-form-${index}`);
    if (editForm) {
      editForm.classList.remove('show');
    }
  };

  // Save edit
  const saveEdit = async (index) => {
    const urlInput = document.getElementById(`edit-url-${index}`);
    const commentInput = document.getElementById(`edit-comment-${index}`);
    const slugInput = document.getElementById(`edit-slug-${index}`);
    const expirationSelect = document.getElementById(`edit-expiration-${index}`);
    
    const newUrl = urlInput.value.trim();
    const newComment = commentInput.value.trim();
    const newSlug = slugInput.value.trim();
    const newExpiration = expirationSelect.value;
    
    if (!newUrl) {
      alert(t('urlRequired'));
      return;
    }

    try {
      const { baseUrl, token } = await chrome.storage.sync.get(['baseUrl', 'token']);
      
      if (!baseUrl || !token) {
        alert(t('configureApiAlert'));
        return;
      }

      const originalItem = filteredHistory[index];
      const urlParts = originalItem.short.split('/');
      const originalSlug = urlParts[urlParts.length - 1];

      const editApiUrl = baseUrl.replace('/api/link/create', '/api/link/edit');
      
      const requestBody = { 
        url: newUrl,
        slug: newSlug || originalSlug
      };
      
      if (newComment) requestBody.comment = newComment;
      if (newExpiration) requestBody.expiration = newExpiration;

      const response = await fetch(editApiUrl, {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const updatedItem = {
        ...originalItem,
        original: newUrl,
        comment: newComment,
        slug: newSlug || originalSlug,
        expiration: newExpiration,
        short: data.shortLink || originalItem.short
      };

      const originalIndex = allHistory.findIndex(item => item.short === originalItem.short);
      if (originalIndex !== -1) {
        allHistory[originalIndex] = updatedItem;
      }
      
      filteredHistory[index] = updatedItem;

      await chrome.storage.sync.set({ history: allHistory });
      renderHistory(filteredHistory);
      
      alert(t('successSaved'));
    } catch (error) {
      console.error('Failed to edit URL:', error);
      alert(`${t('errorSave')}: ${error.message}`);
    }
  };

  // Delete URL
  const deleteUrl = async (item, index) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    try {
      const { baseUrl, token } = await chrome.storage.sync.get(['baseUrl', 'token']);
      
      if (!baseUrl || !token) {
        alert(t('configureApiAlert'));
        return;
      }

      const urlParts = item.short.split('/');
      const slug = urlParts[urlParts.length - 1];

      const deleteApiUrl = baseUrl.replace('/api/link/create', '/api/link/delete');

      const response = await fetch(deleteApiUrl, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ slug })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const originalIndex = allHistory.findIndex(historyItem => historyItem.short === item.short);
      if (originalIndex !== -1) {
        allHistory.splice(originalIndex, 1);
      }
      
      filteredHistory.splice(index, 1);

      await chrome.storage.sync.set({ history: allHistory });
      renderHistory(filteredHistory);
      
      totalCount.textContent = `${allHistory.length}${t('urlsCountSuffix')}`;
      alert(t('successDeleted'));
    } catch (error) {
      console.error('Failed to delete URL:', error);
      alert(`${t('errorDelete')}: ${error.message}`);
    }
  };

  // Theme Management
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-emphasis);"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-emphasis);"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggleBtn) themeToggleBtn.innerHTML = sunSvg;
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) themeToggleBtn.innerHTML = moonSvg;
    }
  };

  const initTheme = async () => {
    const storedTheme = await chrome.storage.sync.get('themePreference');
    const activeTheme = storedTheme.themePreference || 'light';
    applyTheme(activeTheme);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', async () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      await chrome.storage.sync.set({ themePreference: newTheme });
    });
  }

  await initTheme();

  // Language Preferences Loading
  const stored = await chrome.storage.sync.get('languagePreference');
  const userLanguagePreference = stored.languagePreference || 'auto';
  activeLanguage = resolveLanguage(userLanguagePreference);
  applyTranslations();

  // Load history
  await loadHistory();

  // Search box listener
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      filterHistory(e.target.value);
    });
  }

  exportBtn.addEventListener('click', exportHistory);
  clearAllBtn.addEventListener('click', clearAllHistory);
  refreshStatsBtn.addEventListener('click', refreshStats);
  
  backLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
  });

  // F5 / Refresh key shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
      e.preventDefault();
      refreshStats();
    }
  });

  // Check if we need to auto-edit a specific item on launch
  const urlParams = new URLSearchParams(window.location.search);
  const editUrl = urlParams.get('edit');
  if (editUrl) {
    setTimeout(() => {
      const targetIndex = filteredHistory.findIndex(item => item.short === editUrl);
      if (targetIndex !== -1) {
        showEditForm(targetIndex);
        const editFormEl = document.getElementById(`edit-form-${targetIndex}`);
        if (editFormEl) {
          editFormEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 500);
  }
});
