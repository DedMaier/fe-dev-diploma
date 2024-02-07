import { useEffect } from 'react';

export const useScrollIntoView = (
  ref,
  trigger,
  options = { behavior: 'smooth', block: 'nearest' },
) => {
  useEffect(() => {
    if (ref?.current?.scrollIntoView) {
      ref.current.scrollIntoView(options);
    }
  }, [trigger]);
};
