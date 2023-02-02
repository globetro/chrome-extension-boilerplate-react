const BLOCKED_SITES_KEY = 'blockedSites';

export async function saveBlockedSites(blockedSites: string[]) {
  chrome.storage.sync.set({[BLOCKED_SITES_KEY]: blockedSites});
}

export async function fetchBlockedSites(): Promise<string[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([BLOCKED_SITES_KEY], (result) => {
      resolve(result[BLOCKED_SITES_KEY] || []);
    });
  });
}

function isRegExp(str: string) {
  return str.startsWith('/') && str.endsWith('/');
}

export async function isBlockedSite(url: string | null | undefined) {
  if (!url) {
    return false;
  }

  const blockedSites = await fetchBlockedSites();
  if (blockedSites.length === 0) {
    return false;
  }

  const u = new URL(url || '');
  return blockedSites.some((r) => {
    if (isRegExp(r)) {
      return new RegExp(r.slice(1, -1)).test(u.host);
    } else {
      return r === u.host;
    }
  });
}
