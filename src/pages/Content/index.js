import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

if (/.*\.reddit.com$/.test(window.location.host)) {
  chrome.storage.local.get(['clickedAt'], (result) => {
    const lastClickedMs = Date.now() - (result.clickedAt || 0);
    console.log('lastClicked', lastClickedMs);
    if (lastClickedMs > 5000) {
      document.documentElement.innerHTML = '';
      window.location.replace('about:blank');
    }
  });
}

document.addEventListener('click', function(e) {
  console.log('click!', e);
  chrome.storage.local.set({ clickedAt: Date.now() });
}, false);