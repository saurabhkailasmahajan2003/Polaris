import { useEffect, useState, useRef } from 'react';

/**
 * Slowly reveals text character-by-character so users can follow along.
 */
export default function TypewriterText({
  text = '',
  speed = 28,
  className = '',
  onComplete,
  cursor = true,
}) {
  const [shown, setShown] = useState('');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setShown('');
    if (!text) {
      onCompleteRef.current?.();
      return undefined;
    }

    let i = 0;
    let cancelled = false;
    const id = setInterval(() => {
      if (cancelled) return;
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [text, speed]);

  return (
    <span className={className}>
      {shown}
      {cursor && shown.length < text.length && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-primary/80 animate-pulse" />
      )}
    </span>
  );
}
