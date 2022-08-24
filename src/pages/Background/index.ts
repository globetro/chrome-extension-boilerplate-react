const searchSites = [
  /.*\.google.com/,
  /.*\.bing.com/,
  /.*\.duckduckgo.com/,
];

const blockedSites = [
  /.*\.reddit.com$/,
];

function isSearchSite(url?: string) {
  const u = new URL(url || '');
  return searchSites.some((r) => r.test(u.host));
}

function isBlockedSite(url?: string) {
  const u = new URL(url || '');
  return blockedSites.some((r) => r.test(u.host));
}

function block(reason: string) {
  console.log('Blocked reason', reason);
  chrome.tabs.update({url: chrome.runtime.getURL('newtab.html')});
}

const isSearchSiteByTab: Record<number, boolean> = {};
let lastCommitUrl: string | undefined;
chrome.webNavigation.onCommitted.addListener(async (e: any) => {
  if (e.frameType as unknown as string !== 'outermost_frame') {
    return;
  }

  console.log('onCommitted', e);

  if (isBlockedSite(e.url)) {
    // Block the site unless it's clicked from a non-blocked site
    if (!(e.transitionType === 'link' && !isBlockedSite(lastCommitUrl))) {
      block('Visiting a blocked site!');
    } else {
      // Don't allow visiting reddit.com by just typing "reddit" into google
      // and following the first link
      const url = new URL(e.url);
      if (url.pathname === '/') {
        block('Visiting the site by just typing it into a search engine!')
      }
    }
  }

  isSearchSiteByTab[e.tabId] = isSearchSite(e.url);
  lastCommitUrl = e.url;
});

// Do not allow following any relative links on a blocked, SPA site.
chrome.webNavigation.onHistoryStateUpdated.addListener(async (e) => {
  console.log('onHistoryUpdate', e);

  // SPA-sites like reddit will fire an onHistoryUpdate right after a
  // onCommitted when loading the initial page. We should ignore this
  // as it's triggered by the page load, and not from following a link on the site
  if (lastCommitUrl === e.url) {
    return;
  }

  if (isBlockedSite(e.url)) {
    block('Following link on a blocked site!');
  }
});

// var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
//     'onCommitted', 'onCompleted', 'onDOMContentLoaded',
//     'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
//     'onHistoryStateUpdated'];

// eventList.forEach(function(e) {
//   // @ts-ignore
//   chrome.webNavigation[e].addListener(async function(data) {
//     if (typeof data)
//       console.log(chrome.i18n.getMessage('inHandler'), e, data);
//     else
//       console.error(chrome.i18n.getMessage('inHandlerError'), e);

//     const tab = await getCurrentTab();
//     console.log('tabUrl', tab, tab?.url);

//     const tab2 = await chrome.tabs.getCurrent();
//     console.log('tab2Url', tab2, tab2?.url);
//   });
// });
