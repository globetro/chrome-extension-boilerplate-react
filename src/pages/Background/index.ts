import {addTimedAllow, isBlockedSite} from '../../utils';

function block(tabId: number, reason: string, url: string | undefined) {
  chrome.tabs.update(tabId, {
    url:
      chrome.runtime.getURL('newtab.html') +
      '?' +
      ['reason=' + encodeURIComponent(reason), 'url=' + encodeURIComponent(url || '')].join('&'),
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'timedAllow') {
    addTimedAllow(message.url);
    sendResponse(true);
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(async (e) => {
  // if (e.frameType !== 'outermost_frame') {
  if ((e as any).parentFrameId !== -1) {
    // don't care about subframes/iframes
    return;
  }

  chrome.tabs.get(e.tabId, async (tab) => {
    console.log('beforeNavigate.tabInfo', tab);
    console.log('openerTabCommitedUrl', lastCommitUrlByTabId[tab.openerTabId || 0]);
    if (!tab.url && tab.openerTabId) {
      // Means we opened this tab from another tab
      if (
        (await isBlockedSite(tab.pendingUrl)) &&
        (await isBlockedSite(lastCommitUrlByTabId[tab.openerTabId]))
      ) {
        block(e.tabId, 'Opening blocked site in a new tab from a blocked site', tab.pendingUrl);
      }
    }
  });
});

const lastCommitUrlByTabId: Record<number, string | undefined> = {};
chrome.webNavigation.onCommitted.addListener(async (e) => {
  // if (e.frameType !== 'outermost_frame') {
  if ((e as any).parentFrameId !== -1) {
    // don't care about subframes/iframes
    return;
  }

  chrome.tabs.get(e.tabId, (tab) => console.log('tabInfo', tab));

  const parentUrl = lastCommitUrlByTabId[e.tabId];
  if (await isBlockedSite(e.url)) {
    if (e.transitionType === 'auto_bookmark') {
      // allow going to any bookmarks
    } else if (!(e.transitionType === 'link' && !(await isBlockedSite(parentUrl)))) {
      // Block the site unless it's clicked from a non-blocked site
      block(e.tabId, 'Visiting a blocked site!', e.url);
    } else {
      // Don't allow visiting reddit.com by just typing "reddit" into google
      // and following the first link
      const url = new URL(e.url);
      if (url.pathname === '/') {
        block(e.tabId, 'Visiting the site by just typing it into a search engine!', e.url);
      }
    }
  }

  // Important that this happens after logic above
  lastCommitUrlByTabId[e.tabId] = e.url;
});

// Do not allow following any relative links on a blocked, SPA site.
chrome.webNavigation.onHistoryStateUpdated.addListener(async (e) => {
  console.log('onHistoryUpdate', e);

  // SPA-sites like reddit will fire an onHistoryUpdate right after a
  // onCommitted when loading the initial page. We should ignore this
  // as it's triggered by the page load, and not from following a link on the site
  if (lastCommitUrlByTabId[e.tabId] === e.url) {
    return;
  }

  if (await isBlockedSite(e.url)) {
    block(e.tabId, 'Following link on a blocked site!', e.url);
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
