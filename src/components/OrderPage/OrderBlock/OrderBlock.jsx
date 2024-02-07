import './style.sass';

import cn from 'classnames';

export const OrderBlockItem = ({ children }) => {
  return <div className="order__block_item">{children}</div>;
};

export const OrderBlockContainer = ({ children }) => {
  return <div className="order__block_container">{children}</div>;
};

export const OrderBlockHeader = ({ children, className }) => {
  return <div className={cn('order__block_header', className)}>{children}</div>;
};

export const OrderBlockHeaderTitle = ({ title }) => {
  return <div className="order__block_header_title">{title}</div>;
};

export const OrderBlockSection = ({ children }) => {
  return <div className="order__block_section">{children}</div>;
};

export const OrderBlockSectionRow = ({ children }) => {
  return <div className="order__block_row">{children}</div>;
};
