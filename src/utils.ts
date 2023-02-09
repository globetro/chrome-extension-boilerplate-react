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

const TIMED_ALLOW_DURATION = 5 * 60 * 1000; // 5 minutes
const timedAllowDomains = new Map<string, number>();

export function isTimedAllowed(url: string | null | undefined) {
  if (!url) {
    return false;
  }

  const u = new URL(url || '');
  const time = timedAllowDomains.get(u.hostname);
  if (time && time > Date.now()) {
    return true;
  } else {
    timedAllowDomains.delete(u.hostname);
    return false;
  }
}

export function addTimedAllow(url: string) {
  const u = new URL(url || '');
  timedAllowDomains.set(u.hostname, Date.now() + TIMED_ALLOW_DURATION);
}

export async function isBlockedSite(url: string | null | undefined) {
  if (!url) {
    return false;
  }

  const blockedSites = await fetchBlockedSites();
  if (blockedSites.length === 0) {
    return false;
  }

  if (isTimedAllowed(url)) {
    return false;
  }

  const u = new URL(url || '');
  return blockedSites.some((r) => {
    if (isRegExp(r)) {
      return new RegExp(r.slice(1, -1)).test(u.hostname);
    } else {
      return r === u.hostname;
    }
  });
}
