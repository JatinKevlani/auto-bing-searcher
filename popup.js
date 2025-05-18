document.getElementById('startBtn').addEventListener('click', async () => {
    const minDelay = parseInt(document.getElementById('minDelay').value, 10);
    const maxDelay = parseInt(document.getElementById('maxDelay').value, 10);
    const searchCount = parseInt(document.getElementById('searchCount').value, 10);

    chrome.runtime.sendMessage({
        action: 'startSearch',
        minDelay,
        maxDelay,
        searchCount
    });

    document.getElementById('completed').textContent = '0';
    document.getElementById('total').textContent = searchCount;
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'progress') {
        document.getElementById('completed').textContent = msg.completed;
        document.getElementById('nextIn').textContent = msg.remainingTime;
        document.getElementById('total').textContent = msg.totalSearches;
    }
});

document.getElementById('stopBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopSearch' });
});
