import {fetchBlockedSites, saveBlockedSites} from '../../utils';
import React, {useCallback, useEffect, useState} from 'react';
import './Options.css';

const PLACEHOLDER = ['/^.*\\.reddit\\.com$/', 'www.youtube.com'].join('\n');

export default function Options() {
  const [blockedSites, setBlockedSites] = useState('');

  const handleChange = useCallback((e) => {
    setBlockedSites(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    saveBlockedSites(blockedSites.trim().split('\n'));
  }, [blockedSites]);

  useEffect(() => {
    fetchBlockedSites().then((sites) => setBlockedSites(sites.join('\n')));
  }, []);

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h2>Blocked Sites</h2>
        <textarea
          placeholder={PLACEHOLDER}
          className='textarea'
          value={blockedSites}
          onChange={handleChange}
        />
        <br />
        <input type='submit' value='Save' />
      </form>
    </div>
  );
}
