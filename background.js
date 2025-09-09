// Background script for Chrome extension

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: "shorten-url",
    title: "Shorten URL",
    contexts: ["link"]
  });

  // Create context menu for page URL
  chrome.contextMenus.create({
    id: "shorten-page-url",
    title: "Shorten current page URL",
    contexts: ["page"]
  });

  // Set default settings if not exist
  chrome.storage.sync.get(['baseUrl', 'token'], (result) => {
    if (!result.baseUrl) {
      chrome.storage.sync.set({ baseUrl: 'https://aiurl.tw/api/link/create' });
    }
    if (!result.token) {
      chrome.storage.sync.set({ token: 'ToNf.360' }); // Updated default token for aiurl.tw
    }
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "shorten-url" || info.menuItemId === "shorten-page-url") {
    const url = info.menuItemId === "shorten-url" ? info.linkUrl : tab.url;

    // Get settings
    const { baseUrl, token, backupUrl, backupToken } = await chrome.storage.sync.get(['baseUrl', 'token', 'backupUrl', 'backupToken']);
    const apiUrl = baseUrl;
    const auth = `Bearer ${token}`;

    const tryShorten = async (url, apiUrl, auth) => {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'authorization': auth,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.link || !data.link.slug) {
        throw new Error('Invalid response: no link or slug field');
      }
      const base = apiUrl.replace('/api/link/create', '');
      const shortLink = base + '/' + data.link.slug;
      return { ...data, shortLink };
    };

    try {
      let data = await tryShorten(url, apiUrl, auth);
      let shortLink = data.shortLink;

      // If backup URL is set and primary failed, try backup
      if (!shortLink && backupUrl && backupToken) {
        try {
          data = await tryShorten(url, backupUrl, `Bearer ${backupToken}`);
          shortLink = data.shortLink;
        } catch (backupError) {
          console.error('Backup also failed:', backupError);
        }
      }

      if (shortLink) {
        // Copy to clipboard using chrome.scripting API
        try {
          const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (text) => {
              navigator.clipboard.writeText(text);
            },
            args: [shortLink]
          });
        } catch (clipboardError) {
          console.log('Clipboard write via scripting failed, using offscreen approach');
        }

        // Store history
        const result = await chrome.storage.sync.get('history');
        const history = result.history || [];
        history.unshift({ 
          original: url, 
          short: shortLink, 
          title: tab.title || 'Untitled Page',
          createdAt: Date.now() 
        });
        if (history.length > 50) history.pop(); // Keep last 50 items
        await chrome.storage.sync.set({ history });

        // Notify user
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'URL Shortened',
          message: `Short link copied: ${shortLink}`
        });
      } else {
        throw new Error('No short link generated');
      }

    } catch (error) {
      console.error('Error shortening URL:', error);
      console.error('URL attempted:', url);
      console.error('API URL:', apiUrl);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Error',
        message: `Failed to shorten URL: ${error.message}`
      });
    }
  }
});
