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
      untitledPage: 'Untitled Page',
      downloadQr: 'Download QR Code',
      shortening: 'Shortening...',
      popupTitle: 'Short URL & Restore',
      showMore: 'Show More (+)'
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
      untitledPage: '未命名頁面',
      downloadQr: '下載 QR Code',
      shortening: '縮短中...',
      popupTitle: '縮網址與還原分頁',
      showMore: '顯示更多分頁 (+)'
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
    const stored = await chrome.storage.sync.get('themePreference');
    const activeTheme = stored.themePreference || 'light';
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

  let closedTabsMaxResults = 5;
  let sessionsCache = [];

  // Load recently closed tabs
  const loadClosedTabs = async () => {
    try {
      sessionsCache = await chrome.sessions.getRecentlyClosed({ maxResults: 25 });
      renderClosedTabs();
    } catch (error) {
      console.error('Error loading closed tabs:', error);
      closedTabsList.innerHTML = `<div class="no-history" style="padding: 10px;">${t('closedTabsError')}</div>`;
    }
  };

  const renderClosedTabs = () => {
    closedTabsList.innerHTML = '';
    
    if (sessionsCache && sessionsCache.length > 0) {
      const visibleSessions = sessionsCache.slice(0, closedTabsMaxResults);
      
      visibleSessions.forEach((session) => {
        if (session.tab) {
          const item = document.createElement('div');
          item.className = 'closed-tab-item';
          
          // Tab favicon support
          const favicon = document.createElement('img');
          favicon.className = 'closed-tab-favicon';
          favicon.style.width = '16px';
          favicon.style.height = '16px';
          favicon.style.borderRadius = '4px';
          favicon.style.flexShrink = '0';
          
          if (session.tab.favIconUrl && (session.tab.favIconUrl.startsWith('http') || session.tab.favIconUrl.startsWith('data:'))) {
            favicon.src = session.tab.favIconUrl;
          } else {
            try {
              const domain = new URL(session.tab.url).hostname;
              favicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
            } catch (e) {
              favicon.src = 'icons/icon16.png';
            }
          }
          
          favicon.onerror = () => {
            favicon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%236b7280" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M7.5 1.018a7 7 0 0 1-.83 2.118A7 7 0 0 0 5.074 1.488zm1 0 .256.256c.386.72.964 1.324 1.634 1.748L8.5 3.048zm-1 3.03a6 6 0 0 1 .83-2.118l-.256-.256a7 7 0 0 0-1.634 1.748zM5.074 1.488a7 7 0 0 0-1.634 1.748l.366.366h1.268zm3.016-1.37H12.5v-2.012c-.116.003-.23.014-.34.03l-.22 2.012z"/></svg>';
          };
          
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
          restoreBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>${t('restoreTab')}`;
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
          
          item.appendChild(favicon);
          item.appendChild(info);
          item.appendChild(time);
          item.appendChild(restoreBtn);
          
          closedTabsList.appendChild(item);
        } else if (session.window) {
          // Handle closed windows
          const item = document.createElement('div');
          item.className = 'closed-tab-item';
          
          const favicon = document.createElement('span');
          favicon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #2196f3; vertical-align: middle;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`;
          favicon.style.display = 'inline-flex';
          favicon.style.alignItems = 'center';
          favicon.style.flexShrink = '0';
          
          const info = document.createElement('div');
          info.className = 'closed-tab-info';
          
          const title = document.createElement('div');
          title.className = 'closed-tab-title';
          title.textContent = `Window with ${session.window.tabs.length} tabs`;
          
          info.appendChild(title);
          
          const time = document.createElement('div');
          time.className = 'closed-tab-time';
          time.textContent = timeAgo(session.lastModified * 1000);
          
          const restoreBtn = document.createElement('button');
          restoreBtn.className = 'restore-btn';
          restoreBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>${t('restoreTab')}`;
          restoreBtn.onclick = async (e) => {
            e.stopPropagation();
            await chrome.sessions.restore(session.window.sessionId);
            await loadClosedTabs();
          };
          
          item.onclick = async () => {
            await chrome.sessions.restore(session.window.sessionId);
            await loadClosedTabs();
          };
          
          item.appendChild(favicon);
          item.appendChild(info);
          item.appendChild(time);
          item.appendChild(restoreBtn);
          
          closedTabsList.appendChild(item);
        }
      });

      // Append Show More button if there are more sessions
      if (sessionsCache.length > closedTabsMaxResults) {
        const showMoreDiv = document.createElement('div');
        showMoreDiv.style.textAlign = 'center';
        showMoreDiv.style.marginTop = '6px';
        
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'button secondary';
        showMoreBtn.style.width = 'auto';
        showMoreBtn.style.padding = '4px 10px';
        showMoreBtn.style.fontSize = '11px';
        showMoreBtn.style.borderRadius = '6px';
        showMoreBtn.style.cursor = 'pointer';
        showMoreBtn.style.display = 'inline-flex';
        showMoreBtn.style.alignItems = 'center';
        showMoreBtn.style.gap = '4px';
        showMoreBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> ${t('showMore')}`;
        
        showMoreBtn.onclick = (e) => {
          e.preventDefault();
          closedTabsMaxResults += 5;
          renderClosedTabs();
        };
        
        showMoreDiv.appendChild(showMoreBtn);
        closedTabsList.appendChild(showMoreDiv);
      }
    } else {
      const noTabs = document.createElement('div');
      noTabs.className = 'no-history';
      noTabs.style.padding = '10px';
      noTabs.textContent = t('noClosedTabs');
      closedTabsList.appendChild(noTabs);
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
        
        stats.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px; color: var(--green-dark);"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>${item.stats.visits} ${t('statsVisits')} • ${item.stats.visitors} ${t('statsVisitors')} • ${item.stats.referers} ${t('statsReferers')}`;
        
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
        miniEditBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
        miniEditBtn.title = t('editTitle');
        miniEditBtn.onclick = (e) => {
          e.preventDefault();
          // Open history page with edit mode for this item
          const historyUrl = chrome.runtime.getURL('history.html') + `?edit=${encodeURIComponent(item.short)}`;
          chrome.tabs.create({ url: historyUrl });
        };
        
        const miniDeleteBtn = document.createElement('button');
        miniDeleteBtn.className = 'mini-btn delete';
        miniDeleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
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
    // Disable shorten buttons and show loading state
    const originalCurrentText = shortenCurrentBtn.innerHTML;
    const originalCustomText = shortenCustomBtn.innerHTML;
    shortenCurrentBtn.disabled = true;
    shortenCustomBtn.disabled = true;
    shortenCurrentBtn.style.opacity = '0.6';
    shortenCustomBtn.style.opacity = '0.6';
    shortenCurrentBtn.innerHTML = `⏳ ${t('shortening')}`;
    shortenCustomBtn.innerHTML = `⏳ ${t('shortening')}`;

    try {
      // Get settings
      const { baseUrl, token, backupUrl, backupToken } = await chrome.storage.sync.get(['baseUrl', 'token', 'backupUrl', 'backupToken']);
      
      const tryShorten = async (apiUrl, apiToken) => {
        // Auto-prepend protocol if missing
        let targetUrl = url;
        if (!/^https?:\/\//i.test(targetUrl)) {
          targetUrl = 'https://' + targetUrl;
        }

        // Prepare request body
        const requestBody = { url: targetUrl };
        if (comment) requestBody.comment = comment;
        if (slug) requestBody.slug = slug;
        if (expiration) requestBody.expiration = expiration;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${apiToken}`,
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

        const base = apiUrl.replace('/api/link/create', '');
        return base + '/' + data.link.slug;
      };

      let shortLink;
      try {
        shortLink = await tryShorten(baseUrl, token);
      } catch (primaryError) {
        console.warn('Primary shortening failed, trying backup API if configured...', primaryError);
        if (backupUrl && backupToken) {
          try {
            shortLink = await tryShorten(backupUrl, backupToken);
          } catch (backupError) {
            console.error('Backup shortening also failed:', backupError);
            throw new Error(`Primary API failed (${primaryError.message}) & Backup API also failed (${backupError.message})`);
          }
        } else {
          throw primaryError;
        }
      }

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
    } finally {
      // Restore button states
      shortenCurrentBtn.disabled = false;
      shortenCustomBtn.disabled = false;
      shortenCurrentBtn.style.opacity = '1';
      shortenCustomBtn.style.opacity = '1';
      shortenCurrentBtn.innerHTML = originalCurrentText;
      shortenCustomBtn.innerHTML = originalCustomText;
    }
  };

  generateQrBtn.addEventListener('click', () => {
    if (!lastShortUrl) {
      alert(t('qrNeedUrl'));
      return;
    }
    renderQr(lastShortUrl);
  });

  // Download QR Code Click Event
  const downloadQrBtn = document.getElementById('download-qr-btn');
  if (downloadQrBtn) {
    downloadQrBtn.addEventListener('click', () => {
      const img = qrCodeEl.querySelector('img');
      const canvas = qrCodeEl.querySelector('canvas');
      
      let dataUrl = '';
      if (img && img.src) {
        dataUrl = img.src;
      } else if (canvas) {
        dataUrl = canvas.toDataURL('image/png');
      }
      
      if (dataUrl) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert(t('qrNeedUrl'));
      }
    });
  }

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

  // Keyboard shortcut: Press Enter inside custom URL input to shorten
  if (customUrlInput) {
    customUrlInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        shortenCustomBtn.click();
      }
    });
  }

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
