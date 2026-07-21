// Options script with robust element handling and i18n support
document.addEventListener('DOMContentLoaded', async () => {
  const translations = {
    en: {
      optionsTitle: 'Short URL Settings',
      settingsTitle: 'Short URL Settings',
      settingsSubtitle: 'Configure your shortening APIs and service tokens',
      primaryApiTitle: 'Primary API Settings',
      primaryBaseUrlLabel: 'Base URL:',
      primaryTokenLabel: 'Authorization Token:',
      backupApiTitle: 'Backup API Settings (Optional)',
      backupBaseUrlLabel: 'Backup Base URL:',
      backupTokenLabel: 'Backup Authorization Token:',
      saveBtn: 'Save Settings',
      customApiSupportTitle: 'Custom API Support',
      customApiSupportDesc: 'To use custom APIs outside of default domains, you need to grant host permissions.',
      enableCustomApisBtn: 'Enable Custom APIs',
      customApisEnabled: '✅ Custom APIs Enabled',
      customApisNotEnabled: '⚠️ Custom APIs not enabled',
      customApisSuccess: '✅ Custom APIs enabled successfully!',
      permissionDenied: '❌ Permission denied',
      permissionError: '❌ Error requesting permissions',
      settingsSaved: 'Settings saved!',
      tokenPlaceholder: 'Enter primary authorization token',
      backupTokenPlaceholder: 'Enter backup authorization token',
    },
    'zh-TW': {
      optionsTitle: '短網址設定',
      settingsTitle: '短網址設定',
      settingsSubtitle: '設定您的短網址 API 串接與驗證金鑰',
      primaryApiTitle: '主要 API 設定',
      primaryBaseUrlLabel: 'API 端點 (Base URL)：',
      primaryTokenLabel: '授權 Token：',
      backupApiTitle: '備用 API 設定（選填）',
      backupBaseUrlLabel: '備用 API 端點：',
      backupTokenLabel: '備用授權 Token：',
      saveBtn: '儲存設定',
      customApiSupportTitle: '自訂 API 支援',
      customApiSupportDesc: '如欲在 aiurl.tw 與 glsoft.ai 之外使用自訂 API，需先啟用主機連線權限。',
      enableCustomApisBtn: '啟用自訂 API',
      customApisEnabled: '✅ 已啟用自訂 API 權限',
      customApisNotEnabled: '⚠️ 自訂 API 權限尚未啟用',
      customApisSuccess: '✅ 成功啟用自訂 API 權限！',
      permissionDenied: '❌ 授權失敗：用戶拒絕',
      permissionError: '❌ 請求權限出錯',
      settingsSaved: '設定已儲存！',
      tokenPlaceholder: '輸入主要 API 驗證 Token',
      backupTokenPlaceholder: '輸入備用 API 驗證 Token',
    }
  };

  const baseUrlInput = document.getElementById('base-url');
  const tokenInput = document.getElementById('token');
  const backupUrlInput = document.getElementById('backup-url');
  const backupTokenInput = document.getElementById('backup-token');
  const saveBtn = document.getElementById('save-btn');
  const status = document.getElementById('status');
  const toggleTokenBtn = document.getElementById('toggle-token');
  const toggleBackupTokenBtn = document.getElementById('toggle-backup-token');
  const requestPermissionsBtn = document.getElementById('request-permissions-btn');
  const permissionsStatus = document.getElementById('permissions-status');
  const languageSelect = document.getElementById('language-select');

  let activeLanguage = 'en';
  let userLanguagePreference = 'auto';

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

    if (tokenInput) tokenInput.placeholder = t('tokenPlaceholder');
    if (backupTokenInput) backupTokenInput.placeholder = t('backupTokenPlaceholder');

    // Update permissions status label dynamically
    checkPermissions();
  };

  const eyeOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeClosedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  // Toggle password visibility
  const togglePasswordVisibility = (input, button) => {
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      button.innerHTML = eyeClosedSvg;
    } else {
      input.type = 'password';
      button.innerHTML = eyeOpenSvg;
    }
  };

  if (toggleTokenBtn && tokenInput) {
    toggleTokenBtn.addEventListener('click', () => {
      togglePasswordVisibility(tokenInput, toggleTokenBtn);
    });
  }

  if (toggleBackupTokenBtn && backupTokenInput) {
    toggleBackupTokenBtn.addEventListener('click', () => {
      togglePasswordVisibility(backupTokenInput, toggleBackupTokenBtn);
    });
  }

  // Load current settings
  const { baseUrl, token, backupUrl, backupToken, languagePreference } = await chrome.storage.sync.get([
    'baseUrl', 'token', 'backupUrl', 'backupToken', 'languagePreference'
  ]);
  
  if (baseUrlInput) baseUrlInput.value = baseUrl || 'https://aiurl.tw/api/link/create';
  if (tokenInput) tokenInput.value = token || '';
  if (backupUrlInput) backupUrlInput.value = backupUrl || '';
  if (backupTokenInput) backupTokenInput.value = backupToken || '';

  // Language Preference Initialization
  userLanguagePreference = languagePreference || 'auto';
  if (languageSelect) languageSelect.value = userLanguagePreference;
  activeLanguage = resolveLanguage(userLanguagePreference);
  applyTranslations();

  if (languageSelect) {
    languageSelect.addEventListener('change', async () => {
      userLanguagePreference = languageSelect.value;
      await chrome.storage.sync.set({ languagePreference: userLanguagePreference });
      activeLanguage = resolveLanguage(userLanguagePreference);
      applyTranslations();
    });
  }

  // Save settings
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const newBaseUrl = baseUrlInput ? baseUrlInput.value.trim() : '';
      const newToken = tokenInput ? tokenInput.value.trim() : '';
      const newBackupUrl = backupUrlInput ? backupUrlInput.value.trim() : '';
      const newBackupToken = backupTokenInput ? backupTokenInput.value.trim() : '';

      await chrome.storage.sync.set({
        baseUrl: newBaseUrl,
        token: newToken,
        backupUrl: newBackupUrl,
        backupToken: newBackupToken
      });

      if (status) {
        status.textContent = t('settingsSaved');
        status.style.opacity = '1';
        setTimeout(() => {
          status.style.opacity = '0';
        }, 2000);
      }
    });
  }

  // Check current permissions status
  const checkPermissions = async () => {
    if (!permissionsStatus || !requestPermissionsBtn) return;
    try {
      const hasPermissions = await chrome.permissions.contains({
        origins: ['https://*/*']
      });
      
      if (hasPermissions) {
        permissionsStatus.textContent = t('customApisEnabled');
        permissionsStatus.style.color = '#15a34a';
        requestPermissionsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>${t('customApisEnabled')}`;
        requestPermissionsBtn.disabled = true;
      } else {
        permissionsStatus.textContent = t('customApisNotEnabled');
        permissionsStatus.style.color = '#d97706';
        requestPermissionsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>${t('enableCustomApisBtn')}`;
        requestPermissionsBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  // Request optional permissions
  if (requestPermissionsBtn) {
    requestPermissionsBtn.addEventListener('click', async () => {
      try {
        const granted = await chrome.permissions.request({
          origins: ['https://*/*']
        });
        
        if (granted) {
          if (permissionsStatus) {
            permissionsStatus.textContent = t('customApisSuccess');
            permissionsStatus.style.color = '#15a34a';
          }
          requestPermissionsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>${t('customApisEnabled')}`;
          requestPermissionsBtn.disabled = true;
        } else {
          if (permissionsStatus) {
            permissionsStatus.textContent = t('permissionDenied');
            permissionsStatus.style.color = '#dc2626';
          }
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        if (permissionsStatus) {
          permissionsStatus.textContent = t('permissionError');
          permissionsStatus.style.color = '#dc2626';
        }
      }
    });
  }

  // Theme Management
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

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

  // Initial permissions check
  checkPermissions();
});
