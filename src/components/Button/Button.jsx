import './style.sass';

import cn from 'classnames';

export const Button = ({
  children,
  size,
  styleName,
  classname,
  onClick,
  type = 'button',
  disabled = false,
}) => {
  return (
    <button
      className={cn('form__button', classname, {
        [`form__button_size_${size}`]: size,
        [`form__button_style_${styleName}`]: styleName,
        form__button_disabled: disabled,
      })}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
