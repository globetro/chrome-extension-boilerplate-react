import React, {useEffect} from 'react';
import {useMemo, useState} from 'react';

export default function ChallengeReveal({
  children,
  onRevealed,
}: {
  children: React.ReactNode;
  onRevealed: () => void;
}) {
  const [answer, setAnswer] = useState<string>('');
  const [number1, number2] = useMemo(() => {
    const numbers = [];
    for (let i = 0; i < 2; i++) {
      numbers.push(Math.floor(Math.random() * 1000));
    }
    return numbers;
  }, []);

  const passed = parseInt(answer || '0') === number1 * number2;

  useEffect(() => {
    if (passed) {
      onRevealed();
    }
  }, [onRevealed, passed]);

  return passed ? (
    <div>{children}</div>
  ) : (
    <div>
      <h3>Challenge</h3>
      <p>
        {number1} x {number2} ={' '}
        <input type='number' value={answer} onChange={(e) => setAnswer(e.target.value)} />
      </p>
    </div>
  );
}
