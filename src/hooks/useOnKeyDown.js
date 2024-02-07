import { useEffect } from 'react';

export const useOnKeyDown = (refKey, handler) => {
  useEffect(() => {
    const listener = ({ key }) => {
      if (key === refKey) {
        handler();
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handler, refKey]);
};
