import './style.sass';

import cn from 'classnames';
import { useController, useFormContext } from 'react-hook-form';

import { Icon } from '../TicketDetails/TicketDetails';
import { Input } from 'components/Input';

import { ReactComponent as CheckedIcon } from 'assets/icons/checked.svg';

export const OrderInput = ({
  className,
  label,
  type,
  placeholder,
  name,
  size,
  isValid = true,
  width,
  ...props
}) => {
  return (
    <div className="order__input_container">
      {label && (
        <label className="order__input_label" htmlFor={name}>
          {label}
        </label>
      )}
      <Input
        className={cn('order__input', className, {
          invalid: !isValid,
          [`order__input_size_${size}`]: size,
        })}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export const OrderCheckboxInput = ({
  label,
  name,
  textSize = 'm',
  type = 'checkbox',
  ...props
}) => {
  return (
    <label className="order__checkbox">
      <Input
        className="order__checkbox_input"
        type={type}
        name={name}
        {...props}
      />
      <div className="order__checkbox_input_box">
        <Icon
          wrapperClassName="order__checkbox_input_checked-icon"
          icon={CheckedIcon}
        />
      </div>
      <div
        className={`order__checkbox_text order__checkbox_text_size_${textSize}`}
      >
        {label}
      </div>
    </label>
  );
};

export const OrderRadioInput = ({ value, name, onChange, ...props }) => {
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  const handleChange = (e) => {
    field.onChange(e);
    onChange?.(e);
  };

  return (
    <OrderCheckboxInput
      type="radio"
      value={value}
      name={name}
      onChange={handleChange}
      isChecked={field.value === value}
      {...props}
    />
  );
};
