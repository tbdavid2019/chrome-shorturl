// Options script
document.addEventListener('DOMContentLoaded', async () => {
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

  // Toggle password visibility
  const togglePasswordVisibility = (input, button) => {
    if (input.type === 'password') {
      input.type = 'text';
      button.textContent = '🙈';
    } else {
      input.type = 'password';
      button.textContent = '👁️';
    }
  };

  if (toggleTokenBtn) {
    toggleTokenBtn.addEventListener('click', () => {
      togglePasswordVisibility(tokenInput, toggleTokenBtn);
    });
  }

  if (toggleBackupTokenBtn) {
    toggleBackupTokenBtn.addEventListener('click', () => {
      togglePasswordVisibility(backupTokenInput, toggleBackupTokenBtn);
    });
  }

  // Load current settings
  const { baseUrl, token, backupUrl, backupToken } = await chrome.storage.sync.get(['baseUrl', 'token', 'backupUrl', 'backupToken']);
  baseUrlInput.value = baseUrl || 'https://aiurl.tw/api/link/create';
  tokenInput.value = token || '';
  backupUrlInput.value = backupUrl || '';
  backupTokenInput.value = backupToken || '';

  // Save settings
  saveBtn.addEventListener('click', async () => {
    const newBaseUrl = baseUrlInput.value.trim();
    const newToken = tokenInput.value.trim();
    const newBackupUrl = backupUrlInput.value.trim();
    const newBackupToken = backupTokenInput.value.trim();

    await chrome.storage.sync.set({ baseUrl: newBaseUrl, token: newToken, backupUrl: newBackupUrl, backupToken: newBackupToken });
    status.textContent = 'Settings saved!';
    setTimeout(() => { status.textContent = ''; }, 2000);
  });

  // Check current permissions status
  const checkPermissions = async () => {
    try {
      const hasPermissions = await chrome.permissions.contains({
        origins: ['https://*/*']
      });
      
      if (hasPermissions) {
        permissionsStatus.textContent = '✅ Custom APIs enabled';
        permissionsStatus.style.color = '#28a745';
        requestPermissionsBtn.textContent = '✅ Custom APIs Enabled';
        requestPermissionsBtn.disabled = true;
      } else {
        permissionsStatus.textContent = '⚠️ Custom APIs not enabled';
        permissionsStatus.style.color = '#ffc107';
        requestPermissionsBtn.textContent = '🔓 Enable Custom APIs';
        requestPermissionsBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  // Request optional permissions
  requestPermissionsBtn.addEventListener('click', async () => {
    try {
      const granted = await chrome.permissions.request({
        origins: ['https://*/*']
      });
      
      if (granted) {
        permissionsStatus.textContent = '✅ Custom APIs enabled successfully!';
        permissionsStatus.style.color = '#28a745';
        requestPermissionsBtn.textContent = '✅ Custom APIs Enabled';
        requestPermissionsBtn.disabled = true;
      } else {
        permissionsStatus.textContent = '❌ Permission denied';
        permissionsStatus.style.color = '#dc3545';
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      permissionsStatus.textContent = '❌ Error requesting permissions';
      permissionsStatus.style.color = '#dc3545';
    }
  });

  // Initial permissions check
  checkPermissions();
});
