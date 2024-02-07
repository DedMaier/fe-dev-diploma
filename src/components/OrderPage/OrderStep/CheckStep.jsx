import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { parse } from 'date-fns/esm';

import { OrderBlockContainer, OrderBlockHeaderTitle } from '../OrderBlock';
import { Icon } from '../TicketDetails/TicketDetails';
import { Button } from 'components/Button';
import { Ticket } from 'components/Ticket';
import {
  NextStepButton,
  PrevStepButton,
  StepButtonsContainer,
} from '../OrderPage';

import { ReactComponent as PersonIcon } from 'assets/icons/person.svg';

import { createOrder } from 'reducers/order';
import { setStep } from 'reducers/stepper';
import { formatNumber } from 'lib/helpers';

const formatBirthday = (string = new Date()) => {
  const parsed = parse(string, 'yyyy-MM-dd', new Date());
  return format(parsed, 'dd.MM.yyyy');
};

const paymentMethods = {
  online: 'Онлайн',
  cash: 'Наличными',
};

const genders = {
  male: 'мужской',
  female: 'женский',
};

const ticketTypes = {
  adult: 'Взрослый',
  child: 'Детский',
};

const documentTypes = {
  passport: 'Паспорт РФ',
  birth_certificate: 'Свидетельство о рождении',
};

export const CheckStep = () => {
  const {
    passengerForms,
    userData: { payment_method },
  } = useSelector((state) => state.order);

  const { tripInfo, price } = useSelector((state) => state.seats);

  const dispatch = useDispatch();

  const history = useHistory();

  const handleConfirmation = () => {
    dispatch(createOrder());
    history.push('/success');
  };

  return (
    <>
      <div>
        <OrderBlockContainer>
          <CheckStepHeader title="Поезд" />
          <Ticket {...tripInfo} isChecking />
        </OrderBlockContainer>

        <OrderBlockContainer>
          <CheckStepHeader title="Пассажиры" />
          <CheckStepSection>
            <CheckStepSectionMain>
              <ul className="check-step__passenger_list">
                {passengerForms.map((props, i) => (
                  <CheckStepSectionRow key={i}>
                    <CheckStepPassenger {...props} />
                  </CheckStepSectionRow>
                ))}
              </ul>
            </CheckStepSectionMain>
            <CheckStepSectionAside>
              <div className="check-step__sum">
                <span>Всего</span>
                <span className="check-step__sum_number">
                  {formatNumber(price.total)}
                </span>
                <span className="check-step__sum_currency">₽</span>
              </div>
              <Button
                size="s"
                styleName="transparent-dark"
                onClick={() => dispatch(setStep(2))}
              >
                Изменить
              </Button>
            </CheckStepSectionAside>
          </CheckStepSection>
        </OrderBlockContainer>

        <OrderBlockContainer>
          <CheckStepHeader title="Способ оплаты" />
          <CheckStepSection>
            <CheckStepSectionMain>
              <CheckStepSectionRow>
                <div className="check-step__payment-method">
                  {paymentMethods[payment_method]}
                </div>
              </CheckStepSectionRow>
            </CheckStepSectionMain>
            <CheckStepSectionAside>
              <Button
                size="s"
                styleName="transparent-dark"
                onClick={() => dispatch(setStep(3))}
              >
                Изменить
              </Button>
            </CheckStepSectionAside>
          </CheckStepSection>
        </OrderBlockContainer>
      </div>

      <StepButtonsContainer>
        <PrevStepButton>Назад</PrevStepButton>
        <NextStepButton onClick={handleConfirmation}>
          Подтвердить
        </NextStepButton>
      </StepButtonsContainer>
    </>
  );
};

const CheckStepHeader = ({ title }) => (
  <header className="check-step__header">
    <OrderBlockHeaderTitle title={title} />
  </header>
);

const CheckStepSection = ({ children }) => (
  <div className="check-step__section">{children}</div>
);

const CheckStepSectionRow = ({ children }) => (
  <div className="check-step__section_row">{children}</div>
);

const CheckStepSectionMain = ({ children }) => (
  <div className="check-step__section_main">{children}</div>
);

const CheckStepSectionAside = ({ children }) => (
  <div className="check-step__section_aside">{children}</div>
);

const CheckStepPassenger = ({
  ticket_type,
  document_type,
  birthday,
  last_name,
  first_name,
  patronymic,
  gender,
  passport_series,
  passport_number,
  birth_certificate_number,
}) => {
  return (
    <div className="check-step__passenger_item">
      <div className="passenger__type_container">
        <Icon wrapperClassName="passenger__icon" icon={PersonIcon} />
        <div className="passenger__type">{ticketTypes[ticket_type]}</div>
      </div>
      <div className="passenger__info">
        <div className="passenger__info_full-name">
          {last_name} {first_name}
          {patronymic && ` ${patronymic}`}
        </div>
        <CheckStepPassengerInfoUnit>
          Пол {genders[gender]}
        </CheckStepPassengerInfoUnit>
        <CheckStepPassengerInfoUnit>
          Дата рождения {formatBirthday(birthday)}
        </CheckStepPassengerInfoUnit>
        <CheckStepPassengerInfoUnit>
          {documentTypes[document_type]}{' '}
          {document_type === 'passport'
            ? `${passport_series} ${passport_number}`
            : birth_certificate_number}
        </CheckStepPassengerInfoUnit>
      </div>
    </div>
  );
};

const CheckStepPassengerInfoUnit = ({ children }) => (
  <div className="passenger__info_unit">{children}</div>
);
