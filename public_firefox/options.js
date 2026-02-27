// options.js
// Handles saving/loading API version for the extension

document.addEventListener('DOMContentLoaded', () => {
    const apiSelect = document.getElementById('api-select');
    const saveBtn = document.getElementById('save-btn');
    const status = document.getElementById('status');

    // Load saved API version
    chrome.storage.local.get(['apiVersion'], (result) => {
        if (result.apiVersion) {
            apiSelect.value = result.apiVersion;
        }
    });

    // Save selected API version
    saveBtn.addEventListener('click', () => {
        const selectedApi = apiSelect.value;
        chrome.storage.local.set({ apiVersion: selectedApi }, () => {
            status.textContent = `Saved API version: ${selectedApi}`;
            setTimeout(() => status.textContent = '', 1500);
        });
    });
});

