import './style.sass';

import cn from 'classnames';
import { useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { format, parseISO } from 'date-fns';

import { DatePicker } from 'components/DatePicker';

import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg';

const parseDate = (date) => date && parseISO(date);
const formatDate = (date) => format(date, 'yyyy-MM-dd');

export const Input = ({
  className,
  name,
  onChange,
  type,
  value,
  isChecked,
  required,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  ...props
}) => {
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
    rules: { required, minLength, maxLength, min, max, pattern },
  });

  const handleChange = (event) => {
    field.onChange(event);
    onChange?.(event);
  };

  return (
    <input
      className={cn('form__input', className)}
      {...field}
      {...props}
      value={value || field.value}
      type={type}
      checked={isChecked || (type === 'checkbox' && field.value)}
      onChange={handleChange}
    />
  );
};

export const EmailInput = ({ size, ...props }) => {
  return (
    <InputContainer size={size}>
      <Input {...props} type="email" />
    </InputContainer>
  );
};

export const DateInput = ({
  name,
  size,
  startDate,
  endDate,
  onChangeDate,
  selected,
  ...props
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const onClick = () => {
    setIsPickerOpen(!isPickerOpen);
  };

  const handleInputChange = ({ target: { value } }) => {
    if (value) onChangeDate(name, value);
  };

  const handleDateSelect = (date) => {
    const formattedDate = formatDate(date);
    onChangeDate(name, formattedDate);
  };

  return (
    <div className="date-input__wrapper">
      <InputContainer size={size}>
        <Input
          name={name}
          size={size}
          type="date"
          min={startDate}
          max={endDate}
          onChange={handleInputChange}
          {...props}
        />
        <button
          className="input__btn input__btn_pick-date"
          onClick={onClick}
          type="button"
        >
          <CalendarIcon className="input__btn_icon" />
        </button>
      </InputContainer>

      {isPickerOpen && (
        <DatePicker
          onSelect={handleDateSelect}
          selected={parseDate(selected)}
          startDate={parseDate(startDate)}
          endDate={parseDate(endDate)}
          setIsOpen={setIsPickerOpen}
        />
      )}
    </div>
  );
};

export const LocationInput = ({ size, ...props }) => {
  return (
    <InputContainer size={size}>
      <Input {...props} type="text" autoComplete="off" />
      <button className="input__btn input__btn_pick-location" type="button">
        <LocationIcon className="input__btn_icon" />
      </button>
    </InputContainer>
  );
};

export const InputContainer = ({ children, size }) => {
  return (
    <div
      className={cn('input__container', {
        [`input__container_size_${size}`]: size,
      })}
    >
      {children}
    </div>
  );
};
