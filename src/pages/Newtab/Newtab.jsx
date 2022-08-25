import React from 'react';
import {useMemo} from 'react';
import './Newtab.scss';

export default function Newtab() {
  const params = useMemo(() => new URLSearchParams(window.location.search.slice(1)), []);

  return (
    <div className='container'>
      <h1>❌ Site is blocked</h1>
      <h2>{params.get('reason')}</h2>
    </div>
  );
}
