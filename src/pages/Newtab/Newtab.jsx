import React from 'react';
import {useMemo} from 'react';
import ChallengeReveal from './ChallengeReveal';
import './Newtab.scss';

export default function Newtab() {
  const params = useMemo(() => new URLSearchParams(window.location.search.slice(1)), []);
  const url = params.get('url');
  console.log('url', url);
  return (
    <div className='container'>
      <h1>❌ Site is blocked</h1>
      <h2>{params.get('reason')}</h2>
      <ChallengeReveal>
        <a href={url}>{url}</a>
      </ChallengeReveal>
    </div>
  );
}
