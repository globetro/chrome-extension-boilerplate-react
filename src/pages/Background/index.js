console.log('!This is the background page.');
console.log('! Put the background scripts here!');

// var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
//     'onCommitted', 'onCompleted', 'onDOMContentLoaded',
//     'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
//     'onHistoryStateUpdated'];

// eventList.forEach(function(e) {
//   chrome.webNavigation[e].addListener(function(data) {
//     if (typeof data)
//       console.log(chrome.i18n.getMessage('inHandler'), e, data);
//     else
//       console.error(chrome.i18n.getMessage('inHandlerError'), e);
//   });
// });

// Reset the navigation state on startup. We only want to collect data within a
// session.

// chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
//   console.log('!! tabId', tabId);
//   console.log('!!! changeInfo', changeInfo);
//   chrome.storage.local.get(['clickedAt'], (result) => {
//     console.log('result', Date.now() - result.clickedAt);
//   });
// });
