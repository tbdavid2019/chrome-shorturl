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

  toggleTokenBtn.addEventListener('click', () => {
    togglePasswordVisibility(tokenInput, toggleTokenBtn);
  });

  toggleBackupTokenBtn.addEventListener('click', () => {
    togglePasswordVisibility(backupTokenInput, toggleBackupTokenBtn);
  });

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
});
