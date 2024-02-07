import './style.sass';

import cn from 'classnames';
import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { Button } from 'components/Button';
import { Icon } from 'components/OrderPage/TicketDetails/TicketDetails';

import { ReactComponent as InfoIcon } from 'assets/icons/info_icon.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning_icon.svg';

import { useDisableBodyScroll } from 'hooks/useDisableBodyScroll';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { useOnKeyDown } from 'hooks/useOnKeyDown';

export const Modal = ({
  onClose,
  isOpen,
  type = 'info',
  message,
  description,
}) => {
  const ref = useRef();

  const handleClose = () => {
    onClose();
  };

  useDisableBodyScroll(isOpen);
  useOnClickOutside(ref, handleClose);
  useOnKeyDown('Escape', handleClose);

  return isOpen
    ? createPortal(
        <div className="modal__wrapper">
          <div className={cn('modal', `modal_type_${type}`)} ref={ref}>
            <div className="modal__header">
              <Icon
                wrapperClassName={cn('modal__icon', `modal__icon_${type}`)}
                icon={type === 'info' ? InfoIcon : WarningIcon}
              />
            </div>
            <div className="modal__content">
              <p className="modal__content_message">{message}</p>
              {description && (
                <p className="modal__content_description">{description}</p>
              )}
            </div>
            <div className="modal__footer">
              <Button
                classname="modal__button"
                size="m"
                styleName="transparent-dark"
                onClick={handleClose}
              >
                Понятно
              </Button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};
