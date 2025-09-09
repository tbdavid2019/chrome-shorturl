// History page script
document.addEventListener('DOMContentLoaded', async () => {
  const historyContainer = document.getElementById('history-container');
  const emptyState = document.getElementById('empty-state');
  const totalCount = document.getElementById('total-count');
  const storageInfo = document.getElementById('storage-info');
  const searchBox = document.getElementById('search-box');
  const exportBtn = document.getElementById('export-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const backLink = document.getElementById('back-link');

  let allHistory = [];
  let filteredHistory = [];

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Calculate storage usage
  const getStorageInfo = async () => {
    try {
      const result = await chrome.storage.sync.getBytesInUse();
      const maxBytes = chrome.storage.sync.QUOTA_BYTES;
      const usedMB = (result / 1024 / 1024).toFixed(2);
      const maxMB = (maxBytes / 1024 / 1024).toFixed(1);
      return `${usedMB}MB / ${maxMB}MB used`;
    } catch (error) {
      return 'Storage info unavailable';
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text, button) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalText = button.textContent;
      button.textContent = 'Copied!';
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
      title.textContent = item.title || 'Untitled Page';
      title.title = item.title || item.original;
      
      const date = document.createElement('div');
      date.className = 'item-date';
      date.textContent = formatDate(item.createdAt);
      
      itemHeader.appendChild(title);
      itemHeader.appendChild(date);
      
      // Original URL
      const originalRow = document.createElement('div');
      originalRow.className = 'item-urls';
      
      const originalLabel = document.createElement('div');
      originalLabel.className = 'url-label';
      originalLabel.textContent = 'Original';
      
      const originalLink = document.createElement('a');
      originalLink.className = 'url-link';
      originalLink.href = item.original;
      originalLink.textContent = item.original;
      originalLink.target = '_blank';
      
      const originalCopyBtn = document.createElement('button');
      originalCopyBtn.className = 'copy-btn-small';
      originalCopyBtn.textContent = 'Copy';
      originalCopyBtn.onclick = () => copyToClipboard(item.original, originalCopyBtn);
      
      originalRow.appendChild(originalLabel);
      originalRow.appendChild(originalLink);
      originalRow.appendChild(originalCopyBtn);
      
      // Short URL
      const shortRow = document.createElement('div');
      shortRow.className = 'item-urls';
      
      const shortLabel = document.createElement('div');
      shortLabel.className = 'url-label';
      shortLabel.textContent = 'Short';
      
      const shortLink = document.createElement('a');
      shortLink.className = 'url-link';
      shortLink.href = item.short;
      shortLink.textContent = item.short;
      shortLink.target = '_blank';
      
      const shortCopyBtn = document.createElement('button');
      shortCopyBtn.className = 'copy-btn-small';
      shortCopyBtn.textContent = 'Copy';
      shortCopyBtn.onclick = () => copyToClipboard(item.short, shortCopyBtn);
      
      shortRow.appendChild(shortLabel);
      shortRow.appendChild(shortLink);
      shortRow.appendChild(shortCopyBtn);
      
      historyItem.appendChild(itemHeader);
      historyItem.appendChild(originalRow);
      historyItem.appendChild(shortRow);
      
      historyContainer.appendChild(historyItem);
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
      
      totalCount.textContent = `${allHistory.length} URLs`;
      storageInfo.textContent = await getStorageInfo();
      
      renderHistory(filteredHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
      historyContainer.innerHTML = '<div class="empty-state"><h3>Error loading history</h3></div>';
    }
  };

  // Export history
  const exportHistory = () => {
    if (allHistory.length === 0) {
      alert('No history to export');
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
      alert('No history to clear');
      return;
    }
    
    if (confirm(`Are you sure you want to delete all ${allHistory.length} URLs? This cannot be undone.`)) {
      try {
        await chrome.storage.sync.set({ history: [] });
        await loadHistory();
        alert('History cleared successfully');
      } catch (error) {
        console.error('Failed to clear history:', error);
        alert('Failed to clear history');
      }
    }
  };

  // Event listeners
  searchBox.addEventListener('input', (e) => {
    filterHistory(e.target.value);
  });

  exportBtn.addEventListener('click', exportHistory);
  clearAllBtn.addEventListener('click', clearAllHistory);
  
  backLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
  });

  // Initial load
  await loadHistory();
});
