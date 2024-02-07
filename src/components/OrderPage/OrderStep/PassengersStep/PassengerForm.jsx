import './style.sass';

import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import {
  OrderBlockContainer,
  OrderBlockHeader,
  OrderBlockItem,
  OrderBlockSection,
  OrderBlockHeaderTitle,
  OrderBlockSectionRow,
} from '../../OrderBlock';
import {
  OrderInput,
  OrderCheckboxInput,
} from 'components/OrderPage/OrderInput';
import { Icon } from '../../TicketDetails/TicketDetails';
import { Button } from 'components/Button';
import {
  PassengerFormGenderRadioGroup,
  PassengerFormHeaderContent,
  PassengerFormIconButton,
  PassengerFormSelect,
} from './PassengersStepComponents';
import { Form } from 'lib/Form';

import { ReactComponent as PlusIcon } from 'assets/icons/plus_icon.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus_icon.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close_icon.svg';
import { ReactComponent as CheckedIcon } from 'assets/icons/checked.svg';

import { errorMessages, patternValues } from '../helpers';
import { setPrevStep } from 'reducers/stepper';
import {
  changeAdditionalPassenger,
  changeSeatType,
  recalculatePrice,
} from 'reducers/seats';
import { openModal } from 'reducers/app';

const adultOption = { label: 'Взрослый', value: 'adult' };
const childOption = { label: 'Детский', value: 'child' };

const ticketTypeOptions = [adultOption, childOption];

const documentTypeOptions = [
  { label: 'Паспорт РФ', value: 'passport' },
  { label: 'Свидетельство о рождении', value: 'birth_certificate' },
];

