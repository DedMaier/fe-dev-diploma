import './style.sass';

import { OrderBlockSectionRow } from '../OrderBlock';
import { OrderInput } from '../OrderInput';

import { errorMessages, patternValues } from './helpers';

export const FullnameInputBlock = ({ errors }) => {
  return (
    <OrderBlockSectionRow>
      <OrderInput
        label="Фамилия"
        type="text"
        placeholder="Иванов"
        name="last_name"
        autoComplete="off"
        isValid={!errors.last_name}
        required={errorMessages.required('Фамилия')}
        pattern={{
          value: patternValues.onlyCyrillic,
          message: errorMessages.onlyCyrillic('Фамилия', 'female'),
        }}
      />
      <OrderInput
        label="Имя"
        type="text"
        placeholder="Иван"
        name="first_name"
        autoComplete="off"
        isValid={!errors.first_name}
        required={errorMessages.required('Имя')}
        pattern={{
          value: patternValues.onlyCyrillic,
          message: errorMessages.onlyCyrillic('Имя', 'female'),
        }}
      />
      <OrderInput
        label="Отчество"
        type="text"
        placeholder="Иванович"
        name="patronymic"
        autoComplete="off"
        isValid={!errors.patronymic}
        pattern={{
          value: patternValues.onlyCyrillic,
          message: errorMessages.onlyCyrillic('Отчество', 'neuter'),
        }}
      />
    </OrderBlockSectionRow>
  );
};
