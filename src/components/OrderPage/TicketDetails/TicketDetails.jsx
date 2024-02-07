import './style.sass';

import cn from 'classnames';
import { useState } from 'react';

import { ReactComponent as ShrinkBtnIcon } from 'assets/icons/shrink.svg';
import { ReactComponent as ExpandBtnIcon } from 'assets/icons/expand.svg';

export const TicketDetails = ({ children }) => {
  return <div className="ticket-details__container">{children}</div>;
};

export const TicketDetailsHeader = ({
  title,
  asideSlot,
  iconSlot,
  className,
}) => {
  return (
    <header className="ticket-details__section_header">
      {iconSlot}
      <h4 className={cn('header_size_s', className)}>
        {title} {asideSlot}
      </h4>
    </header>
  );
};

export const TicketDetailsSection = ({
  children,
  headerSlot,
  isExpandable,
}) => {
  const [isExpanded, setIsExpanded] = useState(!isExpandable);

  const onClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="ticket-details__section">
      {isExpandable && (
        <button
          className="ticket-details__button_expand"
          type="button"
          onClick={onClick}
        >
          <Icon
            wrapperClassName="button_expand_icon"
            iconClassName={isExpanded && 'icon__grey'}
            icon={isExpanded ? ShrinkBtnIcon : ExpandBtnIcon}
          />
        </button>
      )}
      {headerSlot}
      {isExpanded && children}
    </div>
  );
};

export const TicketDetailsSectionContent = ({ children }) => {
  return <div className="ticket-details__section_content">{children}</div>;
};

export const Icon = ({ wrapperClassName, iconClassName, icon: Icon }) => {
  return (
    <div className={cn('icon__wrapper_tmp', wrapperClassName)}>
      <Icon className={cn('icon', iconClassName)} />
    </div>
  );
};