export const PassengerForm = ({
  onFormChange,
  formIndex,
  passengers,
  onNextPassengerClick,
  onRemovePassenger,
  isExpandedProp = false,
  innerRef,
  isLast,
  ...props
}) => {
  const dispatch = useDispatch();
  const { passengerForms } = useSelector((state) => state.order);
  const {
    selectedSeats,
    passengersAmount: { adult },
  } = useSelector((state) => state.seats);

  let seatName = 'Место не выбрано';
  let seat = false;
  const selectedSeat = selectedSeats[formIndex];

  if (selectedSeat.name) {
    const { name, number } = selectedSeats[formIndex];
    seatName = `${name}, место ${number}`;
    seat = true;
  }

  const form = useForm({
    defaultValues: {
      ticket_type: selectedSeat ? selectedSeat.type : 'adult',
      last_name: '',
      first_name: '',
      patronymic: '',
      gender: 'male',
      birthday: '',
      limited_mobility: false,
      document_type: 'passport',
      passport_series: '',
      passport_number: '',
      birth_certificate_number: '',
      seat: 'seat',
    },
    mode: 'onChange',
  });

  const {
    formState: { errors, isValid, isDirty },
  } = form;

  const [isExpanded, setIsExpanded] = useState(isExpandedProp);

  const { setValue, getValues, watch, setError } = form;

  const document_type = watch('document_type');
  const ticket_type = watch('ticket_type');

  const handleSubmit = () => {
    if (!seat) {
      setError('test', { message: 'Выберите место' });
    }
    if (isValid) {
      onNextPassengerClick(formIndex);
    }
  };

  const handleChange = () => {
    onFormChange(getValues(), formIndex, isValid);
  };

  const handleSelectSeat = () => {
    dispatch(
      changeAdditionalPassenger({
        index: formIndex,
        type: getValues('ticket_type'),
      }),
    );
    dispatch(setPrevStep());
  };

  const handleRemovePassenger = () => {
    const type = getValues('ticket_type');
    if (type === 'adult' && adult.amount === 1) {
      dispatch(
        openModal({
          type: 'error',
          message: 'Невозможно удалить единственного взрослого пассажира',
        }),
      );
      return;
    }
    onRemovePassenger(formIndex, type);
  };

  const handleTicketTypeSelect = (type) => {
    const oldTypeValue = getValues('ticket_type');
    if (oldTypeValue === type) {
      return;
    }

    setValue('ticket_type', type);
    dispatch(changeSeatType({ index: formIndex, type }));
    dispatch(recalculatePrice());
  };

  useEffect(() => {
    if (passengerForms[formIndex]) {
      const fields = getValues();
      for (const field in fields) {
        setValue(field, passengerForms[formIndex][field], {
          shouldDirty: true,
        });
      }
    }
  }, []);

  useEffect(() => {
    setIsExpanded(isExpandedProp);
  }, [isExpandedProp]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }
    onFormChange(getValues(), formIndex, seat && isValid);
  }, [isValid]);

  return (
    <OrderBlockContainer {...props}>
      <div ref={innerRef}>
        <Form form={form} onSubmit={handleSubmit} onChange={handleChange}>
          <OrderBlockItem>
            <OrderBlockHeader>
              <PassengerFormHeaderContent>
                <PassengerFormIconButton
                  className={isExpanded && 'expanded'}
                  type="expand"
                  onClick={() => setIsExpanded(!isExpanded)}
                  icon={isExpanded ? MinusIcon : PlusIcon}
                />
                <OrderBlockHeaderTitle title={`Пассажир ${formIndex + 1}`} />
                <PassengerFormIconButton
                  type="remove"
                  onClick={handleRemovePassenger}
                  icon={CloseIcon}
                />
              </PassengerFormHeaderContent>
            </OrderBlockHeader>

            {isExpanded && (
              <>
                <OrderBlockSection>
                  <OrderBlockSectionRow>
                    <PassengerFormSelect
                      className="width-auto"
                      options={
                        adult.amount === 1 && ticket_type === 'adult'
                          ? [adultOption]
                          : ticketTypeOptions
                      }
                      name="ticket_type"
                      onSelect={handleTicketTypeSelect}
                    />

                    <PassengerFormSelect
                      options={[{ label: seatName, value: 'seat' }]}
                      name="seat"
                    />
                  </OrderBlockSectionRow>

                  <OrderBlockSectionRow>
                    <OrderInput
                      className={errors.last_name && 'invalid'}
                      label="Фамилия"
                      type="text"
                      placeholder="Иванов"
                      name="last_name"
                      autoComplete="off"
                      required={errorMessages.required('Фамилия')}
                      pattern={{
                        value: patternValues.onlyCyrillic,
                        message: errorMessages.onlyCyrillic(
                          'Фамилия',
                          'female',
                        ),
                      }}
                    />
                    <OrderInput
                      className={errors.first_name && 'invalid'}
                      label="Имя"
                      type="text"
                      placeholder="Иван"
                      name="first_name"
                      autoComplete="off"
                      required={errorMessages.required('Имя')}
                      pattern={{
                        value: patternValues.onlyCyrillic,
                        message: errorMessages.onlyCyrillic('Имя', 'neuter'),
                      }}
                    />
                    <OrderInput
                      className={errors.patronymic && 'invalid'}
                      label="Отчество"
                      type="text"
                      placeholder="Иванович"
                      name="patronymic"
                      autoComplete="off"
                      pattern={{
                        value: patternValues.onlyCyrillic,
                        message: errorMessages.onlyCyrillic(
                          'Отчество',
                          'neuter',
                        ),
                      }}
                    />
                  </OrderBlockSectionRow>

                  <OrderBlockSectionRow>
                    <PassengerFormGenderRadioGroup name="gender" />
                    <OrderInput
                      className={errors.birthday && 'invalid'}
                      label="Дата рождения"
                      type="date"
                      placeholder="Иванович"
                      name="birthday"
                      size="s"
                      required={errorMessages.required('Дата рождения')}
                    />
                  </OrderBlockSectionRow>

                  <OrderBlockSectionRow>
                    <OrderCheckboxInput
                      name="limited_mobility"
                      label="ограниченная подвижность"
                      textSize="s"
                    />
                  </OrderBlockSectionRow>
                </OrderBlockSection>

                <OrderBlockSection>
                  <OrderBlockSectionRow>
                    <PassengerFormSelect
                      className="document-type"
                      options={documentTypeOptions}
                      name="document_type"
                      label="Тип документа"
                    />
                    {document_type === 'passport' ? (
                      <>
                        <OrderInput
                          className={cn('letter-spacing', {
                            invalid: errors.series,
                          })}
                          name="passport_series"
                          label="Серия"
                          type="number"
                          placeholder="____"
                          required={
                            // document_type === 'passport' &&
                            errorMessages.required('Серия паспорта')
                          }
                          minLength={{
                            value: 4,
                            message: 'Серия паспорта должна состоять из 4 цифр',
                          }}
                          maxLength={{
                            value: 4,
                            message: 'Серия паспорта должна состоять из 4 цифр',
                          }}
                        />
                        <OrderInput
                          className={cn('letter-spacing', {
                            invalid: errors.number,
                          })}
                          name="passport_number"
                          label="Номер"
                          type="number"
                          placeholder="______"
                          required={errorMessages.required('Номер паспорта')}
                          minLength={{
                            value: 6,
                            message: 'Номер паспорта должен состоять из 6 цифр',
                          }}
                          maxLength={{
                            value: 6,
                            message: 'Номер паспорта должен состоять из 6 цифр',
                          }}
                        />
                      </>
                    ) : (
                      <OrderInput
                        className={errors.birth_certificate_number && 'invalid'}
                        label="Номер"
                        type="text"
                        placeholder="12 символов"
                        name="birth_certificate_number"
                        required={errorMessages.required('Номер свидетельства')}
                        pattern={{
                          value: patternValues.birthCertificate,
                          message:
                            'Номер свидетельства о рождении указан некорректно. Пример: VIII-ЫП-123456',
                        }}
                      />
                    )}
                  </OrderBlockSectionRow>
                </OrderBlockSection>

                <div
                  className={cn('form__footer', {
                    valid: seat && isValid,
                    invalid: Object.keys(errors).length,
                  })}
                >
                  <OrderBlockSection>
                    <div className="form__footer_content">
                      <div className="form__footer_validation-info">
                        {seat && isValid && (
                          <>
                            <Icon
                              wrapperClassName="form__footer_validation-info_icon valid"
                              icon={CheckedIcon}
                            />
                            <div className="form__footer_validation-info_text">
                              Готово
                            </div>
                          </>
                        )}
                        {!!Object.keys(errors).length && (
                          <>
                            <Icon
                              wrapperClassName="form__footer_validation-info_icon invalid"
                              icon={CloseIcon}
                            />
                            <ul className="form__footer_validation-info_text">
                              {Object.values(errors).map(({ message }, i) => {
                                return (
                                  <li
                                    key={i}
                                    className="form__footer_error-message"
                                  >
                                    {message}
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      </div>
                      {!seat && (
                        <Button
                          styleName="transparent-dark"
                          size="m"
                          onClick={handleSelectSeat}
                        >
                          Выбрать место
                        </Button>
                      )}
                      {!Object.keys(errors).length && !isLast && seat && (
                        <Button
                          styleName="transparent-dark"
                          size="m"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Следующий пассажир
                        </Button>
                      )}
                    </div>
                  </OrderBlockSection>
                </div>
              </>
            )}
          </OrderBlockItem>
        </Form>
      </div>
    </OrderBlockContainer>
  );
};
