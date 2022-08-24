const searchSites = [
  /.*\.google.com/,
  /.*\.bing.com/,
  /.*\.duckduckgo.com/,
];

const blockedSites = [
  /.*\.reddit.com$/,
];

function isSearchSite(host: string = window.location.host) {
  return searchSites.some((r) => r.test(host));
}

function isBlockedSite(host: string = window.location.host) {
  return blockedSites.some((r) => r.test(host));
}

function block(reason: string) {
  console.log('block', reason);
  document.documentElement.innerHTML = '';
  window.location.replace('about:blank');
}

if (isBlockedSite()) {
  chrome.storage.local.get(['searchClickedAt'], (result) => {
    const lastClickedMs = Date.now() - (result.searchClickedAt || 0);
    console.log('lastClicked', lastClickedMs);
    if (lastClickedMs > 5000) {
      block('Attempting to go to a blocked site!');
    }
  });
}

// document.addEventListener('click', function(e) {
//   console.log('click!', window.location);
//   chrome.storage.local.set({ clickedAt: Date.now() });
// }, false);

[...document.querySelectorAll('a')].forEach((a) => {
  a.addEventListener('click', function() {
    if (isSearchSite()) {
      chrome.storage.local.set({ searchClickedAt: Date.now() });
    } else if (isBlockedSite()) {
      const href = this.getAttribute('href') || '';
      if (href.startsWith('/')) {
        block('Attempting to follow a link on a blocked site!');
      }
    }
  })
});
