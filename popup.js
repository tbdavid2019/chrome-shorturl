// Popup script
document.addEventListener('DOMContentLoaded', async () => {
  const historyList = document.getElementById('history-list');
  const optionsBtn = document.getElementById('options-btn');
  const shortenCurrentBtn = document.getElementById('shorten-current-btn');
  const shortenCustomBtn = document.getElementById('shorten-custom-btn');
  const customUrlInput = document.getElementById('custom-url');
  const customCommentInput = document.getElementById('custom-comment');
  const customSlugInput = document.getElementById('custom-slug');
  const expirationSelect = document.getElementById('expiration-select');
  const resultDiv = document.getElementById('result');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const viewAllBtn = document.getElementById('view-all-btn');
  const restoreLastTabBtn = document.getElementById('restore-last-tab-btn');
  const closedTabsList = document.getElementById('closed-tabs-list');

  // Format time ago
  const timeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
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
            restoreBtn.textContent = '↩️ Restore';
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
            restoreBtn.textContent = '↩️ Restore';
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
        noTabs.textContent = 'No recently closed tabs';
        closedTabsList.appendChild(noTabs);
      }
    } catch (error) {
      console.error('Error loading closed tabs:', error);
      closedTabsList.innerHTML = '<div class="no-history" style="padding: 10px;">Unable to load closed tabs</div>';
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
        resultDiv.innerHTML = '<strong>Info:</strong> No closed tabs to restore';
        resultDiv.style.display = 'block';
        setTimeout(() => {
          resultDiv.style.display = 'none';
        }, 2000);
      }
    } catch (error) {
      console.error('Error restoring tab:', error);
      resultDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
      resultDiv.style.display = 'block';
    }
  });

  // Load closed tabs
  await loadClosedTabs();

  let historyLoadSequence = 0;

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
        title.textContent = item.title || 'Untitled Page';
        title.title = item.title || item.original;
        
        // Add stats display
        const stats = document.createElement('div');
        stats.className = 'history-stats';
        stats.style.fontSize = '11px';
        stats.style.color = '#28a745';
        stats.style.marginBottom = '6px';
        stats.innerHTML = `📊 ${item.stats.visits} visits • ${item.stats.visitors} visitors • ${item.stats.referers} referers`;
        
        const links = document.createElement('div');
        links.className = 'history-links';
        
        const shortLink = document.createElement('a');
        shortLink.href = item.short;
        shortLink.textContent = item.short;
        shortLink.target = '_blank';
        shortLink.title = `Original: ${item.original}`;
        
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'copy-btn';
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(item.short);
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
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
        miniEditBtn.title = 'Edit this URL';
        miniEditBtn.onclick = (e) => {
          e.preventDefault();
          // Open history page with edit mode for this item
          const historyUrl = chrome.runtime.getURL('history.html') + `?edit=${encodeURIComponent(item.short)}`;
          chrome.tabs.create({ url: historyUrl });
        };
        
        const miniDeleteBtn = document.createElement('button');
        miniDeleteBtn.className = 'mini-btn delete';
        miniDeleteBtn.textContent = '🗑️';
        miniDeleteBtn.title = 'Delete this URL';
        miniDeleteBtn.onclick = async (e) => {
          e.preventDefault();
          if (confirm(`Delete this URL?\n${item.short}`)) {
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
      noHistory.textContent = 'No shortened URLs yet';
      historyList.appendChild(noHistory);
    }
  };

  await loadHistory();

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
        title: title || 'Untitled Page',
        comment: comment || '',
        slug: slug || '',
        expiration: expiration || '',
        createdAt: Date.now() 
      });
      if (history.length > 50) history.pop(); // Keep last 50 items
      await chrome.storage.sync.set({ history });

      // Show result
      resultDiv.innerHTML = `<strong>Short URL:</strong> <a href="${shortLink}" target="_blank">${shortLink}</a>`;
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

  // Shorten current page URL
  shortenCurrentBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const comment = `Page: ${tab.title}`;
    await shortenUrl(tab.url, tab.title, comment);
  });

  // Shorten custom URL
  shortenCustomBtn.addEventListener('click', async () => {
    const url = customUrlInput.value.trim();
    const comment = customCommentInput.value.trim();
    const slug = customSlugInput.value.trim();
    const expiration = expirationSelect.value;
    
    if (!url) {
      alert('Please enter a URL');
      return;
    }
    
    await shortenUrl(url, null, comment || 'Custom URL', slug, expiration);
    customUrlInput.value = '';
    customCommentInput.value = '';
    customSlugInput.value = '';
    expirationSelect.value = '';
  });

  // Clear history
  clearHistoryBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all history?')) {
      await chrome.storage.sync.set({ history: [] });
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
        alert('Please configure API settings first');
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
      resultDiv.innerHTML = '<strong>Success:</strong> URL deleted successfully';
      resultDiv.style.display = 'block';
      setTimeout(() => {
        resultDiv.style.display = 'none';
      }, 3000);
    } catch (error) {
      console.error('Failed to delete URL:', error);
      resultDiv.innerHTML = `<strong>Error:</strong> Failed to delete URL: ${error.message}`;
      resultDiv.style.display = 'block';
    }
  };
});
