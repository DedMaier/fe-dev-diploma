import './style.sass';

import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect } from 'react-router-dom';

import { PageHeader } from 'components/PageHeader';
import { Header } from 'components/Header';
import { Button } from 'components/Button';

import { ReactComponent as TicketsEmailIcon } from 'assets/icons/tickets_email.svg';
import { ReactComponent as TicketsIcon } from 'assets/icons/tickets.svg';
import { ReactComponent as ControlerIcon } from 'assets/icons/controler.svg';
import { ReactComponent as StarIcon } from 'assets/icons/star.svg';

import { setStep } from 'reducers/stepper';
import { formatNumber } from 'lib/helpers';

const ticketInstructions = [
  {
    icon: TicketsEmailIcon,
    text: (
      <>
        билеты будут отправлены на ваш <b>e-mail</b>
      </>
    ),
  },
  {
    icon: TicketsIcon,
    text: (
      <>
        <b>распечатайте</b> и сохраняйте билеты до даты поездки
      </>
    ),
  },
  {
    icon: ControlerIcon,
    text: (
      <>
        <b>предьявите</b> распечатанные билеты при посадке
      </>
    ),
  },
];

export const SuccessPage = () => {
  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.stepper);
  const {
    userData: { last_name, first_name, patronymic },
  } = useSelector((state) => state.order);

  const { price } = useSelector((state) => state.seats);

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => dispatch(setStep(1));
  }, []);

  return step !== 5 ? (
    <Redirect to="/" />
  ) : (
    <div className="success-page__container">
      <section className="success-page__header">
        <PageHeader />
        <div className="success-page__header_text hero_content_text text_accent">
          Благодарим вас за заказ!
        </div>
      </section>
      <section className="success-page__content_section">
        <div className="success-page__content">
          <header className="order-header">
            <div className="order-header__number">№ заказа 285АА</div>
            <div className="order-header__sum">
              сумма{' '}
              <span className="order-header__digits">
                {formatNumber(price.total)}
              </span>{' '}
              ₽
            </div>
          </header>
          <div className="order-information">
            <ul className="ticket-steps__list">
              {ticketInstructions.map((props, i) => (
                <TicketInstructionItem key={i} {...props} />
              ))}
            </ul>
            <div className="success-page__text">
              <Header size="m" className="order-information__title">
                {first_name} {patronymic || last_name}!
              </Header>
              <p className="success-page__paragraph">
                Ваш заказ успешно оформлен.
                <br />В ближайшее время с вами свяжется наш оператор для
                подтверждения.
              </p>
              <p className="success-page__paragraph text_accent">
                Благодарим Вас за оказанное доверие и желаем приятного
                путешествия!
              </p>
            </div>
          </div>
          <footer className="order-footer">
            <RateService />
            <Link to="/">
              <Button classname="success-page__button" size="l">
                Вернуться на главную
              </Button>
            </Link>
          </footer>
        </div>
      </section>
    </div>
  );
};

const RateService = () => {
  const [rating, setRating] = useState(0);

  const handleClick = (rating) => {
    setRating(rating);
  };

  return (
    <div className="rate-service">
      <div className="rate-service__label">Оценить сервис</div>
      <ul className="rate-service__stars">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            className="star__wrapper"
            onClick={() => handleClick(i + 1)}
          >
            <StarIcon className={cn('star', { filled: rating > i })} />
          </button>
        ))}
      </ul>
    </div>
  );
};

const TicketInstructionItem = ({ icon: Icon, text }) => {
  return (
    <li className="ticket-steps__item">
      <div className="ticket-step__icon_wrapper">
        <Icon className="ticket-step__icon" />
      </div>
      <div className="ticket-step__text">{text}</div>
    </li>
  );
};
