import './style.sass';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { Header } from 'components/Header';
import {
  OrderBlockItem,
  OrderBlockContainer,
  OrderBlockHeader,
  OrderBlockSection,
  OrderBlockSectionRow,
} from '../OrderBlock';
import { OrderInput } from '../OrderInput';
import { NextStepButton, PrevStepButton } from '../OrderPage';
import { FullnameInputBlock } from './FullnameInputBlock';
import { OrderRadioInput } from '../OrderInput/OrderInput';
import { Form } from 'lib/Form';

import { setUserData } from 'reducers/order';
import { errorMessages, patternValues } from './helpers';

export const PaymentStep = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.order);

  const form = useForm({
    defaultValues: {
      last_name: '',
      first_name: '',
      patronymic: '',
      phone: '',
      email: '',
      payment_method: 'online',
      online_payment_type: '',
    },
    mode: 'onChange',
  });

  const {
    formState: { errors, isValid },
    getValues,
    watch,
    setValue,
  } = form;

  const payment_method = watch('payment_method');

  const handleChangeStepClick = () => {
    const formData = getValues();
    dispatch(setUserData(formData));
  };

  useEffect(() => {
    if (userData) {
      const fields = getValues();
      for (const field in fields) {
        if (userData[field]) {
          setValue(field, userData[field], {
            shouldDirty: true,
            // shouldValidate: true,
          });
        }
      }
    }
  }, []);

  // useEffect(() => {}, [payment_method]);

  return (
    <>
      <OrderBlockContainer>
        <Form form={form}>
          <OrderBlockItem>
            <OrderBlockHeader>
              <Header size="s">Персональные данные</Header>
            </OrderBlockHeader>

            <OrderBlockSection>
              <FullnameInputBlock errors={errors} />

              <OrderBlockSectionRow>
                <OrderInput
                  label="Контактный телефон"
                  type="text"
                  placeholder="+7 ___ ___ __ __"
                  name="phone"
                  isValid={!errors.phone}
                  required={errorMessages.required('Контактный телефон')}
                  pattern={{
                    value: patternValues.phone,
                    message: errorMessages.onlyCyrillic('Фамилия', 'female'),
                  }}
                />
              </OrderBlockSectionRow>

              <OrderBlockSectionRow>
                <OrderInput
                  label="E-mail"
                  type="text"
                  placeholder="inbox@gmail.ru"
                  name="email"
                  isValid={!errors.email}
                  required={errorMessages.required('E-mail')}
                  pattern={{
                    value: patternValues.email,
                    message: errorMessages.onlyCyrillic('Фамилия', 'female'),
                  }}
                />
              </OrderBlockSectionRow>
            </OrderBlockSection>
          </OrderBlockItem>

          <OrderBlockItem>
            <OrderBlockHeader>
              <Header size="s">Способ оплаты</Header>
            </OrderBlockHeader>
            <OrderBlockSection>
              <OrderRadioInput
                label="Онлайн"
                type="radio"
                name="payment_method"
                value="online"
                id="online"
              />
              <fieldset
                className="online-payment-methods"
                disabled={payment_method !== 'online'}
              >
                <OnlinePaymentRadioItem
                  label="Банковской картой"
                  value="card"
                />
                <OnlinePaymentRadioItem label="PayPal" value="paypal" />
                <OnlinePaymentRadioItem label="Visa QIWI Wallet" value="qiwi" />
              </fieldset>
            </OrderBlockSection>
            <OrderBlockSection>
              <OrderRadioInput
                label="Наличными"
                type="radio"
                name="payment_method"
                value="cash"
                id="cash"
              />
            </OrderBlockSection>
          </OrderBlockItem>
        </Form>
      </OrderBlockContainer>

      <div className="step-buttons__container">
        <PrevStepButton type="prev" onClick={handleChangeStepClick}>
          Назад
        </PrevStepButton>
        <NextStepButton onClick={handleChangeStepClick} disabled={!isValid}>
          Купить билеты
        </NextStepButton>
      </div>
    </>
  );
};

const OnlinePaymentRadioItem = ({ label, value }) => {
  return (
    <div className="online-payment-methods__item">
      <label className="online-payment-methods__label">
        <input
          className="online-payment-methods__input"
          type="radio"
          name="online_payment"
          value={value}
        />
        <span className="online-payment-methods__label_text">{label}</span>
      </label>
    </div>
  );
};
