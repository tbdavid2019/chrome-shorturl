// Popup script
document.addEventListener('DOMContentLoaded', async () => {
  const historyList = document.getElementById('history-list');
  const optionsBtn = document.getElementById('options-btn');
  const shortenCurrentBtn = document.getElementById('shorten-current-btn');
  const shortenCustomBtn = document.getElementById('shorten-custom-btn');
  const customUrlInput = document.getElementById('custom-url');
  const resultDiv = document.getElementById('result');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const viewAllBtn = document.getElementById('view-all-btn');

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

  // Load history
  const loadHistory = async () => {
    const { history } = await chrome.storage.sync.get('history');
    historyList.innerHTML = '';
    if (history && history.length > 0) {
      history.slice(0, 10).forEach(item => {
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
        
        content.appendChild(header);
        content.appendChild(title);
        content.appendChild(links);
        
        li.appendChild(content);
        historyList.appendChild(li);
      });
    } else {
      const noHistory = document.createElement('li');
      noHistory.className = 'no-history';
      noHistory.textContent = 'No shortened URLs yet';
      historyList.appendChild(noHistory);
    }
  };

  await loadHistory();

  // Shorten URL function
  const shortenUrl = async (url, title = null) => {
    try {
      // Get settings
      const { baseUrl, token } = await chrome.storage.sync.get(['baseUrl', 'token']);
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
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

      const base = baseUrl.replace('/api/link/create', '');
      const shortLink = base + '/' + data.link.slug;

      // Store history with title and timestamp
      const result = await chrome.storage.sync.get('history');
      const history = result.history || [];
      history.unshift({ 
        original: url, 
        short: shortLink, 
        title: title || 'Untitled Page',
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
    await shortenUrl(tab.url, tab.title);
  });

  // Shorten custom URL
  shortenCustomBtn.addEventListener('click', async () => {
    const url = customUrlInput.value.trim();
    if (!url) {
      alert('Please enter a URL');
      return;
    }
    await shortenUrl(url);
    customUrlInput.value = '';
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
});
