// Popup script
document.addEventListener('DOMContentLoaded', async () => {
  const translations = {
    en: {
      recentTabs: 'Recently Closed Tabs',
      restoreLast: 'Restore Last Closed Tab',
      shortenCurrentTitle: 'Shorten Current Page',
      shortenCurrentHint: 'One tap for the active tab',
      shortenCurrentBtn: 'Shorten URL',
      generateQr: 'Generate URL QR code',
      qrHint: 'QR code for your latest short link',
      qrNeedUrl: 'Please shorten a URL first',
      customTitle: 'Custom URL',
      customUrlPlaceholder: 'Enter any URL to shorten...',
      advancedShow: 'Show advanced options',
      advancedHide: 'Hide advanced options',
      commentPlaceholder: 'Add comment (optional)...',
      slugPlaceholder: 'Custom short code (optional)...',
      expireNone: 'No expiration',
      expire1h: '1 hour',
      expire24h: '24 hours',
      expire7d: '7 days',
      expire30d: '30 days',
      expire1y: '1 year',
      shortenCustomBtn: 'Shorten Custom URL',
      recentUrls: 'Recent URLs',
      recentBadge: 'Latest 10',
      recentSubtitle: 'Quick access to your last links',
      viewAll: 'View All',
      clear: 'Clear',
      settingsTitle: 'Settings',
      languageLabel: 'Language',
      languageAuto: 'Auto (detect)',
      languageEn: 'English',
      languageZh: '繁體中文',
      languageHint: 'Default follows your browser; override here anytime.',
      openSettings: 'Backend Settings',
      noClosedTabs: 'No recently closed tabs',
      closedTabsError: 'Unable to load closed tabs',
      infoNoClosed: 'Info: No closed tabs to restore',
      errorRestore: 'Error restoring tab:',
      restoreTab: 'Restore',
      noShortened: 'No shortened URLs yet',
      statsVisits: 'visits',
      statsVisitors: 'visitors',
      statsReferers: 'referers',
      copy: 'Copy',
      copied: 'Copied!',
      shortUrlLabel: 'Short URL:',
      enterUrlAlert: 'Please enter a URL',
      confirmDelete: 'Delete this URL?',
      deleteSuccess: 'Success: URL deleted successfully',
      deleteError: 'Error: Failed to delete URL:',
      timeDaySuffix: 'd ago',
      timeHourSuffix: 'h ago',
      timeMinuteSuffix: 'm ago',
      timeNow: 'Just now',
      confirmClearHistory: 'Are you sure you want to clear all history?',
      configureApi: 'Please configure API settings first',
      editTitle: 'Edit this URL',
      deleteTitle: 'Delete this URL',
      pageLabel: 'Page:',
      customDefaultComment: 'Custom URL',
      untitledPage: 'Untitled Page'
    },
    'zh-TW': {
      recentTabs: '復原關閉頁籤',
      restoreLast: '還原上一個關閉的分頁',
      shortenCurrentTitle: '縮短目前分頁',
      shortenCurrentHint: '一鍵縮短目前的頁面',
      shortenCurrentBtn: '縮短網址',
      generateQr: '產生網址QR code',
      qrHint: '為最新短網址產生 QR code',
      qrNeedUrl: '請先產生短網址',
      customTitle: '自訂網址',
      customUrlPlaceholder: '輸入想縮短的網址...',
      advancedShow: '展開進階參數',
      advancedHide: '收合進階參數',
      commentPlaceholder: '備註（選填）...',
      slugPlaceholder: '自訂短網址代碼（選填）...',
      expireNone: '不設定到期',
      expire1h: '1 小時',
      expire24h: '24 小時',
      expire7d: '7 天',
      expire30d: '30 天',
      expire1y: '1 年',
      shortenCustomBtn: '縮短自訂網址',
      recentUrls: '近期產生',
      recentBadge: '最新 10 筆',
      recentSubtitle: '快速存取最近的短網址',
      viewAll: '查看全部',
      clear: '清除',
      settingsTitle: '設定',
      languageLabel: '介面語言',
      languageAuto: '自動（跟隨瀏覽器）',
      languageEn: 'English',
      languageZh: '繁體中文',
      languageHint: '預設跟隨瀏覽器，可在此覆蓋設定。',
      openSettings: '後端設定',
      noClosedTabs: '沒有可還原的分頁',
      closedTabsError: '無法載入已關閉分頁',
      infoNoClosed: '沒有可還原的分頁',
      errorRestore: '復原分頁失敗：',
      restoreTab: '還原',
      noShortened: '尚未產生短網址',
      statsVisits: '次點擊',
      statsVisitors: '訪客',
      statsReferers: '來源',
      copy: '複製',
      copied: '已複製！',
      shortUrlLabel: '短網址：',
      enterUrlAlert: '請先輸入網址',
      confirmDelete: '刪除這筆短網址？',
      deleteSuccess: '刪除成功',
      deleteError: '刪除失敗：',
      timeDaySuffix: '天前',
      timeHourSuffix: '小時前',
      timeMinuteSuffix: '分鐘前',
      timeNow: '剛剛',
      confirmClearHistory: '確定清除全部歷史紀錄？',
      configureApi: '請先設定 API 與 Token',
      editTitle: '編輯這筆短網址',
      deleteTitle: '刪除這筆短網址',
      pageLabel: '頁面：',
      customDefaultComment: '自訂網址',
      untitledPage: '未命名頁面'
    }
  };

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

  const historyList = document.getElementById('history-list');
  const optionsBtn = document.getElementById('options-btn');
  const shortenCurrentBtn = document.getElementById('shorten-current-btn');
  const shortenCustomBtn = document.getElementById('shorten-custom-btn');
  const customUrlInput = document.getElementById('custom-url');
  const customCommentInput = document.getElementById('custom-comment');
  const customSlugInput = document.getElementById('custom-slug');
  const expirationSelect = document.getElementById('expiration-select');
  const languageSelect = document.getElementById('language-select');
  const advancedToggle = document.getElementById('advanced-toggle');
  const advancedFields = document.getElementById('advanced-fields');
  const resultDiv = document.getElementById('result');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const viewAllBtn = document.getElementById('view-all-btn');
  const restoreLastTabBtn = document.getElementById('restore-last-tab-btn');
  const closedTabsList = document.getElementById('closed-tabs-list');
  const generateQrBtn = document.getElementById('generate-qr-btn');
  const qrContainer = document.getElementById('qr-container');
  const qrCodeEl = document.getElementById('qr-code');
  const qrLinkEl = document.getElementById('qr-link');
  let activeLanguage = 'en';
  let userLanguagePreference = 'auto';
  let historyLoadSequence = 0;
  let isAdvancedOpen = false;
  let lastShortUrl = '';
  let qrInstance = null;

  const updateAdvancedToggleLabel = () => {
    const label = advancedToggle.querySelector('[data-i18n="advancedToggle"]');
    if (!label) return;
    label.textContent = isAdvancedOpen ? t('advancedHide') : t('advancedShow');
  };

  const applyTranslations = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (el.dataset.i18n === 'advancedToggle') return;
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const text = t(key);
      if (text) el.placeholder = text;
    });
    document.querySelectorAll('option[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    updateAdvancedToggleLabel();
  };

  const updateQrButtonState = () => {
    if (!generateQrBtn) return;
    const disabled = !lastShortUrl;
    generateQrBtn.disabled = disabled;
    generateQrBtn.style.opacity = disabled ? 0.6 : 1;
  };

  const setLastShortUrl = (url) => {
    lastShortUrl = url || '';
    updateQrButtonState();
    if (!lastShortUrl && qrContainer) {
      qrContainer.classList.add('hidden');
    }
  };

  const renderQr = (url) => {
    if (!qrContainer || !qrCodeEl || !qrLinkEl) return;
    if (!url) {
      alert(t('qrNeedUrl'));
      return;
    }

    qrContainer.classList.remove('hidden');
    qrCodeEl.innerHTML = '';
    if (qrInstance && typeof qrInstance.clear === 'function') {
      qrInstance.clear();
    }

    qrInstance = new QRCode(qrCodeEl, {
      text: url,
      width: 180,
      height: 180,
      correctLevel: QRCode.CorrectLevel.M,
      colorDark: '#0f172a',
      colorLight: '#ffffff'
    });

    qrLinkEl.textContent = url;
    qrLinkEl.href = url;
    qrLinkEl.title = url;
  };

  updateQrButtonState();

  const initLanguage = async () => {
    const stored = await chrome.storage.sync.get('languagePreference');
    userLanguagePreference = stored.languagePreference || 'auto';
    activeLanguage = resolveLanguage(userLanguagePreference);
    languageSelect.value = userLanguagePreference;
    applyTranslations();
  };

  // Format time ago
  const timeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}${t('timeDaySuffix')}`;
    if (hours > 0) return `${hours}${t('timeHourSuffix')}`;
    if (minutes > 0) return `${minutes}${t('timeMinuteSuffix')}`;
    return t('timeNow');
  };

  // Load recently closed tabs
  const loadClosedTabs = async () => {
    try {
      const sessions = await chrome.sessions.getRecentlyClosed({ maxResults: 10 });
      closedTabsList.innerHTML = '';
      
      if (sessions && sessions.length > 0) {
        sessions.forEach((session, index) => {
          if (session.tab) {
            const item = document.createElement('div');
            item.className = 'closed-tab-item';
            
            const info = document.createElement('div');
            info.className = 'closed-tab-info';
            
            const title = document.createElement('div');
            title.className = 'closed-tab-title';
            title.textContent = session.tab.title || 'Untitled';
            title.title = session.tab.title;
            
            const url = document.createElement('div');
            url.className = 'closed-tab-url';
            url.textContent = session.tab.url;
            url.title = session.tab.url;
            
            info.appendChild(title);
            info.appendChild(url);
            
            const time = document.createElement('div');
            time.className = 'closed-tab-time';
            time.textContent = timeAgo(session.lastModified * 1000);
            
            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'restore-btn';
            restoreBtn.textContent = '↩️ ' + t('restoreTab');
            restoreBtn.onclick = async (e) => {
              e.stopPropagation();
              await chrome.sessions.restore(session.tab.sessionId);
              await loadClosedTabs();
            };
            
            // Click on item to restore
            item.onclick = async () => {
              await chrome.sessions.restore(session.tab.sessionId);
              await loadClosedTabs();
            };
            
            item.appendChild(info);
            item.appendChild(time);
            item.appendChild(restoreBtn);
            
            closedTabsList.appendChild(item);
          } else if (session.window) {
            // Handle closed windows
            const item = document.createElement('div');
            item.className = 'closed-tab-item';
            item.style.background = '#e3f2fd';
            item.style.borderColor = '#2196f3';
            
            const info = document.createElement('div');
            info.className = 'closed-tab-info';
            
            const title = document.createElement('div');
            title.className = 'closed-tab-title';
            title.textContent = `🪟 Window with ${session.window.tabs.length} tabs`;
            
            info.appendChild(title);
            
            const time = document.createElement('div');
            time.className = 'closed-tab-time';
            time.textContent = timeAgo(session.lastModified * 1000);
            
            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'restore-btn';
            restoreBtn.style.background = '#2196f3';
            restoreBtn.textContent = '↩️ ' + t('restoreTab');
            restoreBtn.onclick = async (e) => {
              e.stopPropagation();
              await chrome.sessions.restore(session.window.sessionId);
              await loadClosedTabs();
            };
            
            item.onclick = async () => {
              await chrome.sessions.restore(session.window.sessionId);
              await loadClosedTabs();
            };
            
            item.appendChild(info);
            item.appendChild(time);
            item.appendChild(restoreBtn);
            
            closedTabsList.appendChild(item);
          }
        });
      } else {
        const noTabs = document.createElement('div');
        noTabs.className = 'no-history';
        noTabs.style.padding = '10px';
        noTabs.textContent = t('noClosedTabs');
        closedTabsList.appendChild(noTabs);
      }
    } catch (error) {
      console.error('Error loading closed tabs:', error);
      closedTabsList.innerHTML = `<div class="no-history" style="padding: 10px;">${t('closedTabsError')}</div>`;
    }
  };

  // Restore last closed tab
  restoreLastTabBtn.addEventListener('click', async () => {
    try {
      const sessions = await chrome.sessions.getRecentlyClosed({ maxResults: 1 });
      if (sessions && sessions.length > 0) {
        const session = sessions[0];
        if (session.tab) {
          await chrome.sessions.restore(session.tab.sessionId);
        } else if (session.window) {
          await chrome.sessions.restore(session.window.sessionId);
        }
        await loadClosedTabs();
      } else {
        resultDiv.innerHTML = `<strong>${t('infoNoClosed')}</strong>`;
        resultDiv.style.display = 'block';
        setTimeout(() => {
          resultDiv.style.display = 'none';
        }, 2000);
      }
    } catch (error) {
      console.error('Error restoring tab:', error);
      resultDiv.innerHTML = `<strong>${t('errorRestore')}</strong> ${error.message}`;
      resultDiv.style.display = 'block';
    }
  });

  // Load closed tabs
  // moved to post-language init

  // Load history
  const loadHistory = async () => {
    const loadId = ++historyLoadSequence;
    const { history, baseUrl, token } = await chrome.storage.sync.get(['history', 'baseUrl', 'token']);
    historyList.innerHTML = '';

    // If a newer load request started while awaiting storage, abort this render
    if (loadId !== historyLoadSequence) {
      return;
    }

    if (history && history.length > 0) {
      const recentHistory = history.slice(0, 10);
      if (!lastShortUrl) {
        setLastShortUrl(recentHistory[0].short);
      }
      
      // Load stats for each URL in parallel
      const historyWithStats = await Promise.all(
        recentHistory.map(async (item) => {
          const stats = await getUrlStats(item.short, baseUrl, token);
          return { ...item, stats };
        })
      );

      if (loadId !== historyLoadSequence) {
        return;
      }
      
      historyWithStats.forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const content = document.createElement('div');
        content.className = 'history-content';
        
        const header = document.createElement('div');
        header.className = 'history-header';
        header.innerHTML = `<span>${timeAgo(item.createdAt)}</span>`;
        
        const title = document.createElement('div');
        title.className = 'history-title';
        title.textContent = item.title || t('untitledPage');
        title.title = item.title || item.original;
        
        // Add stats display
        const stats = document.createElement('div');
        stats.className = 'history-stats';
        stats.style.fontSize = '11px';
        stats.style.color = '#28a745';
        stats.style.marginBottom = '6px';
        stats.innerHTML = `📊 ${item.stats.visits} ${t('statsVisits')} • ${item.stats.visitors} ${t('statsVisitors')} • ${item.stats.referers} ${t('statsReferers')}`;
        
        const links = document.createElement('div');
        links.className = 'history-links';
        
        const shortLink = document.createElement('a');
        shortLink.href = item.short;
        shortLink.textContent = item.short;
        shortLink.target = '_blank';
        shortLink.title = `Original: ${item.original}`;
        
        const copyBtn = document.createElement('button');
        copyBtn.textContent = t('copy');
        copyBtn.className = 'copy-btn';
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(item.short);
          copyBtn.textContent = t('copied');
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = t('copy');
            copyBtn.classList.remove('copied');
          }, 1500);
        };
        
        links.appendChild(shortLink);
        links.appendChild(copyBtn);
        
        // Add mini delete button
        const historyActions = document.createElement('div');
        historyActions.className = 'history-actions';
        
        const miniEditBtn = document.createElement('button');
        miniEditBtn.className = 'mini-btn';
        miniEditBtn.textContent = '✏️';
        miniEditBtn.title = t('editTitle');
        miniEditBtn.onclick = (e) => {
          e.preventDefault();
          // Open history page with edit mode for this item
          const historyUrl = chrome.runtime.getURL('history.html') + `?edit=${encodeURIComponent(item.short)}`;
          chrome.tabs.create({ url: historyUrl });
        };
        
        const miniDeleteBtn = document.createElement('button');
        miniDeleteBtn.className = 'mini-btn delete';
        miniDeleteBtn.textContent = '🗑️';
        miniDeleteBtn.title = t('deleteTitle');
        miniDeleteBtn.onclick = async (e) => {
          e.preventDefault();
          if (confirm(`${t('confirmDelete')}\n${item.short}`)) {
            await deleteUrlFromPopup(item);
          }
        };
        
        historyActions.appendChild(miniEditBtn);
        historyActions.appendChild(miniDeleteBtn);
        
        content.appendChild(header);
        content.appendChild(title);
        content.appendChild(stats);
        content.appendChild(links);
        content.appendChild(historyActions);
        
        li.appendChild(content);
        historyList.appendChild(li);
      });
    } else {
      if (loadId !== historyLoadSequence) {
        return;
      }

      const noHistory = document.createElement('li');
      noHistory.className = 'no-history';
      noHistory.textContent = t('noShortened');
      historyList.appendChild(noHistory);
    }
  };

  // Shorten URL function
  const shortenUrl = async (url, title = null, comment = null, slug = null, expiration = null) => {
    try {
      // Get settings
      const { baseUrl, token } = await chrome.storage.sync.get(['baseUrl', 'token']);
      
      // Prepare request body
      const requestBody = { url };
      if (comment) {
        requestBody.comment = comment;
      }
      if (slug) {
        requestBody.slug = slug;
      }
      if (expiration) {
        requestBody.expiration = expiration;
      }
      
      const response = await fetch(baseUrl, {
        method: 'POST',
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
      if (!data.link || !data.link.slug) {
        throw new Error('Invalid response: no link or slug field');
      }

      const base = baseUrl.replace('/api/link/create', '');
      const shortLink = base + '/' + data.link.slug;

      // Store history with title, comment and timestamp
      const result = await chrome.storage.sync.get('history');
      const history = result.history || [];
      history.unshift({ 
        original: url, 
        short: shortLink, 
        title: title || t('untitledPage'),
        comment: comment || '',
        slug: slug || '',
        expiration: expiration || '',
        createdAt: Date.now() 
      });
      if (history.length > 50) history.pop(); // Keep last 50 items
      await chrome.storage.sync.set({ history });

      setLastShortUrl(shortLink);
      if (qrContainer) {
        qrContainer.classList.add('hidden');
      }

      // Show result
      resultDiv.innerHTML = `<strong>${t('shortUrlLabel')}</strong> <a href="${shortLink}" target="_blank">${shortLink}</a>`;
      resultDiv.style.display = 'block';

      // Copy to clipboard
      await navigator.clipboard.writeText(shortLink);

      // Reload history
      await loadHistory();

      return shortLink;
    } catch (error) {
      console.error('Error shortening URL:', error);
      resultDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
      resultDiv.style.display = 'block';
      throw error;
    }
  };

  generateQrBtn.addEventListener('click', () => {
    if (!lastShortUrl) {
      alert(t('qrNeedUrl'));
      return;
    }
    renderQr(lastShortUrl);
  });

  // Shorten current page URL
  shortenCurrentBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const comment = `${t('pageLabel')} ${tab.title}`;
    await shortenUrl(tab.url, tab.title, comment);
  });

  // Shorten custom URL
  shortenCustomBtn.addEventListener('click', async () => {
    const url = customUrlInput.value.trim();
    const comment = customCommentInput.value.trim();
    const slug = customSlugInput.value.trim();
    const expiration = expirationSelect.value;
    
    if (!url) {
      alert(t('enterUrlAlert'));
      return;
    }
    
    await shortenUrl(url, null, comment || t('customDefaultComment'), slug, expiration);
    customUrlInput.value = '';
    customCommentInput.value = '';
    customSlugInput.value = '';
    expirationSelect.value = '';
  });

  // Clear history
  clearHistoryBtn.addEventListener('click', async () => {
    if (confirm(t('confirmClearHistory'))) {
      await chrome.storage.sync.set({ history: [] });
      setLastShortUrl('');
      if (qrContainer) {
        qrContainer.classList.add('hidden');
      }
      await loadHistory();
    }
  });

  // View all history
  viewAllBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('history.html') });
  });

  // Options button
  optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Delete URL from popup
  const deleteUrlFromPopup = async (item) => {
    try {
      const { baseUrl, token, history } = await chrome.storage.sync.get(['baseUrl', 'token', 'history']);
      
      if (!baseUrl || !token) {
        alert(t('configureApi'));
        return;
      }

      // Extract slug from short URL
      const urlParts = item.short.split('/');
      const slug = urlParts[urlParts.length - 1];

      // Prepare delete API URL
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

      // Remove from history
      const updatedHistory = (history || []).filter(historyItem => historyItem.short !== item.short);

      // Save to storage
      await chrome.storage.sync.set({ history: updatedHistory });

      // Reload history display
      await loadHistory();
      
      // Show success message
      resultDiv.innerHTML = `<strong>${t('deleteSuccess')}</strong>`;
      resultDiv.style.display = 'block';
      setTimeout(() => {
        resultDiv.style.display = 'none';
      }, 3000);
    } catch (error) {
      console.error('Failed to delete URL:', error);
      resultDiv.innerHTML = `<strong>${t('deleteError')}</strong> ${error.message}`;
      resultDiv.style.display = 'block';
    }
  };

  // Advanced fields toggle
  advancedToggle.addEventListener('click', () => {
    isAdvancedOpen = !isAdvancedOpen;
    advancedFields.classList.toggle('open', isAdvancedOpen);
    updateAdvancedToggleLabel();
  });

  // Language select
  languageSelect.addEventListener('change', async () => {
    userLanguagePreference = languageSelect.value;
    await chrome.storage.sync.set({ languagePreference: userLanguagePreference });
    activeLanguage = resolveLanguage(userLanguagePreference);
    applyTranslations();
    await loadClosedTabs();
    await loadHistory();
  });

  await initLanguage();
  await loadClosedTabs();
  await loadHistory();
});
