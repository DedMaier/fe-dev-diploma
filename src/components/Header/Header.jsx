import './style.sass';

import cn from 'classnames';

const tagsBySize = {
  m: 'h3',
  s: 'h4',
  xs: 'h4',
};

export const Header = ({ size, className, children }) => {
  const TitleTag = tagsBySize[size];

  return (
    <TitleTag className={cn(`header_size_${size}`, className)}>
      {children}
    </TitleTag>
  );
};
