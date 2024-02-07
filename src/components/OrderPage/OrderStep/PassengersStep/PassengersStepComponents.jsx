import './style.sass';

import cn from 'classnames';
import { useController, useFormContext } from 'react-hook-form';

import { OrderBlockContainer, OrderBlockHeader } from '../../OrderBlock';
import { Icon } from '../../TicketDetails/TicketDetails';
import { OrderBlockHeaderTitle } from '../../OrderBlock';
import { Select } from 'components/Select';
import { Input } from 'components/Input';

import { ReactComponent as PlusIcon } from 'assets/icons/plus_icon.svg';

export const PassengerFormAdd = ({ onAddPassenger }) => {
  return (
    <OrderBlockContainer>
      <OrderBlockHeader>
        <PassengerFormHeaderContent>
          <OrderBlockHeaderTitle title="Добавить пассажира" />
          <PassengerFormIconButton
            type="add"
            icon={PlusIcon}
            onClick={onAddPassenger}
          />
        </PassengerFormHeaderContent>
      </OrderBlockHeader>
    </OrderBlockContainer>
  );
};

export const PassengerFormHeaderContent = ({ children }) => {
  return <div className="passenger-form__header_content">{children}</div>;
};

export const PassengerFormIconButton = ({ className, type, onClick, icon }) => {
  return (
    <button
      className={cn(`passenger-form__button_${type}`, className)}
      type="button"
      onClick={onClick}
    >
      <Icon
        wrapperClassName={`passenger-form__button_${type}_icon`}
        icon={icon}
      />
    </button>
  );
};

export const PassengerFormGenderRadioGroup = ({ name, ...props }) => {
  return (
    <fieldset className="passenger-form__fieldset order__input_container">
      <legend className="passenger-form__legend order__input_label">Пол</legend>
      <div className="passenger-form__radio_container">
        <PassengerFormGenderRadioInput
          value="male"
          label="М"
          name={name}
          {...props}
        />
        <PassengerFormGenderRadioInput
          value="female"
          label="Ж"
          name={name}
          {...props}
        />
      </div>
    </fieldset>
  );
};

export const PassengerFormGenderRadioInput = ({
  value,
  label,
  name,
  onChange,
}) => {
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
    <label className="passenger-form__radio_label">
      <Input
        className="passenger-form__radio_input"
        type="radio"
        value={value}
        name={name}
        onChange={handleChange}
        isChecked={field.value === value}
      />
      <span className="passenger-form__radio_text">{label}</span>
    </label>
  );
};

export const PassengerFormSelect = ({
  className,
  options,
  label,
  name,
  ...props
}) => {
  const { control, setValue } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  const onSelect = (value) => {
    field.onChange();
    setValue(name, value, { shouldTouch: true });
  };

  return (
    <div className={cn('order__input_container', className)}>
      {label && <label className="order__input_label">{label}</label>}
      <Select
        className="passenger-form__select"
        optionsList={options}
        selected={field.value}
        onSelect={onSelect}
        {...props}
      />
    </div>
  );
};
