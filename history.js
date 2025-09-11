// History page script
document.addEventListener('DOMContentLoaded', async () => {
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
      historyItem.appendChild(itemHeader);
      
      // Comment (if exists)
      if (item.comment && item.comment.trim()) {
        const commentDiv = document.createElement('div');
        commentDiv.style.fontSize = '12px';
        commentDiv.style.color = '#6c757d';
        commentDiv.style.fontStyle = 'italic';
        commentDiv.style.marginBottom = '8px';
        commentDiv.textContent = `💬 ${item.comment}`;
        historyItem.appendChild(commentDiv);
      }
      
      // Custom slug info (if exists)
      if (item.slug && item.slug.trim()) {
        const slugDiv = document.createElement('div');
        slugDiv.style.fontSize = '12px';
        slugDiv.style.color = '#007bff';
        slugDiv.style.fontStyle = 'italic';
        slugDiv.style.marginBottom = '8px';
        slugDiv.textContent = `🎯 Custom slug: ${item.slug}`;
        historyItem.appendChild(slugDiv);
      }
      
      // Expiration info (if exists)
      if (item.expiration && item.expiration.trim()) {
        const expirationDiv = document.createElement('div');
        expirationDiv.style.fontSize = '12px';
        expirationDiv.style.color = '#fd7e14';
        expirationDiv.style.fontStyle = 'italic';
        expirationDiv.style.marginBottom = '8px';
        expirationDiv.textContent = `⏰ Expires: ${item.expiration}`;
        historyItem.appendChild(expirationDiv);
      }
      
      // Statistics (if available)
      if (item.stats) {
        const statsDiv = document.createElement('div');
        statsDiv.style.fontSize = '12px';
        statsDiv.style.color = '#28a745';
        statsDiv.style.fontWeight = '600';
        statsDiv.style.marginBottom = '8px';
        statsDiv.innerHTML = `📊 ${item.stats.visits} visits • ${item.stats.visitors} visitors • ${item.stats.referers} referers`;
        historyItem.appendChild(statsDiv);
      }
      
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
      
      // Action buttons
      const actionButtons = document.createElement('div');
      actionButtons.className = 'action-buttons';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'action-btn edit';
      editBtn.textContent = '✏️ Edit';
      editBtn.onclick = () => showEditForm(historyItem, item, index);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'action-btn delete';
      deleteBtn.textContent = '🗑️ Delete';
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
        <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #495057;">Edit URL</h4>
        <input type="text" class="edit-input" id="edit-url-${index}" placeholder="URL" value="${item.original}">
        <input type="text" class="edit-input" id="edit-comment-${index}" placeholder="Comment" value="${item.comment || ''}">
        <input type="text" class="edit-input" id="edit-slug-${index}" placeholder="Custom slug" value="${item.slug || ''}">
        <select class="edit-input" id="edit-expiration-${index}">
          <option value="">No expiration</option>
          <option value="1h" ${item.expiration === '1h' ? 'selected' : ''}>1 hour</option>
          <option value="24h" ${item.expiration === '24h' ? 'selected' : ''}>24 hours</option>
          <option value="7d" ${item.expiration === '7d' ? 'selected' : ''}>7 days</option>
          <option value="30d" ${item.expiration === '30d' ? 'selected' : ''}>30 days</option>
          <option value="1y" ${item.expiration === '1y' ? 'selected' : ''}>1 year</option>
        </select>
        <div class="edit-buttons">
          <button class="edit-btn save" onclick="saveEdit(${index})">💾 Save</button>
          <button class="edit-btn cancel" onclick="cancelEdit(${index})">❌ Cancel</button>
        </div>
      `;
      
      historyItem.appendChild(editForm);
      
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

  // Refresh statistics for all URLs
  const refreshStats = async () => {
    refreshStatsBtn.textContent = '🔄 Loading...';
    refreshStatsBtn.disabled = true;

    try {
      // First, reload the history from storage to get any new items
      refreshStatsBtn.textContent = '📥 Loading history...';
      const { history } = await chrome.storage.sync.get('history');
      allHistory = history || [];
      
      if (allHistory.length === 0) {
        alert('No URLs found');
        return;
      }

      const { baseUrl, token } = await chrome.storage.sync.get(['baseUrl', 'token']);
      
      if (!baseUrl || !token) {
        // If no API settings, just reload without stats
        filteredHistory = [...allHistory];
        renderHistory(filteredHistory);
        totalCount.textContent = `${allHistory.length} URLs`;
        storageInfo.textContent = await getStorageInfo();
        
        // Show success message in the page
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 12px 20px; border-radius: 6px; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
        successMsg.textContent = 'History reloaded (API not configured for stats)';
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
        return;
      }

      // Update stats for all history items
      refreshStatsBtn.textContent = `📊 Loading stats (0/${allHistory.length})...`;
      
      const updatedHistory = await Promise.all(
        allHistory.map(async (item, index) => {
          const stats = await getUrlStats(item.short, baseUrl, token);
          refreshStatsBtn.textContent = `📊 Loading stats (${index + 1}/${allHistory.length})...`;
          return { ...item, stats };
        })
      );

      // Save updated history with stats
      refreshStatsBtn.textContent = '💾 Saving...';
      await chrome.storage.sync.set({ history: updatedHistory });
      
      // Reload display
      allHistory = updatedHistory;
      filteredHistory = [...allHistory];
      renderHistory(filteredHistory);
      
      // Update counts
      totalCount.textContent = `${allHistory.length} URLs`;
      storageInfo.textContent = await getStorageInfo();
      
      // Show success message in the page
      const successMsg = document.createElement('div');
      successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 12px 20px; border-radius: 6px; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
      successMsg.textContent = `✅ ${allHistory.length} URLs refreshed successfully`;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
      
    } catch (error) {
      console.error('Failed to refresh:', error);
      
      // Show error message in the page
      const errorMsg = document.createElement('div');
      errorMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #dc3545; color: white; padding: 12px 20px; border-radius: 6px; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
      errorMsg.textContent = `❌ Failed to refresh: ${error.message}`;
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 5000);
    } finally {
      refreshStatsBtn.textContent = '🔄 Refresh All';
      refreshStatsBtn.disabled = false;
    }
  };

  // Show edit form
  const showEditForm = (historyItem, item, index) => {
    const editForm = document.getElementById(`edit-form-${index}`);
    editForm.classList.add('show');
  };

  // Cancel edit
  window.cancelEdit = (index) => {
    const editForm = document.getElementById(`edit-form-${index}`);
    editForm.classList.remove('show');
  };

  // Save edit
  window.saveEdit = async (index) => {
    const urlInput = document.getElementById(`edit-url-${index}`);
    const commentInput = document.getElementById(`edit-comment-${index}`);
    const slugInput = document.getElementById(`edit-slug-${index}`);
    const expirationSelect = document.getElementById(`edit-expiration-${index}`);
    
    const newUrl = urlInput.value.trim();
    const newComment = commentInput.value.trim();
    const newSlug = slugInput.value.trim();
    const newExpiration = expirationSelect.value;
    
    if (!newUrl) {
      alert('URL is required');
      return;
    }

    try {
      const { baseUrl, token } = await chrome.storage.sync.get(['baseUrl', 'token']);
      
      if (!baseUrl || !token) {
        alert('Please configure API settings first');
        return;
      }

      // Get the original item
      const originalItem = filteredHistory[index];
      
      // Extract slug from short URL
      const urlParts = originalItem.short.split('/');
      const originalSlug = urlParts[urlParts.length - 1];

      // Prepare edit API URL
      const editApiUrl = baseUrl.replace('/api/link/create', '/api/link/edit');
      
      // Prepare request body
      const requestBody = { 
        url: newUrl,
        slug: newSlug || originalSlug
      };
      
      if (newComment) {
        requestBody.comment = newComment;
      }
      if (newExpiration) {
        requestBody.expiration = newExpiration;
      }

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
      
      // Update the item in history
      const updatedItem = {
        ...originalItem,
        original: newUrl,
        comment: newComment,
        slug: newSlug || originalSlug,
        expiration: newExpiration,
        short: data.shortLink || originalItem.short
      };

      // Update both arrays
      const originalIndex = allHistory.findIndex(item => item.short === originalItem.short);
      if (originalIndex !== -1) {
        allHistory[originalIndex] = updatedItem;
      }
      
      filteredHistory[index] = updatedItem;

      // Save to storage
      await chrome.storage.sync.set({ history: allHistory });

      // Refresh display
      renderHistory(filteredHistory);
      
      alert('URL updated successfully');
    } catch (error) {
      console.error('Failed to edit URL:', error);
      alert(`Failed to edit URL: ${error.message}`);
    }
  };

  // Delete URL
  const deleteUrl = async (item, index) => {
    if (!confirm(`Are you sure you want to delete this URL?\n${item.short}`)) {
      return;
    }

    try {
      const { baseUrl, token } = await chrome.storage.sync.get(['baseUrl', 'token']);
      
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

      // Remove from both arrays
      const originalIndex = allHistory.findIndex(historyItem => historyItem.short === item.short);
      if (originalIndex !== -1) {
        allHistory.splice(originalIndex, 1);
      }
      
      filteredHistory.splice(index, 1);

      // Save to storage
      await chrome.storage.sync.set({ history: allHistory });

      // Refresh display
      renderHistory(filteredHistory);
      
      // Update count
      totalCount.textContent = `${allHistory.length} URLs`;
      
      alert('URL deleted successfully');
    } catch (error) {
      console.error('Failed to delete URL:', error);
      alert(`Failed to delete URL: ${error.message}`);
    }
  };

  // Event listeners
  searchBox.addEventListener('input', (e) => {
    filterHistory(e.target.value);
  });

  exportBtn.addEventListener('click', exportHistory);
  clearAllBtn.addEventListener('click', clearAllHistory);
  refreshStatsBtn.addEventListener('click', refreshStats);
  
  backLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
  });

  // Add keyboard shortcut for refresh (F5 or Ctrl+R)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
      e.preventDefault();
      refreshStats();
    }
  });

  // Initial load
  await loadHistory();

  // Check if we need to auto-edit a specific item
  const urlParams = new URLSearchParams(window.location.search);
  const editUrl = urlParams.get('edit');
  if (editUrl) {
    // Find and auto-open edit form for the specified URL
    setTimeout(() => {
      const targetIndex = filteredHistory.findIndex(item => item.short === editUrl);
      if (targetIndex !== -1) {
        const editForm = document.getElementById(`edit-form-${targetIndex}`);
        if (editForm) {
          editForm.classList.add('show');
          editForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 500);
  }
});
