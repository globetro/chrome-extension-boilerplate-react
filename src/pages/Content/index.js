import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

if (/.*\.reddit.com$/.test(window.location.host)) {
  chrome.storage.local.get(['clickedAt'], (result) => {
    const lastClickedMs = Date.now() - result.clickedAt;
    if (lastClickedMs > 5000) {
      document.documentElement.innerHTML = '';
      window.location.replace('about:blank');
      console.log('getURL', chrome.runtime.getURL('newtab.html'));
    }
  });
}

document.addEventListener("click", function(e) {
  console.log('click!', e);
  window.__clickedTime = Date.now();
  chrome.storage.local.set({ clickedAt: Date.now() });
  // Do what you want with click event
}, false);