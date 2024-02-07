import { useEffect } from 'react';

export const useDisableBodyScroll = (isOpen) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);
};
