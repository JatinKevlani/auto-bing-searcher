import { prompts } from './prompts.js';

let completed = 0;
let totalSearches = 0;
let minDelay = 20000;
let maxDelay = 30000;
let countdownInterval;
let stopRequested = false;

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'startSearch') {
        completed = 0;
        stopRequested = false;
        totalSearches = msg.searchCount;
        minDelay = msg.minDelay * 1000;
        maxDelay = msg.maxDelay * 1000;
        startSearchAutomation();
    }

    if (msg.action === 'stopSearch') {
        stopRequested = true;
        clearInterval(countdownInterval);
        console.log('Search automation stopped.');
    }
});

function startSearchAutomation() {
    function performSearch() {
        if (stopRequested || completed >= totalSearches) return;

        const query = generateRandomQuery();
        chrome.tabs.create({ url: `https://www.bing.com/search?q=${query}&form=EDGE01`, active: true });

        completed++;

        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        let remainingTime = Math.floor(delay / 1000);

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            if (stopRequested) {
                clearInterval(countdownInterval);
                return;
            }

            remainingTime--;
            chrome.runtime.sendMessage({ type: 'progress', completed, remainingTime, totalSearches });

            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);

        setTimeout(() => {
            if (!stopRequested) performSearch();
        }, delay);
    }

    performSearch();
}

function generateRandomQuery() {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
}
