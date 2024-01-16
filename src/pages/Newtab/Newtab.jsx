import React, {useMemo, useState} from 'react';
import ChallengeReveal from './ChallengeReveal';
import './Newtab.scss';

export default function Newtab() {
  const [revealed, setRevealed] = useState(false);
  const params = useMemo(() => new URLSearchParams(window.location.search.slice(1)), []);
  const url = params.get('url');

  async function handleRevealed() {
    console.log('revaled', navigator.serviceWorker.controller);
    await chrome.runtime.sendMessage({type: 'timedAllow', url});
    setRevealed(true);
  }

  console.log('url', url);
  return (
    <div className='container' style={{width: 350}}>
      {revealed ? (
        <h1>✅ Site is allowed for 5 mins</h1>
      ) : (
        <>
          <h1>❌ Site is blocked</h1>
          <h2>{params.get('reason')}</h2>
        </>
      )}
      <ChallengeReveal onRevealed={handleRevealed}>
        <a href={url}>{url}</a>
      </ChallengeReveal>
    </div>
  );
}
